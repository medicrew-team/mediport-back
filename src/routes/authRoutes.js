const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken,registerValidationRules } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 사용자 인증 관련 API
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 사용자 로그인
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Firebase ID Token은 Authorization 헤더에 포함됩니다.
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 로그인 성공
 *                 user:
 *                   $ref: '#/components/schemas/UserResponseDto'
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       404:
 *         description: 가입되지 않은 사용자
 *       500:
 *         description: 서버 에러
 */
router.post('/login', verifyToken, authController.loginUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 사용자 로그아웃 (Firebase 토큰 무효화)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 사용자의 세션이 성공적으로 무효화되었습니다.
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *       500:
 *         description: 서버 에러
 */
router.post('/logout', verifyToken, authController.logoutUser);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 사용자 회원가입
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - phone
 *             properties:
 *               username:
 *                 type: string
 *                 description: 사용자 이름
 *                 example: testuser
 *               phone:
 *                 type: string
 *                 description: 사용자 전화번호 (하이픈 포함)
 *                 example: 010-1234-5678
 *               disease_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 사용자가 앓고 있는 질병 ID 목록 (선택 사항)
 *                 example: [1, 2]
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 회원가입 성공
 *                 user:
 *                   $ref: '#/components/schemas/UserResponseDto'
 *       400:
 *         description: 유효성 검사 실패 (잘못된 요청 데이터)
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 유효하지 않음)
 *       409:
 *         description: 이미 가입된 사용자
 *       500:
 *         description: 서버 에러
 */
router.post('/register', verifyToken, registerValidationRules, authController.registerUser);

module.exports = router;