const authService = require('../services/authService');
const UserService = require('../services/UserService');
const RegisterUserDto = require('../dtos/User/registerUserDto');
const UserResponseDto = require('../dtos/auth/userResponseDto');

/** 회원가입 */
exports.registerUser = async (req, res, next) => {
    try {
        const user_id = req.user.uid;
        const email = req.user.email; 
        const { name,nickname ,phone, country,residence,gender,birthday,disease_ids,history,img,language } = req.body;

        const registerDto = new RegisterUserDto(user_id,email,name,nickname ,phone, country,residence,gender,birthday,disease_ids,history,img,language);

        const { userProfile, created } = await UserService.registerUser(registerDto);

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

exports.loginUser = async (req, res, next) => {
    try {
        const user_id = req.user.uid;
        const user = await authService.loginUser(user_id);
        const userDto = new UserResponseDto(user);
        res.status(200).json({
            message: '로그인 성공',
            user: userDto
        });
        console.log("로그인 성공: ", userDto);
    } catch (error) {
        console.error("로그인 에러: ", error);
        res.status(404).json({ // 사용자를 찾지 못한 경우 404 Not Found
            message: error.message || '서버 에러'
        });
    }
};

exports.logoutUser = async (req, res, next) => {
    try {
        const user_id = req.user.uid;
        const result = await authService.logoutUser(user_id);
        res.status(200).json(result);
        console.log("로그아웃 성공: ", result);
    } catch (error) {
        console.error("로그아웃 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};


