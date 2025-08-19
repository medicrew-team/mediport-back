const admin = require('../config/firebaseAdmin');
const User = require('../models/user');
const User_Disease = require('../models/user_disease');
const Disease = require('../models/disease');
const DUR_chronic = require('../models/dur_chronic');
const { Translate } = require('@google-cloud/translate').v2;
const redisClient = require('../config/redisClient');
const translate = new Translate();

class UserService {

    
    /** 회원가입 */
    async registerUser(registerDto){
            try{
                const existingUser = await User.findByPk(registerDto.firebaseUid);
    
                if(existingUser){
                    return { userProfile: existingUser, created: false };
                }
                const newUser = await User.create({
                    user_id: firebaseUid,
                    email: registerDto.email,
                    user_name: registerDto.username,
                    nickname: registerDto.nickname,
                    gender: registerDto.gender,
                    birthday: registerDto.birthday,
                    phone: registerDto.phone,
                    region: registerDto.residence,
                    country: registerDto.country,
                    user_img : registerDto.img || null,
                });


                return {User : newUser , created: true};
            }
            catch(error){
                console.error('회원가입 에러 : ',error)
                throw new Error(`회원가입 실패 : ${error.message}`)
            }
        };
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

   

    /** 사용자 정보 업데이트 */
    async updateUser(firebaseUid, updateDto) {
        try {
            const user = await User.findByPk(firebaseUid);

            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }

            // 사용자 기본 정보 업데이트
            user.phone = updateDto.phone || user.phone;
            await user.save();

            // 기저질환 정보 업데이트 (기존 삭제 후 새로 생성)
            if (updateDto.disease_ids && updateDto.disease_ids.length > 0) {
                // disease_ids 유효성 검사
                const foundDiseases = await Disease.findAll({
                    where: {
                        disease_id: updateDto.disease_ids
                    }
                });

                if (foundDiseases.length !== updateDto.disease_ids.length) {
                    throw new Error('존재하지 않는 질병 ID가 포함되어 있습니다.');
                }

                await User_Disease.destroy({
                    where: { user_id: firebaseUid }
                });

                const userDiseaseData = updateDto.disease_ids.map(disease_id => ({
                    user_id: firebaseUid,
                    disease_id: disease_id
                }));
                await User_Disease.bulkCreate(userDiseaseData);
            } else {
                // 업데이트하려는 질병 목록이 없는 경우, 기존 관계 모두 삭제
                await User_Disease.destroy({
                    where: { user_id: firebaseUid }
                });
            }

            // 업데이트된 사용자 정보 반환 (기저질환 포함)
            const updatedUserWithDiseases = await this.getUserProfile(firebaseUid);
            return updatedUserWithDiseases;

        } catch (error) {
            console.error('사용자 정보 업데이트 에러 : ', error);
            throw new Error(`사용자 정보 업데이트 실패: ${error.message}`);
        }
    }
    /** 사용자 프로필 조회 */ 
    async getUserProfile(firebaseUid) {
        try {
            const user = await User.findByPk(firebaseUid,{
                include: [{
                    model: Disease,
                    as: 'Diseases',
                    attributes: ['disease_id', 'disease_name'],
                    through: { attributes: [] } // 연결 테이블의 속성은 필요 없으므로 비워둠
                }]
            });
            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
            return user;
        } catch (error) {
            console.error('사용자 프로필 조회 에러 : ', error);
            throw new Error(`사용자 프로필 조회 실패: ${error.message}`);
        }
    }

    /** 사용자 기저질환 조회 */ 
    async getUserDiseases(firebaseUid) {
        try {
            const user = await User.findByPk(firebaseUid, {
                include: [{
                    model: Disease,
                    as: 'Diseases',
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
                    item.dataValues.caution_translated = await this.translateWithCache(item.caution, target_lang);
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
                prohibitDetail.dataValues.caution_translated = await this.translateWithCache(prohibitDetail.caution, target_lang);
            }
            return prohibitDetail;
        } catch (error) {
            console.error('금기약품 상세정보 조회 에러 : ', error);
            throw new Error(`금기약품 상세정보 조회 실패: ${error.message}`);
        }
    };
    /** 회원 탈퇴 */
    async deleteUser(firebaseUid) {
        try {
            const user = await User.findByPk(firebaseUid);
            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
            // 기저질환 정보 삭제
            await User_Disease.destroy({
                where: { user_id: firebaseUid }
            });
            // 사용자 정보 삭제
            await user.destroy();
            // Firebase에서 사용자 삭제
            await admin.auth().deleteUser(firebaseUid);
            return { success: true, message: '사용자가 성공적으로 탈퇴되었습니다.' };
        } catch (error) {
            console.error('사용자 탈퇴 에러 : ', error);
            throw new Error(`사용자 탈퇴 실패: ${error.message}`);
        }
    }
}

module.exports = new UserService();

