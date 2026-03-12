import type { Seat, SeatStatus } from '../lib/mockData'

interface SeatMapProps {
  seats: Seat[]
  selectedSeatId?: string
  onSeatClick?: (seat: Seat) => void
}

const STATUS_CLASS: Record<SeatStatus, string> = {
  available: 'bg-emerald-500 hover:bg-emerald-400 cursor-pointer text-white',
  held: 'bg-amber-400 cursor-not-allowed text-white',
  booked: 'bg-gray-600 cursor-not-allowed text-gray-400',
}

const SECTIONS = ['A', 'B', 'C', 'D', 'E']

export default function SeatMap({ seats, selectedSeatId, onSeatClick }: SeatMapProps) {
  return (
    <div className="space-y-6">
      <div className="w-full bg-gray-700 rounded-lg py-2 text-center text-sm text-gray-300 tracking-widest">
        STAGE
      </div>

      {SECTIONS.map((section) => {
        const sectionSeats = seats.filter((s) => s.section === section)
        const rows = [...new Set(sectionSeats.map((s) => s.row))].sort((a, b) => a - b)

        return (
          <div key={section} className="space-y-1">
            <div className="text-xs text-gray-500 font-semibold mb-1">구역 {section}</div>
            {rows.map((row) => {
              const rowSeats = sectionSeats
                .filter((s) => s.row === row)
                .sort((a, b) => a.number - b.number)
              return (
                <div key={row} className="flex gap-1 items-center">
                  <span className="text-xs text-gray-600 w-4 text-right">{row}</span>
                  <div className="flex gap-1 flex-wrap">
                    {rowSeats.map((seat) => {
                      const isSelected = seat.seatId === selectedSeatId
                      return (
                        <button
                          key={seat.seatId}
                          onClick={() => seat.status === 'available' && onSeatClick?.(seat)}
                          className={`
                            w-6 h-6 rounded text-xs font-bold transition-all
                            ${STATUS_CLASS[seat.status]}
                            ${isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900 scale-110' : ''}
                          `}
                          title={`${section}구역 ${row}행 ${seat.number}번 — ${
                            seat.status === 'available'
                              ? '선택 가능'
                              : seat.status === 'held'
                              ? '선점 중'
                              : '예매 완료'
                          }`}
                        >
                          {seat.number}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}

      <div className="flex gap-4 text-xs text-gray-400 pt-2 border-t border-gray-700">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> 선택 가능
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-400 inline-block" /> 선점 중
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-600 inline-block" /> 예매 완료
        </span>
      </div>
    </div>
  )
}
