import type { Seat, SeatStatus } from '../lib/mockData'

interface SeatMapProps {
  seats: Seat[]
  section: string
  selectedSeatId?: string
  onSeatClick?: (seat: Seat) => void
}

const SEAT_BG: Record<SeatStatus, string> = {
  available: '#22c55e',
  held: '#f59e0b',
  booked: '#e5e5e5',
}

export default function SeatMap({ seats, section, selectedSeatId, onSeatClick }: SeatMapProps) {
  const sectionSeats = seats.filter((s) => s.section === section)
  const rows = [...new Set(sectionSeats.map((s) => s.row))].sort((a, b) => a - b)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Stage indicator */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.65rem',
        letterSpacing: '0.25em',
        color: '#bbb',
        paddingBottom: '8px',
        borderBottom: '1px solid #e5e5e5',
      }}>
        STAGE
      </div>

      {/* Seat grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {rows.map((row) => {
          const rowSeats = sectionSeats
            .filter((s) => s.row === row)
            .sort((a, b) => a.number - b.number)
          return (
            <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '0.65rem', color: '#ccc', width: '14px', textAlign: 'right', flexShrink: 0 }}>
                {row}
              </span>
              <div style={{ display: 'flex', gap: '3px' }}>
                {rowSeats.map((seat) => {
                  const isSelected = seat.seatId === selectedSeatId
                  const canClick = seat.status === 'available'
                  return (
                    <button
                      key={seat.seatId}
                      onClick={() => canClick && onSeatClick?.(seat)}
                      title={`${section}구역 ${row}행 ${seat.number}번`}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '3px',
                        border: isSelected ? '2px solid #111' : '2px solid transparent',
                        background: SEAT_BG[seat.status],
                        cursor: canClick ? 'pointer' : 'not-allowed',
                        padding: 0,
                        flexShrink: 0,
                        transition: 'transform 0.1s, border-color 0.1s',
                        transform: isSelected ? 'scale(1.25)' : 'scale(1)',
                        outline: 'none',
                      }}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', paddingTop: '12px', borderTop: '1px solid #e5e5e5' }}>
        {[
          { color: '#22c55e', label: '선택 가능' },
          { color: '#f59e0b', label: '선점 중' },
          { color: '#e5e5e5', label: '예매 완료', border: '1px solid #ccc' },
        ].map(({ color, label, border }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#aaa' }}>
            <span style={{
              width: '11px', height: '11px', borderRadius: '2px',
              background: color, border, display: 'inline-block', flexShrink: 0,
            }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
