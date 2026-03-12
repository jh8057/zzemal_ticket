# 티켓팅 연습 페이지 — 구현 계획

## 구현 원칙
- **API 없이 개발 가능한 것 먼저** — 프론트를 완성하고 배포한 뒤 API 붙이기
- **단계별 배포**: 각 Phase 완료 시 S3에 바로 배포 가능한 상태 유지
- 복잡도는 최소화, 동작하는 것 먼저

## 단계별 계획

### Phase 1: 프론트엔드 단독 (API 없음) ← **지금 여기**
- [ ] 프로젝트 초기화 (`frontend/` — React + Vite + TypeScript + Tailwind)
- [ ] `MainPage` — 카운트다운(1분 단위) + "혼자 연습하기" + "대기열 참여" 버튼
- [ ] `PracticePage` — 랜덤 좌석 배치, 클릭 타이머, 속도 결과 표시
- [ ] `SeatMap` 컴포넌트 — 좌석 상태 시각화 (available/held/booked)
- [ ] S3 배포 설정

### Phase 2: Lambda + DynamoDB (좌석 선점 / 예매)
- [ ] DynamoDB 테이블 생성 (Seats, Bookings)
- [ ] Lambda: `POST /seats/{id}/hold` — DynamoDB 조건부 쓰기
- [ ] Lambda: `DELETE /seats/{id}/hold` — 선점 해제
- [ ] Lambda: `POST /bookings` — 예매 확정 (TransactWrite)
- [ ] Lambda: `GET /seats?concertId=` — 좌석 현황
- [ ] `CompetitionPage` 프론트 연결 (가상 300명 시뮬레이션)
- [ ] `BookingCompletePage`

### Phase 3: 대기열 + 실시간 (Redis / WebSocket) — 후순위
- [ ] Redis ElastiCache 설정
- [ ] 대기열 API (`/queue/join`, `/queue/status`)
- [ ] API Gateway WebSocket 또는 polling으로 실시간 좌석 상태 업데이트
- [ ] `QueuePage` 완성

## Phase 1 구현 순서

1. `frontend/` 프로젝트 세팅 (Vite + Tailwind)
2. `src/lib/userId.ts` — localStorage UUID
3. `src/components/SeatMap.tsx` — 재사용 좌석 배치도
4. `src/components/Countdown.tsx` — 1분 단위 카운트다운
5. `src/pages/MainPage.tsx` — 메인 페이지
6. `src/pages/PracticePage.tsx` — 혼자 연습 페이지
7. `src/App.tsx` + 라우팅 연결
8. S3 배포 (`npm run build` → s3 sync)

## Phase 2 구현 순서

1. `backend/` Lambda 함수 세팅 (SAM 또는 SST)
2. DynamoDB 테이블 + 시드 데이터 (공연 1개, 좌석 500개)
3. `seats/hold` Lambda
4. `bookings/create` Lambda
5. `frontend/src/lib/api.ts` — API 연결
6. `CompetitionPage` + 가상 유저 시뮬레이션 연결
