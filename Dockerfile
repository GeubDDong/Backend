# 최신 LTS 버전의 Node.js 사용 (Alpine 기반으로 가볍게)
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /Backend

# package.json과 lock 파일을 복사 (캐시 최적화)
COPY package.json package-lock.json ./

# 의존성 설치 (더 안정적인 방식)
RUN npm ci

# 소스 코드 복사
COPY . .

# 환경 변수 파일 복사 (필요하면 활성화)
# COPY .env .env

# TypeScript 빌드
RUN npm run build

# TypeORM 마이그레이션 실행 (필요하면 활성화)
# RUN npm run migration:run

# 실행 포트 설정
EXPOSE 8080

# 컨테이너 실행 명령어
CMD ["node", "dist/main"]
