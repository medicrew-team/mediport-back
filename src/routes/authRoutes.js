const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken,registerValidationRules } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: auth
 *   description: 인증 정보 관련 API
 */


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Firebase ID 토큰을 이용한 사용자 로그인
 *     tags: [auth]
 *     security:
 *       - bearerAuth: []
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
 *                   example: "로그인 성공"
 *                 userProfile:
 *                   $ref: '#/components/schemas/UserResponseDto'
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유효하지 않은 토큰"
 */
router.post('/login', verifyToken, authController.loginUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 사용자 로그아웃
 *     tags: [auth]
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
 *                 message:
 *                   type: string
 *                   example: "로그아웃 성공"
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰)
 */
router.post('/logout', verifyToken, authController.logoutUser);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 사용자 등록
 *     tags: [auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "testuser@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               username:
 *                 type: string
 *                 example: "testuser"
 *               phone:
 *                 type: string
 *                 example: "010-1234-5678"
 *               country:
 *                 type: string
 *                 example: "South Korea"
 *               region:
 *               region:
 *                 type: string
 *                 example: "Seoul"
 *               disease_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1,2]
 *             required: ['email', 'password', 'username', 'phone', 'country']
 */
router.post('/register', verifyToken, registerValidationRules, authController.registerUser);

module.exports = router;