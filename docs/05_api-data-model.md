# 티켓팅 연습 페이지 — API & 데이터 모델

> Phase 1은 API 없음. Phase 2부터 Lambda + DynamoDB 적용.

## 데이터 모델 (DynamoDB)

### Table: `Seats`
| 속성 | 타입 | 설명 |
|------|------|------|
| `seatId` (PK) | String | `{concertId}#{section}{row}-{number}` (e.g., `1#A3-05`) |
| `concertId` | String | 공연 ID |
| `section` | String | A~E |
| `row` | Number | 1~10 |
| `number` | Number | 1~10 |
| `price` | Number | 99000 |
| `status` | String | `available` \| `held` \| `booked` |
| `heldBy` | String | userId (선점한 사람) |
| `heldAt` | String | ISO timestamp |
| `ttl` | Number | Unix timestamp (DynamoDB TTL, 선점 자동 해제) |

### Table: `Bookings`
| 속성 | 타입 | 설명 |
|------|------|------|
| `bookingId` (PK) | String | UUID |
| `seatId` | String | FK → Seats |
| `userId` | String | localStorage UUID |
| `ticketNumber` | String | `TK-YYYYMMDD-XXXX` |
| `concertTitle` | String | 공연명 |
| `seatInfo` | Map | `{ section, row, number }` |
| `bookedAt` | String | ISO timestamp |

### 동시성 처리
Redis SET NX 대신 DynamoDB **ConditionExpression** 사용:
```
ConditionExpression: "attribute_not_exists(seatId) OR #status = :available"
UpdateExpression: "SET #status = :held, heldBy = :userId, ttl = :ttl"
```
→ 여러 Lambda가 동시에 같은 좌석을 선점하려 해도 하나만 성공.

## API 목록 (Phase 2 — Lambda)

| Method | Path | 설명 |
|--------|------|------|
| GET | `/seats?concertId={id}` | 전체 좌석 현황 조회 |
| POST | `/seats/{seatId}/hold` | 좌석 임시 선점 (5분) |
| DELETE | `/seats/{seatId}/hold` | 선점 해제 |
| POST | `/bookings` | 예매 확정 |
| GET | `/bookings/{bookingId}` | 예매 내역 조회 |

## 주요 API 상세

### `POST /seats/{seatId}/hold`
DynamoDB 조건부 업데이트로 원자적 선점.

**Request**
```json
{ "userId": "uuid-xxxx" }
```
**Response 200 — 성공**
```json
{
  "seatId": "1#A3-05",
  "heldUntil": "2026-03-12T10:15:00Z",
  "expiresIn": 300
}
```
**Response 409 — 이미 선점/예약됨**
```json
{
  "error": "SEAT_NOT_AVAILABLE",
  "message": "이미 선택된 좌석입니다."
}
```

### `POST /bookings`
선점된 좌석을 예매 확정. DynamoDB 트랜잭션(TransactWrite)으로 Seat 상태 변경 + Booking 생성 원자적 처리.

**Request**
```json
{ "seatId": "1#A3-05", "userId": "uuid-xxxx" }
```
**Response 201**
```json
{
  "bookingId": "uuid-yyyy",
  "ticketNumber": "TK-20260312-0001",
  "seatInfo": { "section": "A", "row": 3, "number": 5 },
  "concertTitle": "2026 연습 콘서트"
}
```

## Phase 1 Mock Data (프론트 하드코딩)

API 없이 개발하는 동안 프론트에서 사용할 mock:
```ts
// 공연 정보
const CONCERT = { id: "1", title: "2026 연습 콘서트", venue: "연습 홀" }

// 좌석: sections A~E, rows 1~10, numbers 1~10
// 초기 상태는 랜덤으로 available/booked 섞어서 생성
```
