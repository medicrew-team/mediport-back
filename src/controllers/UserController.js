const UserService = require("../services/UserService");
const UpdateProfileDto = require('../dtos/User/updateProfileDto');
const UserResponseDto = require('../dtos/auth/userResponseDto');
const MedicationHistoryResponseDto = require('../dtos/User/medicationHistoryResponseDto');
const updateMedicationHistoryDto = require('../dtos/User/updateMedicationHistoryDto');




/** 사용자 프로필 조회 */ 
exports.getUserProfile = async (req, res, next) => {
    try {
        const firebaseUid = req.user.uid;
        const user = await UserService.getUserProfile(firebaseUid);
        const userDto = new UserResponseDto(user);
        res.status(200).json({
            message: '사용자 정보 조회 성공',
            user: userDto
        });
        console.log("사용자 정보 조회 성공: ", userDto);
    } catch (error) {
        console.error("사용자 정보 조회 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};


/**
 * 사용자의 모든 복약 기록을 조회합니다.
 */
exports.getMedicationHistory = async (req, res, next) => {
    try {
        const userId = req.user.uid; // Assuming user ID is available from auth middleware
        const medicationHistory = await UserService.getMedicationHistory(userId);

        const responseData = medicationHistory.map(record => new MedicationHistoryResponseDto(record));

        res.status(200).json({
            message: '사용자 복약 기록 조회 성공',
            medicationHistory: responseData
        });
        console.log("사용자 복약 기록 조회 성공: ", responseData);
    } catch (error) {
        console.error("사용자 복약 기록 조회 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};
/**
 * 사용자의 복약 기록을 업데이트합니다.
 */
exports.updateMedicationHistory = async (req, res, next) => {
    try {
        const userId = req.user.uid; 
        const { historyId } = req.params;
        const { medi_name,start_date,end_date,status,dosage } = req.body;
        const medications = new updateMedicationHistoryDto(medi_name,start_date,end_date,status,dosage); 
        const updatedHistory = await UserService.updateMedicationHistory(userId, historyId, medications);
        const responseData = new MedicationHistoryResponseDto(updatedHistory);
        res.status(200).json({
            message: '복약 기록이 성공적으로 업데이트되었습니다.',
            updatedHistory: responseData
        });
        console.log("복약 기록 업데이트 성공: ", responseData);
    } catch (error) {
        console.error("복약 기록 업데이트 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};

/**
 * 특정 복약 기록의 상세 정보를 조회합니다.
 */
exports.getMedicationHistoryDetail = async (req, res, next) => {
    try {
        const { historyId } = req.params;
        const medicationDetail = await UserService.getMedicationHistoryDetail(historyId);

        const responseData = new MedicationHistoryResponseDto(medicationDetail);

        res.status(200).json({
            message: '복약 기록 상세 조회 성공',
            medicationDetail: responseData
        });
        console.log("복약 기록 상세 조회 성공: ", responseData);
    } catch (error) {
        console.error("복약 기록 상세 조회 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};


/** 사용자 기저질환 조회 */ 
exports.getUserDiseases = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const diseases = await UserService.getUserDiseases(firebaseUid);
        res.status(200).json({
            message: '사용자 기저질환 조회 성공',
            diseases: diseases
        });
        console.log("사용자 기저질환 조회 성공: ", diseases);
    } catch (error) {
        console.error("사용자 기저질환 조회 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};
/** 사용자 기저질환 업데이트 */
exports.updateUserDiseases = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { disease_ids } = req.body; // Expecting an array of disease IDs
        const updatedDiseases = await UserService.updateUserDiseases(firebaseUid, disease_ids);
        res.status(200).json({
            message: '사용자 기저질환이 성공적으로 업데이트되었습니다.',
            updatedDiseases: updatedDiseases
        });
        console.log("사용자 기저질환 업데이트 성공: ", updatedDiseases);
    } catch (error) {
        console.error("사용자 기저질환 업데이트 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};
/** 사용자 기저질환 금기약품 조회 */ 
exports.getUserProhibitMedi = async (req, res) => {
    try {
        const disease_id = req.params.disease_id;
        const target_lang = req.body.lang || 'ko'; // 기본 언어는 한국어
        const prohibit_medi = await UserService.getUserDiseasesProhibit(disease_id,target_lang);
        res.status(200).json({
            message: '사용자 기저질환 금기약품 조회 성공',
            prohibit_medi: prohibit_medi
        });
        console.log("사용자 기저질환 금기약품 조회 성공: ", prohibit_medi);
    }
    catch (error) {
        console.error("사용자 기저질환 금기약품 조회 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
}

/** 기저질환 금기약품 상세정보 조회 */
exports.getProhibitMediDetail = async (req, res) => {
    try {
        const { prod_name } = req.params;
        const target_lang = req.body.lang || 'ko'; // 기본 언어는 한국어
        const prohibitDetail = await UserService.getProhibitMediDetail(prod_name, target_lang);
        res.status(200).json({
            message: '금기약품 상세정보 조회 성공',
            prohibitDetail: prohibitDetail
        });
        console.log("금기약품 상세정보 조회 성공: ", prohibitDetail);
    } catch (error) {
        console.error("금기약품 상세정보 조회 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};


/** 사용자 정보 업데이트 */ 
exports.updateUserProfile = async (req, res, next) => {
    try {
        const firebaseUid = req.user.uid;
        const {phone,nickname,language,user_img} = req.body;
        const updateDto = new UpdateProfileDto(phone,nickname,language,user_img);

        const updatedUser = await UserService.updateUser(firebaseUid, updateDto);
        const userDto = new UserResponseDto(updatedUser);
        res.status(200).json({
            message: '사용자 정보가 성공적으로 업데이트되었습니다.',
            userProfile: userDto
        });
        console.log("사용자 정보 업데이트 성공: ", userDto);
    } catch (error) {
        console.error("사용자 정보 업데이트 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};

/** 사용자 탈퇴 */ 
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

/**
 * 사용자의 복약 기록을 추가합니다.
 */
exports.addMedicationHistory = async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const { medi_name, start_date, end_date, status, dosage } = req.body;
        const newMedicationDto = new updateMedicationHistoryDto(medi_name, start_date, end_date, status, dosage);
        const newHistory = await UserService.addMedicationHistory(userId, newMedicationDto);
        const responseData = new MedicationHistoryResponseDto(newHistory);
        res.status(201).json({
            message: '복약 기록이 성공적으로 추가되었습니다.',
            newHistory: responseData
        });
        console.log("복약 기록 추가 성공: ", responseData);
    } catch (error) {
        console.error("복약 기록 추가 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};

/**
 * 특정 복약 기록을 삭제합니다.
 */
exports.deleteMedicationHistory = async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const { historyId } = req.params;
        await UserService.deleteMedicationHistory(userId, historyId);
        res.status(200).json({
            message: '복약 기록이 성공적으로 삭제되었습니다.'
        });
        console.log(`복약 기록(ID: ${historyId}) 삭제 성공`);
    } catch (error) {
        console.error("복약 기록 삭제 에러: ", error);
        res.status(500).json({
            message: error.message || '서버 에러'
        });
    }
};