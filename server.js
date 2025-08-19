// server.js (프로젝트 루트에 위치)
const app = require('./src/app'); // app.js에서 Express 애플리케이션 인스턴스 가져오기
const { sequelize, connectDB } = require('./src/config/sequelize'); // sequelize 인스턴스 및 연결 함수 가져오기
const setupModels = require('./src/models');



// 포트 설정 (환경 변수 사용 또는 기본값)
const PORT = process.env.PORT || 3000; // .env의 PORT 변수를 사용하거나 기본값 3000
const HOST = '0.0.0.0';
// 서버 시작 함수
async function startServer() {
    try {
        // 1. 데이터베이스 연결 시도
        await connectDB();
        console.log('데이터베이스 연결 및 인증 성공. 서버를 시작합니다.');

        // 2. 모델 관계 설정 (모든 모델이 로드된 후에 호출되어야 함)
        // src/models/index.js와 같은 파일에서 모든 모델을 require 하고 관계를 설정하는 로직을 통합하는 것이 좋습니다.
        setupModels(); // 모든 모델을 로드하고 관계를 설정하는 함수 호출 (아래 설명)

        console.log('모델 관계 설정 완료.');

        // 3. Express 서버 시작
        app.listen(PORT,HOST, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Access URL: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('서버 시작 중 오류 발생:', error);
        // DB 연결 실패 시 process.exit(1)은 connectDB 함수 내에 이미 있으므로 여기서는 추가 종료 로직이 필요 없을 수도 있습니다.
        process.exit(1);
    }
}

// 서버 시작 함수 호출
startServer();