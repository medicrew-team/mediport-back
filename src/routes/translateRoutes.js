const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// 통합 번역 라우트
router.post('/translate', upload.single('audio'), translateController.processTranslation);

module.exports = router;