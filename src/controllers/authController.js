const authService = require('../services/authService'); 
const RegisterUserDto = require('../dtos/User/registerUserDto');
const UserResponseDto = require('../dtos/auth/userResponseDto');
const UpdateProfileDto = require('../dtos/User/updateProfileDto');


exports.loginUser = async (req, res, next) => {
    try {
        const firebaseUid = req.user.uid;
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
        const firebaseUid = req.user.uid;
        const result = await authService.logoutUser(firebaseUid);
        res.status(200).json(result);
    } catch (error) {
        console.error("로그아웃 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};

exports.registerUser = async (req, res, next) => {
    try {
        const { username, phone, disease_ids } = req.body;
        const firebaseUid = req.user.uid; // verifyToken 미들웨어에서 주입된 UID 사용

        const registerUserDto = new RegisterUserDto({
            firebaseUid,
            username,
            phone,
            disease_ids
        });

        const newUser = await authService.registerUser(registerUserDto);
        res.status(201).json({
            message: '회원가입 성공',
            user: new UserResponseDto(newUser)
        });
    } catch (error) {
        console.error("회원가입 에러: ", error);
        if (error.message.includes('이미 가입된 사용자')) {
            return res.status(409).json({ message: error.message }); // Conflict
        }
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};

