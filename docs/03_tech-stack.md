# 티켓팅 연습 페이지 — 기술 스택

## 확정된 스택

| 구분         | 기술                          | 비고                              |
| ------------ | ----------------------------- | --------------------------------- |
| 프론트엔드   | React + Vite (TypeScript)     | S3 정적 배포                      |
| 백엔드       | AWS Lambda + API Gateway      | 서버리스, Node.js 런타임          |
| 데이터베이스 | AWS DynamoDB                  | 서버리스, 조건부 쓰기로 동시성 처리 |
| 인프라/배포  | AWS S3 + CloudFront (프론트)  | Lambda는 API Gateway로 노출       |
| 인증         | 없음 (localStorage userId)    |                                   |
| 캐시/대기열  | Redis (ElastiCache) — 후순위  | 기본 구현 이후 추가               |

## 개발 단계별 스택

| 단계 | 스택 | 비고 |
|------|------|------|
| Phase 1 (지금) | React + Vite만 | API 없이 프론트 완성, S3 배포 가능 |
| Phase 2 | + Lambda + DynamoDB | 좌석 선점 / 예매 API 추가 |
| Phase 3 | + Redis (ElastiCache) | 대기열, 실시간 선점 고도화 |

## 로컬 실행 방법

```bash
# 프론트엔드
cd frontend
npm install
npm run dev   # localhost:5173

# 백엔드 (Phase 2 이후)
cd backend
npm install
npx sst dev   # SST 또는 SAM local 사용
```

## 환경 변수

```env
# frontend/.env
VITE_API_URL=https://<api-id>.execute-api.ap-northeast-2.amazonaws.com/prod
```

## 미결정 항목

| 구분 | 후보 | 결정 기준 |
|------|------|---------|
| Lambda IaC | AWS SAM / SST / CDK | 팀 친숙도 |
| 프론트 상태관리 | Zustand / useState | 복잡도에 따라 결정 |
| 실시간 (Phase 3) | API Gateway WebSocket / polling | Redis 도입 시점에 결정 |
