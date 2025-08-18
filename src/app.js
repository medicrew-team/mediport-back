// src/app.js
const express = require('express');
const cors = require('cors'); // CORS 설정 (필요시)
const morgan = require('morgan'); // HTTP 요청 로거 (개발용)


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/UserRoutes');
const boardRoutes = require('./routes/BoardRoutes'); // 게시판 라우트 추가
const translateRoutes = require('./routes/translateRoutes');
const ocrRoutes = require('./routes/ocrRoutes');
const { swaggerUi, specs } = require('./config/swaggerConfig'); // Swagger 설정 가져오기

const app = express();


// 미들웨어 설정
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 라우터 설정
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/ocr', ocrRoutes);


// 기본 라우트 (루트 경로 접근 시)
const path = require('path');

// 정적 파일 제공 (프론트엔드)
app.use(express.static(path.join(__dirname, '../../frontend')));



module.exports = app; 