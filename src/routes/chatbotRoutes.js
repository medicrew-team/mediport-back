const express = require('express');
const router  = express.Router();
const chatbotController = require('../controllers/chatbotController.js');
const { verifyToken } = require('../middleware/authMiddleware');
const multer = require('multer');

/**
 * @swagger
 * tags:
 *   name: chatbot
 *   description: 증상별 일반의약품 추천 챗봇 관련 API
 */

/**
 * @swagger
 * /recommand-medicine:
 *   post:
 *     summary: 텍스트 입력 후 챗봇 답변 반환
 *     tags: [chatbot]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_input
 *             properties:
 *               user_input:
 *                 type: string
 *                 description:  텍스트 입력
 *                 example: "머리가 아파"
 *     responses:
 *       200:
 *         description: 텍스트 처리 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_input:
 *                   type: string
 *                   description: 텍스트 결과
 *                   example: "머리가 아파"
 *                 provider:
 *                   type: string
 *                   example: text
 *       400:
 *         description: 잘못된 요청 (텍스트 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: text 필드가 필요합니다.
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 유효하지 않거나 만료된 토큰입니다.
 *       500:
 *         description: 서버 오류
 */
router.post('/recommand-medicine', verifyToken, chatbotController.chatbot)

module.exports = router;