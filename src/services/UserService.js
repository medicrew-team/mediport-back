const admin = require('../config/firebaseAdmin');
const User = require('../models/user');
const User_Disease = require('../models/user_disease');
const Disease = require('../models/disease');
const DUR_chronic = require('../models/dur_chronic');
const User_Medi_History = require('../models/user_medi_history');
const KrMedi = require('../models/kr_medi');
const { Translate } = require('@google-cloud/translate').v2;
const redisClient = require('../config/redisClient');
const translate = new Translate();

class UserService {
    
    /** 텍스트 번역 */
    async translateWithCache(text, targetLanguage) { 
        const cacheKey = `translate:${targetLanguage}:${text}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return cached;
        }
        const [translated] = await translate.translate(text, targetLanguage);
        await redisClient.set(cacheKey, translated, 'EX', 604800); // 7일 동안 캐시
        return translated;
    };
    
    
    /** 회원가입 */
    async registerUser(registerDto){
        try{
                const existingUser = await User.findByPk(registerDto.user_id);
    
                if(existingUser){
                    return { userProfile: existingUser, created: false };
                }
                const newUser = await User.create({
                    user_id: registerDto.user_id,
                    email: registerDto.email,
                    user_name: registerDto.username,
                    nickname: registerDto.nickname,
                    gender: registerDto.gender,
                    birthday: registerDto.birthday,
                    phone: registerDto.phone,
                    region: registerDto.residence,
                    country: registerDto.country,
                    user_img : registerDto.img || null,
                    language : registerDto.language || 'ko' // 기본 언어는 한국어
                });
                // 기저질환 관계 설정
                if (registerDto.disease_ids && registerDto.disease_ids.length > 0)
                {
                    const userDiseaseData = registerDto.disease_ids.map(disease_id => ({
                        user_id: newUser.user_id,
                        disease_id: disease_id
                    }));
                    await User_Disease.bulkCreate(userDiseaseData);
                }
                // 사용자 메디 히스토리 관계 설정
                for (const h of registerDto.history) {
                    let krMediId = null;
                    let customName = null;
                
                    if (h.medi_name) {
                        const medi = await KrMedi.findOne({ where: { prod_name: h.medi_name } });
                        if (medi) {
                            krMediId = medi.kr_medi_id;
                        } else {
                            customName = h.medi_name; // DB에 없는 약은 custom_name에 저장
                        }
                    }
                
                    await User_Medi_History.create({
                        user_id: newUser.user_id,
                        kr_medi_id: krMediId,
                        custom_name: customName,
                        start_date: h.start_date,
                        end_date: h.end_date || null,
                        status: h.status || '복용 중',
                        dosage: h.dosage || null
                    });
                }
                
                // 사용자 프로필 반환
                newUser.Diseases = await User.findByPk(newUser.user_id, {
                    include: [{ model: Disease, as: 'Disease' }]
                  });
                newUser.User_Medi_History = await User_Medi_History.findAll({
                    where: { user_id: newUser.user_id },
                    attributes: ['history_id', 'kr_medi_id', 'custom_name', 'start_date', 'end_date', 'status', 'dosage'],
                    include: [{
                        model: KrMedi,
                        required: false // kr_medi가 없는 경우도 처리
                    }]
                });
                return { userProfile : newUser , created: true};
            }
            catch(error){
                console.error('회원가입 에러 : ',error)
                throw new Error(`회원가입 실패 : ${error.message}`)
            }
        };

   
    /**
     * 사용자의 모든 복약 기록을 조회합니다.
     * kr_medi_id가 없는 경우 custom_name을 사용하고, kr_medi 정보는 null로 처리합니다.
     */
    async getMedicationHistory(userId) {
        try {
            const medicationHistory = await User_Medi_History.findAll({
                where: { user_id: userId },
                include: [{
                    model: KrMedi,
                    required: false // LEFT JOIN
                }],
                order: [['start_date', 'DESC']] // 최신 기록부터 정렬
            });
            return medicationHistory;
        } catch (error) {
            console.error('사용자 복약 기록 조회 에러:', error);
            throw new Error(`사용자 복약 기록 조회 실패: ${error.message}`);
        }
    }
    /**
     * 복약 기록을 업데이트합니다.
     * kr_medi_id가 없는 경우 custom_name을 사용하고, kr_medi 정보는 null로 처리합니다.
     */
    async updateMedicationHistory(userId, updateData) {
        try {
            const history = await User_Medi_History.findByPk(updateData.historyId);

            if (!history) {
                throw new Error('복약 기록을 찾을 수 없습니다.');
            }

            if (history.user_id !== userId) {
                throw new Error('권한이 없습니다.');
            }

            let krMediId = history.kr_medi_id;
            let customName = history.custom_name;

            if (updateData.medi_name) {
                const medi = await KrMedi.findOne({ where: { prod_name: updateData.medi_name } });
                if (medi) {
                    krMediId = medi.kr_medi_id;
                    customName = null; // DB에 약이 있으면 custom_name은 비워줍니다.
                } else {
                    customName = updateData.medi_name; // DB에 없는 약은 custom_name에 저장
                    krMediId = null; // custom_name을 사용하면 kr_medi_id는 비워줍니다.
                }
            }

            history.kr_medi_id = krMediId;
            history.custom_name = customName;
            history.start_date = updateData.start_date || history.start_date;
            history.end_date = updateData.end_date === undefined ? history.end_date : updateData.end_date;
            history.status = updateData.status || history.status;
            history.dosage = updateData.dosage || history.dosage;

            await history.save();

            // 저장 후 KrMedi 관계를 포함하여 다시 로드
            const result = await User_Medi_History.findByPk(history.history_id, {
                include: [{
                    model: KrMedi,
                    required: false // kr_medi가 없는 경우도 처리 (LEFT JOIN)
                }]
            });

            return result;
        } catch (error) {
            console.error('복약 기록 업데이트 에러:', error);
            throw new Error(`복약 기록 업데이트 실패: ${error.message}`);
        }
    }

    /**
     * 복약 기록을 추가합니다.
     */
    async addMedicationHistory(userId, medicationData) {
        try {
            let krMediId = null;
            let customName = null;

            if (medicationData.medi_name) {
                const medi = await KrMedi.findOne({ where: { prod_name: medicationData.medi_name } });
                if (medi) {
                    krMediId = medi.kr_medi_id;
                } else {
                    customName = medicationData.medi_name; // DB에 없는 약은 custom_name에 저장
                }
            }

            const newHistory = await User_Medi_History.create({
                user_id: userId,
                kr_medi_id: krMediId,
                custom_name: customName,
                start_date: medicationData.start_date,
                end_date: medicationData.end_date || null,
                status: medicationData.status || '복용 중',
                dosage: medicationData.dosage || null
            });

            // 생성 후 KrMedi 관계를 포함하여 다시 로드
            const result = await User_Medi_History.findByPk(newHistory.history_id, {
                include: [{
                    model: KrMedi,
                    required: false // kr_medi가 없는 경우도 처리 (LEFT JOIN)
                }]
            });

            return result;
        } catch (error) {
            console.error('복약 기록 추가 에러:', error);
            console.log("medicationData:",medicationData);
            throw new Error(`복약 기록 추가 실패: ${error.message}`);
        }
    }

    /**
     * 특정 복약 기록을 삭제합니다.
     */
    async deleteMedicationHistory(userId, historyId) {
        try {
            const history = await User_Medi_History.findByPk(historyId);

            if (!history) {
                throw new Error('복약 기록을 찾을 수 없습니다.');
            }

            if (history.user_id !== userId) {
                throw new Error('권한이 없습니다.');
            }

            await history.destroy();

            return { success: true, message: '복약 기록이 성공적으로 삭제되었습니다.' };
        } catch (error) {
            console.error('복약 기록 삭제 에러:', error);
            console.log("historyId:",historyId);
            throw new Error(`복약 기록 삭제 실패: ${error.message}`);
        }
    }
    /**
     * 특정 복약 기록의 상세 정보를 조회합니다.
     * kr_medi_id가 없는 경우 custom_name을 사용하고, kr_medi 정보는 null로 처리합니다.
     */
    async getMedicationHistoryDetail(historyId) {
        try {
            const medicationDetail = await User_Medi_History.findByPk(historyId, {
                include: [{
                    model: KrMedi,
                    required: false // LEFT JOIN
                }]
            });

            if (!medicationDetail) {
                throw new Error('복약 기록을 찾을 수 없습니다.');
            }
            return medicationDetail;
        } catch (error) {
            console.error('복약 기록 상세 조회 에러:', error);
            throw new Error(`복약 기록 상세 조회 실패: ${error.message}`);
        }
    }

    /** 사용자 프로필 조회 */ 
    async getUserProfile(user_id) {
            try {
                const user = await User.findByPk(user_id,{
                    include: [{
                        model: Disease,
                        as: 'Disease',
                        attributes: ['disease_id', 'disease_name'],
                        through: { attributes: [] } // 연결 테이블의 속성은 필요 없으므로 비워둠
                    }, {
                        model : User_Medi_History,
                        as: 'UserMediHistories',
                        include: [{
                            model: KrMedi,
                            required: false // kr_medi가 없는 경우도 처리
                        }]
                    }]
                });
                if (!user) {
                    throw new Error('사용자를 찾을 수 없습니다.');
                }
                return user.get({ plain: true });
            } catch (error) {
                console.error('사용자 프로필 조회 에러 : ', error);
                throw new Error(`사용자 프로필 조회 실패: ${error.message}`);
            }
        }

    /** 사용자 정보 업데이트 */
    async updateUser(user_id, updateDto) {
        try {
            const user = await User.findByPk(user_id);

            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }

            const existingNickname = await User.findOne({
                where: { nickname: updateDto.nickname },
                attributes: ['user_id']
            });
            if( existingNickname && existingNickname.user_id !== user_id) {
                throw new Error('이미 사용 중인 닉네임입니다.');
            }

            // 사용자 기본 정보 업데이트
            user.nickname = updateDto.nickname || user.nickname;
            user.phone = updateDto.phone || user.phone;
            user.language = updateDto.language || user.language; // 언어 정보 업데이트
            user.user_img = updateDto.user_img || user.user_img; // 프로필 이미지 업데이트
            await user.save();
     
            // 사용자 프로필 반환
            return user;

        } catch (error) {
            console.error('사용자 정보 업데이트 에러 : ', error);
            throw new Error(`사용자 정보 업데이트 실패: ${error.message}`);
        }
    }

    /** 사용자 기저질환 조회 */ 
    async getUserDiseases(user_id) {
        try {
            const user = await User.findByPk(user_id, {
                include: [{
                    model: Disease,
                    as: 'Disease',
                    attributes: ['disease_id', 'disease_name'],
                    through: { attributes: [] }
                }]
            });
            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
            return user.Diseases;
        } catch (error) {
            console.error('사용자 기저질환 조회 에러 : ', error);
            throw new Error(`사용자 기저질환 조회 실패: ${error.message}`);
        }
    }
    /** 사용자 기저질환 업데이트 */
    async updateUserDiseases(user_id, disease_ids) {
        try {
            const user = await User.findByPk(user_id);
            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
            // 기존 기저질환 삭제
            await User_Disease.destroy({
                where: { user_id: user_id }
            });
            // 새로운 기저질환 추가
            if (disease_ids && disease_ids.length > 0) {
                const userDiseaseData = disease_ids.map(disease_id => ({
                    user_id: user_id,
                    disease_id: disease_id
                }));
                await User_Disease.bulkCreate(userDiseaseData);
            }
            // 업데이트된 기저질환 반환
            const updatedDiseases = await this.getUserDiseases(user_id);
            return updatedDiseases;
        }
        catch (error) {
            console.error('사용자 기저질환 업데이트 에러 : ', error);
            throw new Error(`사용자 기저질환 업데이트 실패: ${error.message}`);
        }    
    }  
    /** 기저질환 금기약품 조회 */
    async getUserDiseasesProhibit(disease_id,target_lang= 'ko') {
        try {
            const diseaseProhibit = await DUR_chronic.findAll({
                where: { disease_id: disease_id },
                attributes: ['dur_chronic_id', 'dur_prod_name', 'ing_code', 'atc_code', 'atc_ing', 'caution', 'dur_prod_img']
            });
            if (!diseaseProhibit || diseaseProhibit.length === 0) {
                throw new Error('해당 기저질환에 대한 금기약품이 없습니다.');
            }
            if (target_lang !== 'ko') {
                await Promise.all(diseaseProhibit.map(async (item) => {
                    item.dataValues.caution = await this.translateWithCache(item.caution, target_lang);
                  }));
                return diseaseProhibit;
            }
            return diseaseProhibit;    
        
    }    catch (error) {
            console.error('사용자 기저질환 금기약품 조회 에러 : ', error);
            throw new Error(`사용자 기저질환 금기약품 조회 실패: ${error.message}`);
        }
    }

    /** 금기약품 상세정보 조회 */
    async getProhibitMediDetail(prod_name, target_lang = 'ko') {
        try {
            const prohibitDetail = await DUR_chronic.findOne({
                where: { dur_prod_name: prod_name },
                attributes: ['dur_chronic_id', 'dur_prod_name', 'ing_code', 'atc_code', 'atc_ing', 'caution', 'dur_prod_img']
            });
            if (!prohibitDetail) {
                throw new Error('해당 금기약품에 대한 정보가 없습니다.');
            }
            if (target_lang !== 'ko') {
                prohibitDetail.dataValues.caution = await this.translateWithCache(prohibitDetail.caution, target_lang);
            }
            return prohibitDetail;
        } catch (error) {
            console.error('금기약품 상세정보 조회 에러 : ', error);
            throw new Error(`금기약품 상세정보 조회 실패: ${error.message}`);
        }
    };

    /** 회원 탈퇴 */
    async deleteUser(user_id) {
        try {
            const user = await User.findByPk(user_id);
            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
            // 기저질환 정보 삭제
            await User_Disease.destroy({
                where: { user_id: user_id }
            });
            // 사용자 정보 삭제
            await user.destroy();
            // Firebase에서 사용자 삭제
            await admin.auth().deleteUser(user_id);
            return { success: true, message: '사용자가 성공적으로 탈퇴되었습니다.' };
        } catch (error) {
            console.error('사용자 탈퇴 에러 : ', error);
            throw new Error(`사용자 탈퇴 실패: ${error.message}`);
        }
    }
}

module.exports = new UserService();

