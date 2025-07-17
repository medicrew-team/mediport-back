const express = require('express');
const router= express.Router();
const UserController  = require('../controllers/UserController')
const { verifyToken, validate, registerValidationRules, updateProfileValidationRules } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자 정보 관련 API
 */



/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: 사용자 프로필 조회
 *     tags: [Users]
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
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 업데이트할 사용자 이름
 *               phone:
 *                 type: string
 *                 description: 업데이트할 사용자 전화번호
 *               country:
 *                 type: string
 *                 description: 업데이트할 사용자 국가
 *               disease_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 업데이트할 기저질환 ID 목록
 *             example:
 *               username: "업데이트된유저"
 *               phone: "010-1111-2222"
 *               country: "USA"
 *               disease_ids: [2, 4]
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
 * /api/users/profile/diseases:
 *   get:
 *     summary: 사용자 기저질환 조회
 *     tags: [Users]
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
router.get(
    '/profile/diseases',
    verifyToken,
    UserController.getUserDiseases
);

/**
 * @swagger
 * /api/users/profile/diseases:
 *   get:
 *     summary: 사용자 기저질환 조회
 *     tags: [Users]
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
router.get(
    '/profile/diseases',
    verifyToken,
    UserController.getUserDiseases
);

/**
 * @swagger
 * /api/users/withdraw:
 *   delete:
 *     summary: 사용자 탈퇴
 *     tags: [Users]
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