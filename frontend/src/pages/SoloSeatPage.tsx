import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SeatMap from '../components/SeatMap'
import { SECTIONS, generateMockSeats, type Seat } from '../lib/mockData'

const ACCENT = '#ea580c'

type Phase = 'ready' | 'selecting' | 'confirming' | 'result'

interface Record {
  seatMs: number      // 시작 → 좌석 클릭
  confirmMs: number   // 좌석 클릭 → 예매 확정
  totalMs: number
  seat: string
}

export default function SoloSeatPage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('ready')
  const [seats, setSeats] = useState(() => generateMockSeats())
  const [activeSection, setActiveSection] = useState(SECTIONS[0])
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const [history, setHistory] = useState<Record[]>([])
  const [, tick] = useState(0)

  const startMs = useRef(0)
  const seatClickMs = useRef(0)
  const finishedMs = useRef(0)

  // elapsed 실시간 표시용
  const elapsed = phase === 'selecting' || phase === 'confirming'
    ? Date.now() - startMs.current
    : 0

  // 100ms마다 갱신 (selecting/confirming 중)
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startPractice() {
    setSeats(generateMockSeats())
    setSelectedSeat(null)
    startMs.current = Date.now()
    setPhase('selecting')

    if (elapsedRef.current) clearInterval(elapsedRef.current)
    elapsedRef.current = setInterval(() => tick(n => n + 1), 100)
  }

  function handleSeatClick(seat: Seat) {
    if (phase !== 'selecting') return
    seatClickMs.current = Date.now()
    setSelectedSeat(seat)
    setPhase('confirming')
  }

  function confirmBooking() {
    finishedMs.current = Date.now()
    if (elapsedRef.current) clearInterval(elapsedRef.current)

    const record: Record = {
      seatMs: seatClickMs.current - startMs.current,
      confirmMs: finishedMs.current - seatClickMs.current,
      totalMs: finishedMs.current - startMs.current,
      seat: selectedSeat ? `${selectedSeat.section}구역 ${selectedSeat.row}행 ${selectedSeat.number}번` : '',
    }
    setHistory(prev => [record, ...prev].slice(0, 10))
    setPhase('result')
  }

  function cancelSelection() {
    setSelectedSeat(null)
    setPhase('selecting')
    seatClickMs.current = 0
  }

  function reset() {
    setPhase('ready')
    setSelectedSeat(null)
    startMs.current = 0
    seatClickMs.current = 0
    finishedMs.current = 0
    if (elapsedRef.current) clearInterval(elapsedRef.current)
  }

  const lastRecord = history[0]
  const bestTotal = history.length > 0 ? Math.min(...history.map(r => r.totalMs)) : null

  function fmtMs(ms: number) {
    return ms < 10000 ? `${(ms / 1000).toFixed(2)}s` : `${(ms / 1000).toFixed(1)}s`
  }

  function scoreLabel(ms: number) {
    if (ms < 3000) return '매우 빠름'
    if (ms < 8000) return '빠름'
    if (ms < 15000) return '평균'
    return '연습 필요'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', flexDirection: 'column', color: '#111' }}>
      <header style={{ padding: '14px 24px', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit', fontWeight: 500, padding: 0, transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#111')}
          onMouseLeave={e => (e.currentTarget.style.color = '#555')}
        >← 뒤로</button>
        <span style={{ color: '#ddd' }}>|</span>
        <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>좌석 선택 속도 연습</span>
        {history.length > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#555', fontWeight: 500 }}>
            {history.length}회 완료
          </span>
        )}
      </header>

      {/* ── READY ── */}
      {phase === 'ready' && (
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', gap: '32px' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 12px' }}>좌석 선택 속도 연습</h2>
            <p style={{ fontSize: '0.95rem', color: '#444', fontWeight: 500, lineHeight: 1.7, margin: 0 }}>
              시작 버튼을 누르면 타이머가 시작됩니다.<br />
              좌석을 선택하고 예매 확정까지 최대한 빠르게!
            </p>
          </div>
          {history.length > 0 && bestTotal !== null && (
            <div style={{ display: 'flex', gap: '32px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 4px', color: '#888', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600 }}>BEST</p>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.3rem', fontWeight: 700, color: ACCENT, margin: 0 }}>{fmtMs(bestTotal)}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 4px', color: '#888', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600 }}>LAST</p>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.3rem', fontWeight: 700, color: '#111', margin: 0 }}>{fmtMs(history[0].totalMs)}</p>
              </div>
            </div>
          )}
          <button
            onClick={startPractice}
            style={{ padding: '16px 56px', background: ACCENT, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#c2410c')}
            onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
          >시작</button>
        </main>
      )}

      {/* ── SELECTING / CONFIRMING ── */}
      {(phase === 'selecting' || phase === 'confirming') && (
        <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
              {SECTIONS.map(sec => {
                const isActive = sec === activeSection
                return (
                  <button key={sec} onClick={() => setActiveSection(sec)} style={{
                    padding: '7px 22px', background: isActive ? '#111' : 'transparent',
                    color: isActive ? '#fafafa' : '#444', border: isActive ? 'none' : '1px solid #ccc',
                    borderRadius: '4px', fontSize: '0.9rem', fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#111' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#444' }}
                  >{sec}구역</button>
                )
              })}
            </div>
            <SeatMap seats={seats} section={activeSection} selectedSeatId={selectedSeat?.seatId} onSeatClick={handleSeatClick} />
          </div>

          <div style={{ width: '230px', borderLeft: '1px solid #e5e5e5', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
            {/* Elapsed timer */}
            <div>
              <p style={{ fontSize: '0.8rem', color: '#444', letterSpacing: '0.1em', margin: '0 0 6px', fontWeight: 600 }}>경과 시간</p>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2.4rem', fontWeight: 700, color: '#111', margin: 0, lineHeight: 1 }}>
                {(elapsed / 1000).toFixed(1)}
                <span style={{ fontSize: '1rem', color: '#555', marginLeft: '3px' }}>s</span>
              </p>
            </div>

            <div style={{ borderTop: '1px solid #e5e5e5' }} />

            {phase === 'selecting' && (
              <p style={{ fontSize: '0.95rem', color: '#333', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>초록 좌석을 선택하세요.</p>
            )}

            {phase === 'confirming' && selectedSeat && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#555', margin: '0 0 6px', letterSpacing: '0.1em', fontWeight: 600 }}>선택한 좌석</p>
                  <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111', margin: '0 0 4px' }}>
                    {selectedSeat.section}구역 {selectedSeat.row}행 {selectedSeat.number}번
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#444', margin: 0, fontWeight: 500 }}>{selectedSeat.price.toLocaleString()}원</p>
                </div>
                <button onClick={confirmBooking} style={{ width: '100%', padding: '12px', background: ACCENT, color: '#fff', border: 'none', borderRadius: '5px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#c2410c')}
                  onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
                >예매 확정</button>
                <button onClick={cancelSelection}
                  style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: '4px 0', fontSize: '0.875rem', fontFamily: 'inherit', textAlign: 'left', fontWeight: 500, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#111')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                >다시 선택</button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* ── RESULT ── */}
      {phase === 'result' && lastRecord && (
        <main style={{ flex: 1, display: 'flex', gap: 0, overflow: 'hidden' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', gap: '36px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: '#16a34a', letterSpacing: '0.15em', fontWeight: 700, margin: '0 0 16px' }}>BOOKED</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 32px' }}>{lastRecord.seat}</p>

              {/* Total time big */}
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(3rem, 12vw, 4.5rem)', fontWeight: 700, color: '#111', lineHeight: 1 }}>
                {fmtMs(lastRecord.totalMs)}
              </div>
              <p style={{ fontSize: '0.95rem', color: '#444', fontWeight: 600, marginTop: '10px' }}>{scoreLabel(lastRecord.totalMs)}</p>

              {/* Breakdown */}
              <div style={{ display: 'flex', gap: '32px', marginTop: '28px', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px', color: '#888', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600 }}>좌석 클릭</p>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: '#111', margin: 0 }}>{fmtMs(lastRecord.seatMs)}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px', color: '#888', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600 }}>예매 확정</p>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: '#111', margin: 0 }}>{fmtMs(lastRecord.confirmMs)}</p>
                </div>
                {bestTotal !== null && (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 4px', color: '#888', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600 }}>BEST</p>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: ACCENT, margin: 0 }}>{fmtMs(bestTotal)}</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
              <button onClick={reset} style={{ width: '100%', padding: '15px', background: ACCENT, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#c2410c')}
                onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
              >다시 연습</button>
              <button onClick={() => navigate('/')} style={{ width: '100%', padding: '15px', background: 'transparent', color: '#444', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.15s, border-color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#111'; e.currentTarget.style.borderColor = '#888' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#444'; e.currentTarget.style.borderColor = '#ccc' }}
              >홈으로</button>
            </div>
          </div>

          {/* History sidebar */}
          {history.length > 1 && (
            <div style={{ width: '180px', borderLeft: '1px solid #e5e5e5', padding: '24px 20px', flexShrink: 0, overflowY: 'auto' }}>
              <p style={{ fontSize: '0.75rem', color: '#444', letterSpacing: '0.1em', fontWeight: 600, margin: '0 0 16px' }}>기록</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {history.map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500 }}>#{history.length - i}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.95rem', fontWeight: 700, color: r.totalMs === bestTotal ? ACCENT : '#111' }}>
                      {fmtMs(r.totalMs)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  )
}
