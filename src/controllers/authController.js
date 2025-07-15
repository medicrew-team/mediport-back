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
        const firebaseUid = req.user.uid;
        const email = req.user.email; 
        const { username, phone, country, disease_ids } = req.body;

        const registerDto = new RegisterUserDto(username, phone, country, disease_ids);

        const { userProfile, created } = await authService.registerUser(firebaseUid, email, registerDto);

        if (created) {
            res.status(201).json({
                message: '회원가입이 완료 되었습니다.',
                userProfile: new UserResponseDto(userProfile)
            });
        } else {
            res.status(200).json({ 
                message: '이미 존재하는 유저입니다. 새로운 회원가입은 이루어지지 않았습니다.', 
                userProfile: new UserResponseDto(userProfile)
            });
        }
    } catch (error) {
        console.error("회원가입 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};

