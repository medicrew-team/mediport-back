const authService = require('../services/authService'); 
const RegisterUserDto = require('../dtos/User/registerUserDto');
const UserResponseDto = require('../dtos/auth/userResponseDto');

exports.loginUser = async (req, res, next) => {
    try {
        const firebaseUid = req.body.uid;
        const user = await authService.loginUser(firebaseUid);
        res.status(200).json({
            message: '로그인 성공',
            user: new UserResponseDto(user)
        });
    } catch (error) {
        console.error("로그인 에러: ", error);
        res.status(404).json({ // 사용자를 찾지 못한 경우 404 Not Found
            message: error.message || '서버 에러'
        });
    }
};

exports.logoutUser = async (req, res, next) => {
    try {
        const firebaseUid = req.body.uid;
        const result = await authService.logoutUser(firebaseUid);
        res.status(200).json(result);
    } catch (error) {
        console.error("로그아웃 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};


