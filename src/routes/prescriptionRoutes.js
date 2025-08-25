const express = require('express');
const router  = express.Router();
const prescriptionController = require('../controllers/prescriptionController.js');
const { verifyToken } = require('../middleware/authMiddleware');
const path   = require('path');
const multer = require('multer');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, 'uploads');
try {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} catch (err) {
  console.error('Failed to create upload directory:', err);
  throw err;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const base = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, base + ext); // 확장자 유지
  },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/tiff', 'image/tif'];
    if (allowedTypes.includes(file.mimetype)) {
        return cb(null, true);
    }
    cb(new Error('Only image files (png, jpg, jpeg, webp, tiff) are allowed'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 예시
  fileFilter,
});

/**
 * @swagger
 * tags:
 *   name: prescription
 *   description: 처방약 OCR 관련 API
 */

/**
 * @swagger
 * /api/prescription/korean-medicine/image:
 *   post:
 *     summary: 이미지 업로드 후 OCR 결과 반환
 *     tags: [prescription]
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
 *                   example: '{ "medicine_names": ["엔클로페낙정"] }'
 *                
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
router.post('/korean-medicine/image', verifyToken, upload.single('file'), prescriptionController.parseImage)

module.exports = router;