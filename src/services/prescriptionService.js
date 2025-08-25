const query = require('../utils/query.js');
const db    = require('../utils/db.js');
const path  = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { Translate } = require('@google-cloud/translate').v2;
const redisClient = require('../config/redisClient');
const { text } = require('stream/consumers');
const translate = new Translate();

const OCR_URL = 'https://mediport-ai-dev.store/ocr/korean-medicine';


 /** 텍스트 번역 */
exports.translateWithCache = async ( text, targetLanguage ) => {
      const cacheKey = `translate:${targetLanguage}:${text}`;
      
      try {
        const cached = await redisClient.get(cacheKey);
        
        if (cached) {
            return cached;
        } else {
            const [translated] = await translate.translate(text, targetLanguage);
            if (!translated) {
                return text; // 빈 결과 시 원본 반환
            }
            await redisClient.set(cacheKey, translated, 'EX', 604800); // 7일 동안 캐시
        
            return translated;
        }
    } catch (error) {
        console.error('Translation error:', {
            message: error.message,
            stack: error.stack,
            text,
            targetLanguage
        });
        return text; // 에러 발생 시 원본 반환
    }
};

exports.parseImage = async( file, id ) => {
    if ( !file ) throw new Error('file is required'); 

    try{
      const form = new FormData();
      form.append('file', fs.createReadStream(file.path), file.originalname);

      const { data } = await axios.post(OCR_URL, form, {
          headers: {
          ...form.getHeaders(),
          Authorization: 'Bearer your-token',
          },
      });


        const { medicine_names = [], mapped_result = {} } = data || {}; //구조분해 할당

            if (medicine_names.length === 0) {
              console.log('약 이름이 감지되지 않았습니다.');
              return [];
            }

          const [dbResults] = await db.query(query.parseKrImage, [medicine_names]);

         
          // 2. 결과 병합
          const mergedResults = dbResults.map(row => {
            const mapped = mapped_result[row.prod_name] || {};
            return {
              name: row.prod_name,
              dbInfo: {
                form: row.medi_form,
                icd_sum: row.icd_sum,
                location: row.purchase_loc,
                dosage: row.dosage,
                image: row.prod_img,
                bit: row.bit, 
                contraindicated: row.contraindicated, 
                storage_method: row.storage_method,
                daily_interaction: row.daily_interaction,
                drug_interaction: row.drug_interaction,
                adverse_reaction: row.adverse_reaction
              },
              ocrInfo: mapped // {투약량, 횟수, 일수}
            };
          });

         
              let dataToProcess = mergedResults;
        if (Array.isArray(mergedResults) && Array.isArray(mergedResults[0])) {
            console.log('Extracting first array from nested result');
            dataToProcess = mergedResults[0]; // 의약품 객체 배열 추출
        } else if (!Array.isArray(dataToProcess)) {
            console.warn('Result is not an array, converting to array:', dataToProcess);
            dataToProcess = [dataToProcess];
        }
        

        const [rows] = await db.query(query.getLang, [ id ]);
        const target_lang = rows[0]?.language;
 
        //한국어 요청 시 원본 반환
        if (target_lang !== 'ko') {
            const translatedData = await Promise.all(dataToProcess.map(async (item) => {
              const translatedItem = { ...item };

              // name (prod_name)
              translatedItem.name = await exports.translateWithCache(item.name, target_lang);

              // dbInfo 내부 번역
              translatedItem.dbInfo = {
                ...item.dbInfo,
                form             : await exports.translateWithCache(item.dbInfo.form, target_lang),
                icd_sum          : await exports.translateWithCache(item.dbInfo.icd_sum, target_lang),
                location         : await exports.translateWithCache(item.dbInfo.location, target_lang),
                dosage           : await exports.translateWithCache(item.dbInfo.dosage, target_lang),
                purchase_loc     : await exports.translateWithCache(item.dbInfo.purchase_loc, target_lang),
                bit              : await exports.translateWithCache(item.dbInfo.bit, target_lang),
                contraindicated  : await exports.translateWithCache(item.dbInfo.contraindicated, target_lang),
                dostorage_method : await exports.translateWithCache(item.dbInfo.storage_method, target_lang),
                daily_interaction:await exports.translateWithCache(item.dbInfo.daily_interaction, target_lang),
                drug_interaction :await exports.translateWithCache(item.dbInfo.drug_interaction , target_lang),
                adverse_reaction :await exports.translateWithCache(item.dbInfo.adverse_reaction, target_lang),
                image: item.dbInfo.image // URL은 번역 필요 없음
              };

              // ocrInfo 번역 (key + value 모두 번역)
              translatedItem.ocrInfo = {};
              for (const [key, value] of Object.entries(item.ocrInfo || {})) {
                const translatedKey   = await exports.translateWithCache(key, target_lang);
                const translatedValue = isNaN(value) 
                  ? await exports.translateWithCache(value, target_lang) 
                  : value; // 숫자는 그대로 유지
                translatedItem.ocrInfo[translatedKey] = translatedValue;
              }

              return translatedItem;
            }));

            return translatedData;
          }
          return dataToProcess;
                  }
      

    catch (error) {
    if (error.response) {
      console.error('status:', error.response.status, 'data:', error.response.data);
      throw new Error(`Upstream error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      console.error('network:', error.message);
      throw new Error('Upstream connection error');
    };
    }
};

