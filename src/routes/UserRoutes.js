const express = require('express');
const router= express.Router();
const UserController  = require('../controllers/UserController')
const { verifyToken, validate, registerValidationRules, updateProfileValidationRules } = require('../middleware/authMiddleware');
const { route } = require('./authRoutes');

/**
 * @swagger
 * tags:
 *   name: user
 *   description: 사용자 정보 관련 API
 */




/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: 사용자 프로필 조회
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 프로필 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 사용자 정보 조회 성공
 *                 user:
 *                   $ref: '#/components/schemas/UserResponseDto'
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 *   put:
 *     summary: 사용자 프로필 업데이트
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: 업데이트할 사용자 전화번호
 *               disease_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 업데이트할 기저질환 ID 목록
 *               language:
 *                 type: string
 *                 description: "사용자의 선호 언어 코드 (예: 'ko', 'en')"
 *               user_img:
 *                 type: string
 *                 format: uri
 *                 description: 사용자의 프로필 이미지 URL
 *               history:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     medi_name:
 *                       type: string
 *                     start_date:
 *                       type: string
 *                       format: date
 *                     end_date:
 *                       type: string
 *                       format: date
 *                     status:
 *                       type: string
 *                     dosage:
 *                       type: string
 *                 description: 사용자가 복용 중인 약물 이력
 *             example:
 *               phone: "010-1111-2222"
 *               disease_ids: [2, 4]
 *               language: "ko"
 *               user_img: https://example.com/profile.png
 *               history:
 *                 - medi_name: "약 이름"
 *                   start_date: "2023-01-01"
 *                   end_date: "2023-12-31"
 *                   status: "복용 중"
 *                   dosage: "1일 1회"
 *     responses:
 *       200:
 *         description: 사용자 정보 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 사용자 정보가 성공적으로 업데이트되었습니다.
 *                 userProfile:
 *                   $ref: '#/components/schemas/UserResponseDto'
 *       400:
 *         description: 잘못된 요청 (유효성 검사 실패 등)
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.get(
    '/profile',
    verifyToken,
    UserController.getUserProfile
);

router.put(
    '/profile',
    verifyToken,
    validate,
    UserController.updateUserProfile
);

/**
 * @swagger
 * /api/users/medications:
 *   get:
 *     summary: 사용자 복약 기록 목록 조회
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 복약 기록 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 사용자 복약 기록 조회 성공
 *                 medicationHistory:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MedicationHistoryResponseDto'
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       500:
 *         description: 서버 에러
 * /api/users/medications/{historyId}:
 *   get:
 *     summary: 특정 복약 기록 상세 조회
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: historyId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 조회할 복약 기록의 ID
 *     responses:
 *       200:
 *         description: 복약 기록 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 복약 기록 상세 조회 성공
 *                 medicationDetail:
 *                   $ref: '#/components/schemas/MedicationHistoryResponseDto'
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       404:
 *         description: 복약 기록을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.get(
    '/medications',
    verifyToken,
    UserController.getMedicationHistory
);

router.get(
    '/medications/:historyId',
    verifyToken,
    UserController.getMedicationHistoryDetail
);


/**
 * @swagger
 * /api/users/profile/diseases:
 *   get:
 *     summary: 사용자 기저질환 조회
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 기저질환 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 사용자 기저질환 조회 성공
 *                 diseases:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       disease_id:
 *                         type: integer
 *                       disease_name:
 *                         type: string
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.get('/profile/diseases',verifyToken,UserController.getUserDiseases);

/**
 * @swagger
 * /api/users/profile/diseases/{disease_id}:
 *   get:
 *     summary: 특정 기저질환에 대한 금기 약물 정보 조회
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disease_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 금기 약물 정보를 조회할 기저질환 ID
 *     responses:
 *       200:
 *         description: 금기 약물 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "금기 약물 정보 조회 성공"
 *                 prohibited_medications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       medi_name:
 *                         type: string
 *                       prohibit_reason:
 *                         type: string
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       404:
 *         description: 해당 기저질환 정보를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.get('/profile/diseases/:disease_id', verifyToken, UserController.getUserProhibitMedi);

/**
 * @swagger
 * /api/users/withdraw:
 *   delete:
 *     summary: 사용자 탈퇴
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 탈퇴 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 사용자 정보가 성공적으로 삭제되었습니다.
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.delete(
    '/withdraw',
    verifyToken,
    UserController.deleteUserProfile
)

module.exports = router;