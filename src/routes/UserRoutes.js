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
 * /api/users/register:
 *   post:
 *     summary: 소셜 로그인 후 신규 사용자 회원가입
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
 *                 description: 사용자 이름
 *               phone:
 *                 type: string
 *                 description: 사용자 전화번호
 *               country:
 *                 type: string
 *                 description: 사용자 국가
 *               disease_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 사용자가 선택한 기저질환 ID 목록
 *             required:
 *               - username
 *               - phone
 *               - country
 *             example:
 *               username: "testuser@example.com"
 *               phone: "010-9999-8888"
 *               country: "South Korea"
 *               disease_ids: [1, 3]
 *     responses:
 *       201:
 *         description: 회원가입 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 회원가입이 완료 되었습니다.
 *                 userProfile:
 *                   $ref: '#/components/schemas/UserResponseDto'
 *       200:
 *         description: 이미 존재하는 유저 (재호출 시)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 이미 존재하는 유저입니다. 새로운 회원가입은 이루어지지 않았습니다.
 *                 userProfile:
 *                   $ref: '#/components/schemas/UserResponseDto'
 *       400:
 *         description: 잘못된 요청 (필수 필드 누락 등)
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       500:
 *         description: 서버 에러
 */
router.post(
    '/register',
    verifyToken,
    registerValidationRules(),
    validate,
    UserController.registerUser
);

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