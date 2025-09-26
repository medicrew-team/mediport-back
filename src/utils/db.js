const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config(); // 환경 변수 로드

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE, // 데이터베이스 이름을 의미한다고 가정
  port: parseInt(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
});

// 연결 테스트 (선택 사항)
pool.getConnection()
  .then(connection => {
    console.log('MySQL connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('MySQL connection error:', err.message);
  });

module.exports = pool; // CommonJS 방식으로 내보내기