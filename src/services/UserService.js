const admin = require('../config/firebaseAdmin');
const User = require('../models/user');
const User_Disease = require('../models/user_disease');
const Disease = require('../models/disease');


class UserService {
    /* 회원가입 */
    async registerUser(firebaseUid,email,registerDto){
            try{
                const existingUser = await User.findByPk(firebaseUid);
    
                if(existingUser){
                    return { userProfile: existingUser, created: false };
                }
                const newUser = await User.create({
                    user_id: firebaseUid,
                    email: email,
                    user_name: registerDto.username,
                    phone: registerDto.phone,
                    country: registerDto.country
                })
    
                if (registerDto.disease_ids && registerDto.disease_ids.length > 0) {
                    const userDiseaseData = registerDto.disease_ids.map(disease_id => ({
                        user_id: newUser.user_id,
                        disease_id: disease_id
                    }));
                    await User_Disease.bulkCreate(userDiseaseData);
                }
    
                return {User : newUser , created: true};
            }
            catch(error){
                console.error('회원가입 에러 : ',error)
                throw new Error(`회원가입 실패 : ${error.message}`)
            }
        };

    /* 사용자 정보 업데이트 */
    async updateUser(firebaseUid, updateDto) {
        try {
            const user = await User.findByPk(firebaseUid);

            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }

            // 사용자 기본 정보 업데이트
            user.user_name = updateDto.username || user.user_name;
            user.phone = updateDto.phone || user.phone;
            user.country = updateDto.country || user.country;
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
            return this.loginUser(firebaseUid); // loginUser 재사용하여 기저질환 포함된 최신 정보 가져옴

        } catch (error) {
            console.error('사용자 정보 업데이트 에러 : ', error);
            throw new Error(`사용자 정보 업데이트 실패: ${error.message}`);
        }
    }
    // 사용자 프로필 조회
    async getUserProfile(firebaseUid) {
        try {
            const user = await User.findByPk(firebaseUid);
            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
            return user;
        } catch (error) {
            console.error('사용자 프로필 조회 에러 : ', error);
            throw new Error(`사용자 프로필 조회 실패: ${error.message}`);
        }
    }

    // 사용자 기저질환 조회
    async getUserDiseases(firebaseUid) {
        try {
            const user = await User.findByPk(firebaseUid, {
                include: [{
                    model: Disease,
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
    // 사용자 탈퇴
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
            console.error('사용자 탈퇴퇴 에러 : ', error);
            throw new Error(`사용자 탈퇴 실패: ${error.message}`);
        }
    }
}





module.exports = new UserService();

