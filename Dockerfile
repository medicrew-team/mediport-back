# Node.js 버전 명시
FROM node:18

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 앱 종속성 설치
# 와일드카드를 사용해 package.json과 package-lock.json을 모두 복사
COPY package*.json ./

RUN npm install

# 앱 소스코드 복사
COPY . .

# 앱이 실행될 포트 설정
EXPOSE 3000

# 앱 실행
CMD [ "node", "server.js" ]
