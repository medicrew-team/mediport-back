const admin = require('../config/firebaseAdmin');
const userService = require('./UserService');

class AuthService {
    /* 로그인 */
    async loginUser(firebaseUid) {
        try {
            const user = await userService.getUserProfile(firebaseUid);

            if (!user) {
                // getUserProfile 내부에서도 에러를 던지지만, 로그인 컨텍스트에 맞는 에러 메시지를 제공
                throw new Error('가입되지 않은 사용자입니다.');
            }

            return user;
        } catch (error) {
            // userService.getUserProfile에서 발생한 에러 또는 여기서 발생한 에러를 처리
            console.error('로그인 에러 : ', error);
            // 에러 메시지를 통합하여 전파
            throw new Error(`로그인 실패: ${error.message}`);
        }
    }

    /* 로그아웃 */
    async logoutUser(firebaseUid) {
        try {
            await admin.auth().revokeRefreshTokens(firebaseUid);
            return { success: true, message: '사용자의 세션이 성공적으로 무효화되었습니다.' };
        } catch (error) {
            console.error('Firebase 토큰 폐기 에러 : ', error);
            throw new Error(`로그아웃 실패: ${error.message}`);
        }
    }

    /* 회원가입 */
    async registerUser(firebaseUid, email, registerUserDto) {
        try {
            // 1. Firebase UID로 사용자 존재 여부 확인
            const existingUser = await userService.getUserProfile(firebaseUid);
            if (existingUser) {
                return { userProfile: existingUser, created: false };
            }

            // DTO에 UID와 이메일 추가
            registerUserDto.firebaseUid = firebaseUid;
            registerUserDto.email = email;

            // 2. 사용자 생성 (userService의 createUser 함수 사용)
            const newUser = await userService.createUser(registerUserDto);

            return { userProfile: newUser, created: true };
        } catch (error) {
            console.error('회원가입 에러 : ', error);
            throw new Error(`회원가입 실패: ${error.message}`);
        }
    }}

module.exports = new AuthService();