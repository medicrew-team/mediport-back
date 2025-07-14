const admin = require('firebase-admin');
const serviceAccount = require('../../mediport.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})



// --- 테스트 사용자 생성 함수 (필요할 때만 주석 해제하여 실행) ---
async function createTestUser() {
    try {
        const email = 'testuser_swagger@example.com'; // 테스트용 이메일
        const password = 'password123'; // 테스트용 비밀번호 (강력한 비밀번호 사용 권장)

        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: 'Swagger Test User'
        });
        console.log('Successfully created new Firebase user:', userRecord.uid, 'with email:', email);
        console.log('Use this email and password to get an ID Token.');
    } catch (error) {
        if (error.code === 'auth/email-already-exists') {
            console.warn('Firebase user already exists with this email. Skipping creation.');
        } else {
            console.error('Error creating Firebase user:', error);
        }
    }
}

createTestUser(); 
// // 주석을 해제하고 이 파일을 Node.js로 실행하세요. (예: node mediport-back/src/config/firebaseAdmin.js)
// --- 테스트 사용자 생성 함수 끝 ---

module.exports= admin;