# 최신 LTS 버전의 Node.js 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /Backend

# package.json과 lock 파일을 복사
COPY package*.json ./

# 의존성 설치
RUN npm install --omit=dev

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# 실행 포트 설정
EXPOSE 3000

# 컨테이너 실행 명령어
CMD ["node", "dist/main"]