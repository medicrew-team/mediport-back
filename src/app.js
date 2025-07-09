// src/app.js
const express = require('express');
const cors = require('cors'); // CORS 설정 (필요시)
const morgan = require('morgan'); // HTTP 요청 로거 (개발용)

const { connectDB } = require('./config/sequelize'); // 데이터베이스 연결 함수 가져오기
const app = express();
// 기본 라우트 (루트 경로 접근 시)
app.get('/', (req, res) => {
    res.send('Welcome to Mediport Back-end API!');
});

// 404 에러 핸들링 (정의되지 않은 경로)
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// 에러 핸들링 미들웨어
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            // 개발 환경에서만 스택 트레이스 포함
            stack: process.env.NODE_ENV === 'development' ? error.stack : {}
        }
    });
});

module.exports = app; 