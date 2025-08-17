const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});
// 3. redis 연결 상태 설정
// 연결 성공
redisClient.on('connect', () => {
    console.log('Redis client 연결 성공');
});
// 연결 실패
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});


// 4. redis 연결
redisClient.connect().catch(console.error);

// 5. 다른 파일 에서 redisClient를 사용할 수 있도록 export
module.exports = redisClient;
