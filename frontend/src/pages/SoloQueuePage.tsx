import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ACCENT = '#ea580c'
const INTERVAL_S = 10

type Phase = 'waiting' | 'open' | 'result'

export default function SoloQueuePage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('waiting')
  const [countdown, setCountdown] = useState(INTERVAL_S)
  const [reactionMs, setReactionMs] = useState<number | null>(null)
  const [history, setHistory] = useState<number[]>([])

  const openedAtMs = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    startCountdown()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  function startCountdown() {
    setPhase('waiting')
    setCountdown(INTERVAL_S)
    openedAtMs.current = 0

    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          openedAtMs.current = Date.now()
          setPhase('open')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function handleQueueClick() {
    if (phase !== 'open') return
    const ms = Date.now() - openedAtMs.current
    setReactionMs(ms)
    setHistory(prev => [ms, ...prev].slice(0, 10))
    setPhase('result')
  }

  function next() {
    setReactionMs(null)
    startCountdown()
  }

  const bestMs = history.length > 0 ? Math.min(...history) : null
  const avgMs = history.length > 0 ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : null

  function scoreLabel(ms: number) {
    if (ms < 300) return '반사신경 최상'
    if (ms < 600) return '빠름'
    if (ms < 1000) return '평균'
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
        <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>대기열 반응속도 연습</span>
        {history.length > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#555', fontWeight: 500 }}>
            {history.length}회 완료
          </span>
        )}
      </header>

      <main style={{ flex: 1, display: 'flex', gap: 0, overflow: 'hidden' }}>
        {/* Center */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', gap: '48px' }}>

          {/* WAITING */}
          {phase === 'waiting' && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', color: '#444', fontWeight: 600, margin: '0 0 20px' }}>
                대기열 오픈까지
              </p>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(5rem, 18vw, 8rem)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.04em', color: '#111' }}>
                {String(countdown).padStart(2, '0')}
              </div>
              <p style={{ fontSize: '0.95rem', color: '#444', fontWeight: 500, marginTop: '20px' }}>
                버튼이 나타나면 최대한 빠르게 클릭하세요
              </p>
            </div>
          )}

          {/* OPEN */}
          {phase === 'open' && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
              <p style={{ fontSize: '1.1rem', color: ACCENT, fontWeight: 700, margin: 0 }}>
                대기열 오픈!
              </p>
              <button
                onClick={handleQueueClick}
                style={{
                  padding: '24px 64px',
                  background: ACCENT, color: '#fff',
                  border: 'none', borderRadius: '8px',
                  fontSize: '1.4rem', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.1s, transform 0.1s',
                  animation: 'pulse 0.4s ease-out',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#c2410c')}
                onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
                onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                대기열 입장
              </button>
            </div>
          )}

          {/* RESULT */}
          {phase === 'result' && reactionMs !== null && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: ACCENT, letterSpacing: '0.15em', fontWeight: 700, margin: '0 0 16px' }}>REACTION</p>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(3.5rem, 14vw, 6rem)', fontWeight: 700, lineHeight: 1, color: '#111' }}>
                  {reactionMs < 1000
                    ? <>{reactionMs}<span style={{ fontSize: '1.5rem', color: '#555', marginLeft: '4px' }}>ms</span></>
                    : <>{(reactionMs / 1000).toFixed(2)}<span style={{ fontSize: '1.5rem', color: '#555', marginLeft: '4px' }}>s</span></>
                  }
                </div>
                <p style={{ fontSize: '1rem', color: '#444', fontWeight: 600, marginTop: '12px' }}>{scoreLabel(reactionMs)}</p>
              </div>

              {bestMs !== null && (
                <div style={{ display: 'flex', gap: '32px', fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 4px', color: '#888', fontSize: '0.75rem', letterSpacing: '0.1em' }}>BEST</p>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: '#111', margin: 0 }}>
                      {bestMs < 1000 ? `${bestMs}ms` : `${(bestMs / 1000).toFixed(2)}s`}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 4px', color: '#888', fontSize: '0.75rem', letterSpacing: '0.1em' }}>AVG</p>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: '#111', margin: 0 }}>
                      {avgMs! < 1000 ? `${avgMs}ms` : `${(avgMs! / 1000).toFixed(2)}s`}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={next}
                style={{ padding: '14px 48px', background: ACCENT, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#c2410c')}
                onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
              >다시 하기</button>
            </div>
          )}
        </div>

        {/* Right: History */}
        {history.length > 0 && (
          <div style={{ width: '180px', borderLeft: '1px solid #e5e5e5', padding: '24px 20px', flexShrink: 0, overflowY: 'auto' }}>
            <p style={{ fontSize: '0.75rem', color: '#444', letterSpacing: '0.1em', fontWeight: 600, margin: '0 0 16px' }}>기록</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {history.map((ms, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500 }}>#{history.length - i}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.95rem', fontWeight: 700, color: i === 0 ? ACCENT : '#111' }}>
                    {ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
