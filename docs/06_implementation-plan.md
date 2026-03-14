# 티켓팅 연습 페이지 — 구현 계획

## 구현 원칙
- **API 없이 개발 가능한 것 먼저** — 프론트를 완성하고 배포한 뒤 API 붙이기
- **단계별 배포**: 각 Phase 완료 시 S3에 바로 배포 가능한 상태 유지
- 복잡도는 최소화, 동작하는 것 먼저

---

## Phase 1: 프론트엔드 단독 ← **완료**

### 파일 구조
```
frontend/src/
  lib/
    mockData.ts       — 좌석 목업 데이터 생성
    roundUtils.ts     — 회차/주기 계산 유틸 (calcServiceRound, calcNextBoundaryMs 등)
  pages/
    MainPage.tsx      — 모드 선택 허브 (실서비스/빠른연습)
    ServiceTestPage.tsx — 5분 단위 실서비스 테스트 (standby→queue→selecting→result)
    QueueTestPage.tsx — 1분 단위 빠른 연습 (standby→selecting→result)
  components/
    SeatMap.tsx       — 좌석 배치도 컴포넌트
  App.tsx             — 라우팅 (/, /service-test, /queue-test)
```

### 구현된 기능
- [x] 두 모드 선택 화면 (오픈 여부에 따라 카드 하이라이트)
- [x] 오늘 회차 번호 계산 (자정 기준 5분 단위)
- [x] 실서비스 테스트: 5단계 phase 상태 머신
  - standby: 다음 5분 경계 카운트다운, 오픈 1분 window에 입장 버튼 활성화
  - queue: 가짜 대기번호 카운트다운 1분 (progress bar)
  - selecting: 4분 좌석 선택 + 타임아웃 처리
  - confirming: 선택 좌석 확인 및 예매 확정
  - result: 소요 시간(s) 표시 + 다음 회차 도전
- [x] 빠른 연습: 4단계 phase 상태 머신
  - standby: 다음 1분 경계 카운트다운, 자동 전이
  - selecting: 45초 좌석 선택 + 타임아웃
  - confirming: 확정
  - result: 소요 시간 + 점수 메시지

---

## Phase 2: Lambda + DynamoDB (좌석 선점 / 예매)
- [ ] DynamoDB 테이블 생성 (Seats, Bookings, Rounds)
- [ ] Lambda: `POST /queue/join` — 회차 입장 처리
- [ ] Lambda: `POST /seats/{id}/hold` — DynamoDB 조건부 쓰기 (선점)
- [ ] Lambda: `DELETE /seats/{id}/hold` — 선점 해제
- [ ] Lambda: `POST /bookings` — 예매 확정 (TransactWrite)
- [ ] Lambda: `GET /seats?roundId=` — 실시간 좌석 현황
- [ ] `frontend/src/lib/api.ts` — API 연결 레이어
- [ ] ServiceTestPage 백엔드 연동 (목업 → 실제 API)

---

## Phase 3: 대기열 + 실시간 — 후순위
- [ ] Redis ElastiCache — 동시 접속자 카운터, 대기열 순번
- [ ] 대기열 API (`/queue/join`, `/queue/status`)
- [ ] API Gateway WebSocket 또는 polling으로 실시간 좌석 상태 업데이트
- [ ] 실제 대기번호 발급 및 표시
- [ ] 동시성 테스트: 가상 다수 유저 시뮬레이션
