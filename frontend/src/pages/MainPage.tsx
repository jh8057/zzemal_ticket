import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FIVE_MIN_MS, ONE_MIN_MS,
  calcServiceRound, calcNextBoundaryMs, diffToMmSs, pad, isServiceQueueOpen,
} from '../lib/roundUtils'

const ACCENT = '#ea580c'

export default function MainPage() {
  const navigate = useNavigate()
  const [, tick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => tick(n => n + 1), 500)
    return () => clearInterval(t)
  }, [])

  const round = calcServiceRound()
  const svc = diffToMmSs(calcNextBoundaryMs(FIVE_MIN_MS))
  const queue = diffToMmSs(calcNextBoundaryMs(ONE_MIN_MS))
  const svcOpen = isServiceQueueOpen()
  const queueOpen = Date.now() % ONE_MIN_MS < 15 * 1000

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', color: '#111', fontFamily: 'Noto Sans KR, sans-serif' }}>
      <header style={{
        padding: '20px 32px',
        borderBottom: '1px solid #e5e5e5',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '1rem', letterSpacing: '0.12em', fontWeight: 700 }}>ZZEMAL TICKET</span>
        <span style={{ fontSize: '0.875rem', color: '#555', fontWeight: 500 }}>티켓팅 연습</span>
      </header>

      <main style={{ maxWidth: '560px', margin: '0 auto', padding: '52px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ marginBottom: '8px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px' }}>연습 모드 선택</h1>
          <p style={{ fontSize: '0.95rem', color: '#444', margin: 0, fontWeight: 500 }}>
            오늘 <strong style={{ color: '#111' }}>{round}회차</strong> 진행 중
          </p>
        </div>

        {/* 모드 1: 실제 서비스 테스트 */}
        <div
          onClick={() => navigate('/service-test')}
          style={{
            border: `2px solid ${svcOpen ? ACCENT : '#e5e5e5'}`,
            borderRadius: '8px', padding: '24px', cursor: 'pointer',
            background: svcOpen ? '#fff8f5' : '#fff',
            transition: 'border-color 0.2s, background 0.2s',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <p style={{
                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
                color: svcOpen ? ACCENT : '#888', margin: '0 0 4px',
              }}>
                {svcOpen ? '● 오픈 중' : '5분 단위'}
              </p>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>실제 서비스 테스트</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 2px', fontWeight: 500 }}>다음 회차</p>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', fontWeight: 700,
                color: svcOpen ? ACCENT : '#111',
              }}>
                {pad(svc.minutes)}:{pad(svc.seconds)}
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#444', margin: '0 0 14px', lineHeight: 1.65, fontWeight: 500 }}>
            5분마다 대기열 오픈. 실제 티켓팅과 동일한 흐름으로 연습합니다.<br />
            오늘 기준 <strong style={{ color: '#111' }}>{round}회차</strong>가 누적됩니다.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#555', fontWeight: 500 }}>
            <span>1분 대기열</span>
            <span style={{ color: '#ccc' }}>→</span>
            <span>4분 좌석 선택</span>
            <span style={{ color: '#ccc' }}>→</span>
            <span>결과 확인</span>
          </div>
        </div>

        {/* 모드 2: 대기열 빠른 연습 */}
        <div
          onClick={() => navigate('/queue-test')}
          style={{
            border: `2px solid ${queueOpen ? ACCENT : '#e5e5e5'}`,
            borderRadius: '8px', padding: '24px', cursor: 'pointer',
            background: queueOpen ? '#fff8f5' : '#fff',
            transition: 'border-color 0.2s, background 0.2s',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <p style={{
                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
                color: queueOpen ? ACCENT : '#888', margin: '0 0 4px',
              }}>
                {queueOpen ? '● 오픈 중' : '1분 단위'}
              </p>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>대기열 빠른 연습</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 2px', fontWeight: 500 }}>다음 시작</p>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', fontWeight: 700,
                color: queueOpen ? ACCENT : '#111',
              }}>
                00:{pad(queue.seconds)}
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#444', margin: '0 0 14px', lineHeight: 1.65, fontWeight: 500 }}>
            매 1분마다 15초 대기열 → 45초 좌석 선택을 반복 연습합니다.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#555', fontWeight: 500 }}>
            <span>15초 대기열</span>
            <span style={{ color: '#ccc' }}>→</span>
            <span>45초 좌석 선택</span>
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
