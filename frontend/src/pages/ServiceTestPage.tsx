import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SeatMap from '../components/SeatMap'
import { SECTIONS, generateMockSeats, type Seat } from '../lib/mockData'
import { FIVE_MIN_MS, calcServiceRound, calcNextBoundaryMs, diffToMmSs, pad, isServiceQueueOpen } from '../lib/roundUtils'

const ACCENT = '#ea580c'
const QUEUE_DURATION_S = 60   // 대기열 대기 1분
const SELECT_DURATION_S = 240 // 좌석 선택 4분

type Phase = 'standby' | 'queue' | 'selecting' | 'confirming' | 'result'

export default function ServiceTestPage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('standby')
  const [seats] = useState(() => generateMockSeats())
  const [activeSection, setActiveSection] = useState(SECTIONS[0])
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const [round] = useState(() => calcServiceRound())
  const [queueNumber] = useState(() => Math.floor(Math.random() * 1200) + 300)
  const [, tick] = useState(0)

  const phaseEndMs = useRef(0)         // timed phase 종료 시각
  const selectingStartMs = useRef(0)   // selecting 진입 시각
  const finishedMs = useRef(0)         // result 진입 시각 (소요 시간 계산용)

  useEffect(() => {
    const t = setInterval(() => {
      tick(n => n + 1)

      if (phase === 'queue' || phase === 'selecting') {
        if (phaseEndMs.current > 0 && Date.now() >= phaseEndMs.current) {
          if (phase === 'queue') {
            selectingStartMs.current = Date.now()
            phaseEndMs.current = Date.now() + SELECT_DURATION_S * 1000
            setPhase('selecting')
          } else {
            // 시간 초과
            finishedMs.current = Date.now()
            setPhase('result')
          }
        }
      }
    }, 500)
    return () => clearInterval(t)
  }, [phase])

  function enterQueue() {
    phaseEndMs.current = Date.now() + QUEUE_DURATION_S * 1000
    setPhase('queue')
  }

  function handleSeatClick(seat: Seat) {
    if (phase !== 'selecting') return
    setSelectedSeat(seat)
    setPhase('confirming')
  }

  function confirmBooking() {
    finishedMs.current = Date.now()
    setPhase('result')
  }

  function retryStandby() {
    setSelectedSeat(null)
    phaseEndMs.current = 0
    selectingStartMs.current = 0
    finishedMs.current = 0
    setPhase('standby')
  }

  // 현재 보여줄 카운트다운
  const nextSvc = diffToMmSs(calcNextBoundaryMs(FIVE_MIN_MS))
  const queueOpen = isServiceQueueOpen()
  const phaseRemaining = (phase === 'queue' || phase === 'selecting' || phase === 'confirming')
    ? diffToMmSs(phaseEndMs.current)
    : null

  // 대기열에서의 현재 가짜 대기번호
  const currentQueueNo = phaseRemaining
    ? Math.max(1, Math.round(queueNumber * ((phaseRemaining.minutes * 60 + phaseRemaining.seconds) / QUEUE_DURATION_S)))
    : 1

  // 결과: selecting 진입~완료 소요 시간
  const elapsedS = finishedMs.current && selectingStartMs.current
    ? ((finishedMs.current - selectingStartMs.current) / 1000).toFixed(1)
    : null

  const isUrgent = phaseRemaining !== null
    && phaseRemaining.minutes === 0 && phaseRemaining.seconds <= 30

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', flexDirection: 'column', color: '#111' }}>
      {/* Header */}
      <header style={{ padding: '14px 24px', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit', fontWeight: 500, padding: 0, transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#111')}
          onMouseLeave={e => (e.currentTarget.style.color = '#555')}
        >← 뒤로</button>
        <span style={{ color: '#ddd' }}>|</span>
        <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>실제 서비스 테스트</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: '#555', fontWeight: 600 }}>
          오늘 {round}회차
        </span>
      </header>

      {/* ── STANDBY ── */}
      {phase === 'standby' && (
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', gap: '48px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '1.1rem', fontWeight: 600, margin: '0 0 20px',
              color: queueOpen ? '#16a34a' : ACCENT,
              transition: 'color 0.3s',
            }}>
              {queueOpen ? '대기열 오픈 중' : '다음 회차 대기열까지'}
            </p>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(4rem, 15vw, 7rem)',
              fontWeight: 700, lineHeight: 1, letterSpacing: '-0.04em', color: '#111',
            }}>
              {pad(nextSvc.minutes)}:{pad(nextSvc.seconds)}
            </div>
            <p style={{ fontSize: '0.95rem', color: '#444', fontWeight: 500, marginTop: '16px' }}>
              대기열 진입 1분 → 좌석 선택 4분
            </p>
          </div>

          <button
            disabled={!queueOpen}
            onClick={queueOpen ? enterQueue : undefined}
            style={{
              padding: '16px 52px',
              background: queueOpen ? ACCENT : 'transparent',
              color: queueOpen ? '#fff' : '#aaa',
              border: queueOpen ? 'none' : '1px solid #ccc',
              borderRadius: '6px', fontSize: '1.1rem', fontWeight: 700,
              cursor: queueOpen ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', transition: 'background 0.2s',
            }}
            onMouseEnter={e => { if (queueOpen) e.currentTarget.style.background = '#c2410c' }}
            onMouseLeave={e => { if (queueOpen) e.currentTarget.style.background = ACCENT }}
          >
            {queueOpen ? '대기열 입장' : '대기 중'}
          </button>
        </main>
      )}

      {/* ── QUEUE ── */}
      {phase === 'queue' && phaseRemaining && (
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', gap: '40px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1rem', color: ACCENT, fontWeight: 600, margin: '0 0 36px' }}>대기열 대기 중</p>
            <p style={{ fontSize: '0.85rem', color: '#555', fontWeight: 500, margin: '0 0 10px' }}>내 대기 번호</p>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(3rem, 12vw, 5rem)',
              fontWeight: 700, color: '#111', lineHeight: 1,
            }}>
              {currentQueueNo.toLocaleString()}
            </div>
            <p style={{ fontSize: '0.95rem', color: '#444', fontWeight: 500, marginTop: '28px' }}>
              입장까지{' '}
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#111' }}>
                {pad(phaseRemaining.minutes)}:{pad(phaseRemaining.seconds)}
              </span>
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', maxWidth: '320px', height: '4px', background: '#e5e5e5', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: ACCENT, borderRadius: '2px', transition: 'width 0.5s',
              width: `${100 - ((phaseRemaining.minutes * 60 + phaseRemaining.seconds) / QUEUE_DURATION_S) * 100}%`,
            }} />
          </div>
        </main>
      )}

      {/* ── SELECTING / CONFIRMING ── */}
      {(phase === 'selecting' || phase === 'confirming') && phaseRemaining && (
        <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Seat map */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
              {SECTIONS.map(sec => {
                const isActive = sec === activeSection
                return (
                  <button key={sec} onClick={() => setActiveSection(sec)} style={{
                    padding: '7px 22px',
                    background: isActive ? '#111' : 'transparent',
                    color: isActive ? '#fafafa' : '#444',
                    border: isActive ? 'none' : '1px solid #ccc',
                    borderRadius: '4px', fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#111' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#444' }}
                  >{sec}구역</button>
                )
              })}
            </div>
            <SeatMap seats={seats} section={activeSection} selectedSeatId={selectedSeat?.seatId} onSeatClick={handleSeatClick} />
          </div>

          {/* Right panel */}
          <div style={{ width: '230px', borderLeft: '1px solid #e5e5e5', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: '#444', letterSpacing: '0.1em', margin: '0 0 6px', fontWeight: 600 }}>
                남은 시간
              </p>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '2.4rem', fontWeight: 700,
                color: isUrgent ? ACCENT : '#111', margin: 0, lineHeight: 1, transition: 'color 0.3s',
              }}>
                {pad(phaseRemaining.minutes)}:{pad(phaseRemaining.seconds)}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #e5e5e5' }} />

            {phase === 'selecting' && (
              <p style={{ fontSize: '0.95rem', color: '#333', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
                초록 좌석을 선택하세요.
              </p>
            )}

            {phase === 'confirming' && selectedSeat && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#555', margin: '0 0 6px', letterSpacing: '0.1em', fontWeight: 600 }}>선택한 좌석</p>
                  <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111', margin: '0 0 4px' }}>
                    {selectedSeat.section}구역 {selectedSeat.row}행 {selectedSeat.number}번
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#444', margin: 0, fontWeight: 500 }}>
                    {selectedSeat.price.toLocaleString()}원
                  </p>
                </div>
                <button
                  onClick={confirmBooking}
                  style={{ width: '100%', padding: '12px', background: ACCENT, color: '#fff', border: 'none', borderRadius: '5px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#c2410c')}
                  onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
                >예매 확정</button>
                <button
                  onClick={() => { setSelectedSeat(null); setPhase('selecting') }}
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
      {phase === 'result' && (
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', gap: '40px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '0.8rem', letterSpacing: '0.15em', fontWeight: 700, margin: '0 0 20px',
              color: selectedSeat ? '#16a34a' : '#888',
            }}>
              {selectedSeat ? 'BOOKED' : 'TIME OUT'}
            </p>

            {selectedSeat ? (
              <>
                <p style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 4px' }}>
                  {selectedSeat.section}구역 {selectedSeat.row}행 {selectedSeat.number}번
                </p>
                <p style={{ fontSize: '0.95rem', color: '#444', fontWeight: 500, margin: '0 0 32px' }}>
                  {selectedSeat.price.toLocaleString()}원
                </p>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(3rem, 12vw, 4.5rem)', fontWeight: 700, color: '#111', lineHeight: 1 }}>
                  {elapsedS}
                  <span style={{ fontSize: '1.2rem', color: '#555', marginLeft: '4px' }}>s</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#555', fontWeight: 500, marginTop: '10px' }}>
                  좌석 선택 시작부터 예매 완료까지
                </p>
              </>
            ) : (
              <p style={{ fontSize: '1rem', color: '#444', fontWeight: 500 }}>4분 내에 좌석을 선택하지 못했습니다.</p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
            <button
              onClick={retryStandby}
              style={{ width: '100%', padding: '15px', background: ACCENT, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#c2410c')}
              onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
            >다음 회차 도전</button>
            <button
              onClick={() => navigate('/')}
              style={{ width: '100%', padding: '15px', background: 'transparent', color: '#444', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#111'; e.currentTarget.style.borderColor = '#888' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#444'; e.currentTarget.style.borderColor = '#ccc' }}
            >홈으로</button>
          </div>
        </main>
      )}
    </div>
  )
}
