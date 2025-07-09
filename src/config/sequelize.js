const { Sequelize } = require('sequelize');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT ; // DB_PORT 기본값 추가 (MySQL 기본 포트)
const DB_DIALECT = process.env.DB_DIALECT ; // 기본값 유지

// 필수 환경 변수 검증
if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
    console.error('ERROR: 필수 환경 변수가 설정되지 않았습니다.');
    console.error('DB_NAME, DB_USER, DB_PASSWORD, DB_HOST 변수를 .env 파일에 설정하세요.');
    process.exit(1); // 필수 변수 없으면 애플리케이션 시작을 중단
}



const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    logging: false, // 로그 비활성화
    pool: {          // 연결 풀 설정
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('데이터베이스 연결 성공'); // 오타 수정
    } catch (error) {
        console.error('데이터베이스 연결 실패:', error);
        process.exit(1); // 연결 실패 시 애플리케이션 종료
    }
}

module.exports = { sequelize, connectDB };