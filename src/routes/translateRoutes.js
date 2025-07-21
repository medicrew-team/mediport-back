const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');
// 파일 업로드를 위한 multer 설정
// multer는 파일 업로드를 처리하는 미들웨어로, 파일을 서버에 저장
const multer = require('multer');
// 업로드된 파일을 저장할 디렉토리 설정
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /api/translate/stt-translate-tts:
 *   post:
 *     summary: Speech-to-Text, Translation, and Text-to-Speech
 *     description: Receives an audio file, converts it to text, translates the text to the target language, and returns the translated audio.
 *     tags:
 *       - Translate
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
 *                 description: Audio file to be processed.
 *               targetLanguage:
 *                 type: string
 *                 description: Target language for translation (e.g., 'en', 'ja').
 *     responses:
 *       200:
 *         description: Translated audio file.
 *         content:
 *           audio/mpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: No audio file uploaded.
 *       500:
 *         description: Error processing audio.
 */
router.post('/stt-translate-tts', upload.single('audio'), translateController.sttTranslateTts);

module.exports = router;