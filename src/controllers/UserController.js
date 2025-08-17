const UserService = require("../services/UserService");
const UpdateProfileDto = require('../dtos/User/updateProfileDto');
const UserResponseDto = require('../dtos/auth/userResponseDto');
const authService = require("../services/authService");
const RegisterUserDto = require('../dtos/User/registerUserDto');


exports.registerUser = async (req, res, next) => {
    try {
        const firebaseUid = req.user.uid;
        const email = req.user.email; 
        const { username,nickname ,phone, country,region,gender,birthday,disease_ids } = req.body;
``
        const registerDto = new RegisterUserDto( username,nickname ,phone, country,region,gender,birthday,disease_ids );

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

// 사용자 프로필 조회
exports.getUserProfile = async (req, res, next) => {
    try {
        const firebaseUid = req.user.uid;
        const user = await UserService.getUserProfile(firebaseUid);
        res.status(200).json({
            message: '사용자 정보 조회 성공',
            user: new UserResponseDto(user)
        });
    } catch (error) {
        console.error("사용자 정보 조회 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};

// 사용자 기저질환 조회
exports.getUserDiseases = async (req, res, next) => {
    try {
        const firebaseUid = req.user.uid;
        const diseases = await UserService.getUserDiseases(firebaseUid);
        res.status(200).json({
            message: '사용자 기저질환 조회 성공',
            diseases: diseases
        });
    } catch (error) {
        console.error("사용자 기저질환 조회 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};
// 사용자 기저질환 금기약품 조회
exports.getUserProhibitMedi = async (req, res, next) => {
    try {
        const disease_id = req.params.disease_id;
        const prohibit_medi = await UserService.getUserDiseasesProhibit(disease_id);
        res.status(200).json({
            message: '사용자 기저질환 금기약품 조회 성공',
            prohibit_medi: prohibit_medi
        });
    }
    catch (error) {
        console.error("사용자 기저질환 금기약품 조회 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
}

// 사용자 정보 업데이트
exports.updateUserProfile = async (req, res, next) => {
    try {
        const firebaseUid = req.user.uid;
        const { phone, disease_ids } = req.body;
        const updateDto = new UpdateProfileDto( phone, disease_ids);

        const updatedUser = await UserService.updateUser(firebaseUid, updateDto);

        res.status(200).json({
            message: '사용자 정보가 성공적으로 업데이트되었습니다.',
            userProfile: new UserResponseDto(updatedUser)
        });
    } catch (error) {
        console.error("사용자 정보 업데이트 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};

// 사용자 탈퇴
exports.deleteUserProfile = async (req, res, next) => {
    try {
        const firebaseUid = req.user.uid;
        await UserService.deleteUser(firebaseUid);
        res.status(200).json({
            message: '사용자 정보가 성공적으로 삭제되었습니다.'
        });
    } catch (error) {
        console.error("사용자 정보 삭제 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
}