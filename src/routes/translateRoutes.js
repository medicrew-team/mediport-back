const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   name: Translate
 *   description: 번역 관련 API
 */

/**
 * @swagger
 * /api/translate:
 *   post:
 *     summary: 통합 번역 (음성, 텍스트, 이미지)
 *     tags: [Translate]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: audio
 *         type: file
 *         description: 번역할 음성 파일 (Opus)
 *       - in: formData
 *         name: source_lang
 *         type: string
 *         required: true
 *         description: 원본 언어 코드 (e.g., 'KO', 'EN')
 *       - in: formData
 *         name: target_lang
 *         type: string
 *         required: true
 *         description: 타겟 언어 코드 (e.g., 'EN', 'KO')
 *       - in: formData
 *         name: text
 *         type: string
 *         description: 번역할 텍스트 (음성 파일이 없을 경우 사용)
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
