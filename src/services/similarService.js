const query = require('../utils/query.js');
const db    = require('../utils/db.js');
const path  = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { Translate } = require('@google-cloud/translate').v2;
const redisClient = require('../config/redisClient');
const translate = new Translate();

const OCR_URL = 'https://mediport-ai-dev.store/ocr/foreign-medicine';


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

exports.parseImage = async( file, target_lang='ko' ) => {
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
        const { foreign_medicine_names = [] } = data || {};
        const ocrText = foreign_medicine_names.find(s => !!(s && s.trim()))?.trim();

        console.log('3.ocrText:', ocrText);
        if (!ocrText) {
          throw new Error ( '의약품명을 추출하지 못했습니다.' );
        }
        
        if (!ocrText) {
          throw new Error ( '의약품명을 추출하지 못했습니다.' );
        }


        const [result] = await db.execute(query.parseImage, { ocr: ocrText });

        let dataToProcess = result;
        if (Array.isArray(result) && Array.isArray(result[0])) {
            console.log('Extracting first array from nested result');
            dataToProcess = result[0]; // 의약품 객체 배열 추출
        } else if (!Array.isArray(dataToProcess)) {
            console.warn('Result is not an array, converting to array:', dataToProcess);
            dataToProcess = [dataToProcess];
        }
        // 한국어 요청 시 원본 반환
        if (target_lang !=='ko') {
        
        // 번역 처리
        const translatedData = await Promise.all(dataToProcess.map(async (item) => {
            const translatedItem = { ...item };

            translatedItem.prod_name = await exports.translateWithCache(item.prod_name, target_lang);
            translatedItem.medi_form = await exports.translateWithCache(item.medi_form, target_lang);
            translatedItem.icd_sum = await exports.translateWithCache(item.icd_sum, target_lang);
            translatedItem.dosage = await exports.translateWithCache(item.dosage, target_lang);
            translatedItem.purchase_loc = await exports.translateWithCache(item.purchase_loc, target_lang);

            return translatedItem;
        }));
        
        return translatedData;
        }
        return dataToProcess;
        
    } catch (error) {
    if (error.response) {
      console.error('status:', error.response.status, 'data:', error.response.data);
      throw new Error(`Upstream error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      console.error('network:', error.message);
      throw new Error('Upstream connection error');
    }
  }
};



exports.parseText = async ( text, target_lang='ko' ) => {
    if ( !text ) throw new Error('text is required');

    try{
        const [result] = await db.execute(query.parseText, { text: text });

        let dataToProcess = result;
        if (Array.isArray(result) && Array.isArray(result[0])) {
            console.log('Extracting first array from nested result');
            dataToProcess = result[0]; // 의약품 객체 배열 추출
        } else if (!Array.isArray(dataToProcess)) {
            console.warn('Result is not an array, converting to array:', dataToProcess);
            dataToProcess = [dataToProcess];
        }
        // 한국어 요청 시 원본 반환
        if (target_lang !=='ko') {
        
        // 번역 처리
        const translatedData = await Promise.all(dataToProcess.map(async (item) => {
            const translatedItem = { ...item };

            translatedItem.prod_name = await exports.translateWithCache(item.prod_name, target_lang);
            translatedItem.medi_form = await exports.translateWithCache(item.medi_form, target_lang);
            translatedItem.icd_sum = await exports.translateWithCache(item.icd_sum, target_lang);
            translatedItem.dosage = await exports.translateWithCache(item.dosage, target_lang);
            translatedItem.purchase_loc = await exports.translateWithCache(item.purchase_loc, target_lang);

            return translatedItem;
        }));
        
        return translatedData;
        }
        return dataToProcess;
        
    } catch (error) {
    if (error.response) {
      console.error('status:', error.response.status, 'data:', error.response.data);
      throw new Error(`Upstream error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      console.error('network:', error.message);
      throw new Error('Upstream connection error');
    }
  }
};