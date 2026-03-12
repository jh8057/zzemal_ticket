export type SeatStatus = 'available' | 'held' | 'booked'

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

const SECTIONS = ['A', 'B', 'C', 'D', 'E']
const ROWS = 10
const NUMBERS = 10

export function generateMockSeats(): Seat[] {
  const seats: Seat[] = []
  for (const section of SECTIONS) {
    for (let row = 1; row <= ROWS; row++) {
      for (let num = 1; num <= NUMBERS; num++) {
        const rand = Math.random()
        const status: SeatStatus =
          rand < 0.6 ? 'available' : rand < 0.85 ? 'booked' : 'held'
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
