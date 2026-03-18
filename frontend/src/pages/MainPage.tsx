import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MAX_USERS } from '../lib/mockData'
import { CYCLE_MS, calcRound, calcNextBoundaryMs, diffToMmSs, pad, isQueueOpen, isQueueSoon } from '../lib/roundUtils'
import ConcertHero from '../components/ConcertHero'

const ACCENT = '#ea580c'

export default function MainPage() {
  const navigate = useNavigate()
  const [, tick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => tick(n => n + 1), 500)
    return () => clearInterval(t)
  }, [])

  const round = calcRound()
  const nextBoundary = diffToMmSs(calcNextBoundaryMs(CYCLE_MS))
  const queueOpen = isQueueOpen()
  const queueSoon = isQueueSoon()

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', color: '#111', fontFamily: 'Noto Sans KR, sans-serif' }}>
      <header style={{
        padding: '20px 32px',
        borderBottom: '1px solid #e5e5e5',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="10" width="16" height="3" rx="1" fill="#111" />
            <circle cx="5" cy="7" r="2" fill="#ea580c" />
            <circle cx="13" cy="7" r="2" fill="#ea580c" />
            <line x1="5" y1="9" x2="5" y2="10" stroke="#ea580c" strokeWidth="1.5" />
            <line x1="13" y1="9" x2="13" y2="10" stroke="#ea580c" strokeWidth="1.5" />
          </svg>
          <span style={{ fontSize: '1rem', letterSpacing: '0.12em', fontWeight: 700 }}>CONCERT</span>
        </span>
        <span style={{ fontSize: '0.875rem', color: '#555', fontWeight: 500 }}>티켓팅 연습</span>
      </header>

      <main style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ borderBottom: '1px solid #e5e5e5', marginBottom: '8px', paddingBottom: '8px' }}>
          <ConcertHero />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px' }}>연습 모드 선택</h1>
          <p style={{ fontSize: '0.95rem', color: '#444', margin: 0, fontWeight: 500 }}>
            오늘 <strong style={{ color: '#111' }}>{round}회차</strong> 진행 중
          </p>
        </div>

        {/* 메인 모드: 티켓팅 연습 */}
        <div
          onClick={() => navigate('/service-test')}
          style={{
            border: `2px solid ${queueOpen ? ACCENT : queueSoon ? '#ca8a04' : '#e5e5e5'}`,
            borderRadius: '8px', padding: '24px', cursor: 'pointer',
            background: queueOpen ? '#fff8f5' : queueSoon ? '#fefce8' : '#fff',
            transition: 'border-color 0.2s, background 0.2s',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <p style={{
                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
                color: queueOpen ? ACCENT : queueSoon ? '#ca8a04' : '#888', margin: '0 0 4px',
              }}>
                {queueOpen ? '● 오픈 중' : queueSoon ? '◎ 오픈 대기중' : '3분 단위'}
              </p>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>티켓팅 연습</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 2px', fontWeight: 500 }}>다음 회차</p>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', fontWeight: 700,
                color: queueOpen ? ACCENT : queueSoon ? '#ca8a04' : '#111',
              }}>
                {pad(nextBoundary.minutes)}:{pad(nextBoundary.seconds)}
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#444', margin: '0 0 14px', lineHeight: 1.65, fontWeight: 500 }}>
            3분마다 대기열 오픈. 100석 · 최대 {MAX_USERS.toLocaleString()}명 입장.<br />
            오늘 기준 <strong style={{ color: '#111' }}>{round}회차</strong>가 누적됩니다.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#555', fontWeight: 500 }}>
            <span>1분 대기열</span>
            <span style={{ color: '#ccc' }}>→</span>
            <span>1분 30초 좌석 선택</span>
            <span style={{ color: '#ccc' }}>→</span>
            <span>결과 확인</span>
          </div>
        </div>

        {/* 혼자 연습하기 */}
        <div style={{ marginTop: '8px' }}>
          <p style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 10px' }}>
            혼자 연습하기
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* 대기열 반응속도 */}
            <div
              onClick={() => navigate('/solo-queue')}
              style={{
                flex: 1, border: '1px solid #e5e5e5', borderRadius: '8px',
                padding: '18px 20px', cursor: 'pointer', background: '#fff',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#bbb')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e5e5')}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px' }}>대기열 연습</h3>
              <p style={{ fontSize: '0.85rem', color: '#444', margin: '0 0 10px', lineHeight: 1.6, fontWeight: 500 }}>
                10초마다 대기열 버튼이 활성화됩니다.<br />얼마나 빠르게 누르는지 측정합니다.
              </p>
              <span style={{ fontSize: '0.8rem', color: ACCENT, fontWeight: 600 }}>반응속도 측정 →</span>
            </div>

            {/* 좌석 선택 속도 */}
            <div
              onClick={() => navigate('/solo-seat')}
              style={{
                flex: 1, border: '1px solid #e5e5e5', borderRadius: '8px',
                padding: '18px 20px', cursor: 'pointer', background: '#fff',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#bbb')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e5e5')}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px' }}>좌석 연습</h3>
              <p style={{ fontSize: '0.85rem', color: '#444', margin: '0 0 10px', lineHeight: 1.6, fontWeight: 500 }}>
                좌석 클릭부터 예매 확정까지<br />소요 시간을 측정합니다.
              </p>
              <span style={{ fontSize: '0.8rem', color: ACCENT, fontWeight: 600 }}>속도 측정 →</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
