// src/app.js
const express = require('express');
const cors = require('cors'); // CORS 설정 (필요시)
const morgan = require('morgan'); // HTTP 요청 로거 (개발용)


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/UserRoutes');
const boardRoutes = require('./routes/BoardRoutes'); // 게시판 라우트 추가
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

// 기본 라우트 (루트 경로 접근 시)
app.get('/', (req, res) => {
    res.send('Welcome to Mediport Back-end API!');
});

module.exports = app; 