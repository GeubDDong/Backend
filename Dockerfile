# 최신 LTS 버전의 Node.js 사용 (Alpine 기반으로 가볍게)
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /Backend

# package.json과 lock 파일 복사 (캐시 최적화)
COPY package.json package-lock.json ./

# 의존성 설치 (devDependencies 포함!)
RUN npm install

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# 실행 포트 설정
EXPOSE 8080

# 컨테이너 실행 명령어
CMD ["node", "dist/main"]