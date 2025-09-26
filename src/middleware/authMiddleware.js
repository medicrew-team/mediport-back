const admin = require('../config/firebaseAdmin');
const { body, validationResult } = require('express-validator');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    
    // 정규식으로 Bearer 토큰 파싱 (예외 방지)
    const match = authHeader.match(/^Bearer (.+)$/);
    const idToken = match ? match[1] : null;

    if (!idToken) {
        return res.status(401).json({
            message: 'Unauthorized: 토큰이 제공되지 않았습니다.'
        });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Firebase ID Token Error:', error.code || error.message);
        return res.status(403).json({
            message: '토큰이 유효하지 않거나 만료되었습니다.'
        });
    }
};


const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({ errors: errors.array() });
};

const registerValidationRules = () => {
    return [
        body('username').notEmpty().withMessage('사용자 이름은 필수입니다.'),
        body('phone').matches(/^\d{3}-\d{3,4}-\d{4}$/).withMessage('전화번호 형식이 올바르지 않습니다.'),
        body('disease_ids').optional().isArray().withMessage('disease_ids는 배열이어야 합니다.'),
        body('disease_ids.*').isInt().withMessage('disease_ids 배열에는 숫자만 포함되어야 합니다.')
    ];
}

module.exports = {
    verifyToken,
    validate,
    registerValidationRules
};