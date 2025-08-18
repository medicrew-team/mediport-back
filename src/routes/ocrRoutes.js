const express = require('express');
const router  = express.Router();
const ocrController = require('../controllers/ocrController');
const { verifyToken } = require('../middleware/authMiddleware');

const path   = require('path');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   name: ocr
 *   description: ocr 관련 API
 */

/**
 * @swagger
 * /ocr/foreign-medicine/image:
 *   post:
 *     summary: 이미지 업로드 후 OCR 결과 반환
 *     tags: [OCR]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 이미지 파일 (jpg, png 등)
 *               language:
 *                 type: string
 *                 description: OCR 대상 언어 코드 (예: ko, en, ja, cn)
 *                 example: ko
 *     responses:
 *       200:
 *         description: OCR 처리 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *                   description: 추출된 텍스트
 *                   example: "{ "foreign_medicine_names": [ "开瑞坦" ] }"
 *                 provider:
 *                   type: string
 *                   example: google_vision
 *       400:
 *         description: 잘못된 요청 (파일 누락, 잘못된 형식)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: file 필드가 필요합니다.
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
router.post('/foreign-medicine/image', upload.single('file'), ocrController.parseImage)






module.exports = router;