export type SeatStatus = 'available' | 'booked'

export interface Seat {
  seatId: string
  section: string
  row: number
  number: number
  price: number
  status: SeatStatus
}

export const CONCERT = {
  id: '1',
  title: '2026 연습 콘서트',
  venue: '연습 홀',
  date: '2026-04-01',
  time: '19:00',
}

export const SECTIONS = ['A', 'B']
export const MAX_USERS = 300   // 회차당 최대 입장 인원
const ROWS = 5
const NUMBERS = 10

export function generateMockSeats(): Seat[] {
  const seats: Seat[] = []
  for (const section of SECTIONS) {
    for (let row = 1; row <= ROWS; row++) {
      for (let num = 1; num <= NUMBERS; num++) {
        const rand = Math.random()
        const status: SeatStatus = rand < 0.6 ? 'available' : 'booked'
        seats.push({
          seatId: `${CONCERT.id}#${section}${row}-${String(num).padStart(2, '0')}`,
          section,
          row,
          number: num,
          price: 99000,
          status,
        })
      }
    }
  }
  return seats
}
