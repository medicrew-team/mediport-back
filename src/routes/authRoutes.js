const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken,registerValidationRules } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: authentication
 *   description: 인증 정보 관련 API
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Firebase ID 토큰을 이용한 사용자 로그인
 *     tags: [authentication]
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
 *     tags: [authentication]
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
 *     summary: 회원가입
 *     description: Firebase UID를 포함한 사용자 회원가입. 기저질환 및 복용 약 이력도 함께 저장됩니다.
 *     tags:
 *       - authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 example: firebase-uid-12345
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               name:
 *                 type: string
 *                 example: 홍길동
 *               nickname:
 *                 type: string
 *                 example: 길동이
 *               phone:
 *                 type: string
 *                 example: 010-1234-5678
 *               country:
 *                 type: string
 *                 example: KOR
 *               residence:
 *                 type: string
 *                 example: 서울특별시 강남구
 *               gender:
 *                 type: string
 *                 enum: [M, F, OTHER]
 *                 example: M
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *               disease_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *               history:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [{ "medi_name": "약 이름", "start_date": "2023-01-01", "end_date": "2023-12-31", "status": "복용 중", "dosage": "1일 1회" }]
 *               user_img:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 example: https://example.com/profile.png
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
 *                   example: 회원가입이 완료 되었습니다.
 *                 userProfile:
 *                   $ref: '#/components/schemas/UserResponseDto'
 *       200:
 *         description: 이미 존재하는 유저
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
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원가입 실패 : DB 에러"
 */
router.post('/register', verifyToken, authController.registerUser);

module.exports = router;