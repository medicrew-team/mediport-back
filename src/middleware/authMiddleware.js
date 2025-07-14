const admin = require('../config/firebaseAdmin');
const { body, validationResult } = require('express-validator');

const verifyToken = async (req, res, next) => {
    // 개발 환경에서만 토큰 검증을 건너뛰고 가짜 사용자 정보 주입
    if (process.env.NODE_ENV === 'development' && !req.headers.authorization) {
        console.warn('개발 모드: 토큰 검증을 건너뛰고 가짜 사용자 정보를 주입합니다.');
        req.user = {
            uid: 'test_user_uid',
            email: 'test@example.com',
            name: 'Test User',
            // 필요한 다른 필드 추가
        };
        return next();
    }

    const idToken = req.headers.authorization?.split('Bearer ')[1];

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
        console.error('Firebase Id token error: ', error);
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