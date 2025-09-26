const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   name: translate
 *   description: 번역 관련 API
 */

/**
 * =====================================
 * ✅ OpenAPI 3.0 스타일
 * =====================================
 * @swagger
 * /api/translate:
 *   post:
 *     summary: 통합 번역 (음성, 텍스트, 이미지)
 *     tags: [translate]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: 번역할 음성 파일 (Opus)
 *               sourceLanguage:
 *                 type: string
 *                 description: 원본 언어 코드 (e.g., 'KO', 'EN')
 *                 example: "KO"
 *               targetLanguage:
 *                 type: string
 *                 description: 타겟 언어 코드 (e.g., 'EN', 'KO')
 *                 example: "EN"
 *               text:
 *                 type: string
 *                 description: 번역할 텍스트 (음성 파일이 없을 경우 사용)
 *     responses:
 *       200:
 *         description: 번역 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 translated_text:
 *                   type: string
 *                   example: "This is a translated sentence."
 *       400:
 *         description: 잘못된 요청 (필수 파라미터 누락 등)
 *       500:
 *         description: 서버 에러
 */
router.post('/', upload.single('audio'), translateController.processTranslation);

module.exports = router;
