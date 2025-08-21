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
}

module.exports = new AuthService();