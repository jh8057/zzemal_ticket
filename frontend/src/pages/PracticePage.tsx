import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SeatMap from '../components/SeatMap'
import { CONCERT, generateMockSeats, type Seat } from '../lib/mockData'

type Phase = 'idle' | 'selecting' | 'confirming' | 'done'

export default function PracticePage() {
  const navigate = useNavigate()
  const [seats, setSeats] = useState(() => generateMockSeats())
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [elapsed, setElapsed] = useState(0)
  const startTime = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startPractice() {
    setPhase('selecting')
    startTime.current = Date.now()
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - (startTime.current ?? Date.now()))
    }, 100)
  }

  function handleSeatClick(seat: Seat) {
    if (phase !== 'selecting') return
    setSelectedSeat(seat)
    setPhase('confirming')
  }

  function confirmBooking() {
    if (timerRef.current) clearInterval(timerRef.current)
    setSeats((prev) =>
      prev.map((s) =>
        s.seatId === selectedSeat?.seatId ? { ...s, status: 'booked' } : s
      )
    )
    setPhase('done')
  }

  function cancelSelection() {
    setSelectedSeat(null)
    setPhase('selecting')
  }

  function reset() {
    setSeats(generateMockSeats())
    setSelectedSeat(null)
    setPhase('idle')
    setElapsed(0)
    startTime.current = null
    if (timerRef.current) clearInterval(timerRef.current)
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const elapsedSec = (elapsed / 1000).toFixed(1)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
          ← 뒤로
        </button>
        <h1 className="text-lg font-bold">혼자 연습하기</h1>
        <span className="ml-auto text-sm text-gray-400">{CONCERT.title}</span>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-0">
        {/* Left: Seat Map */}
        <div className="flex-1 p-6 overflow-auto">
          <SeatMap
            seats={seats}
            selectedSeatId={selectedSeat?.seatId}
            onSeatClick={handleSeatClick}
          />
        </div>

        {/* Right: Control Panel */}
        <div className="lg:w-72 border-t lg:border-t-0 lg:border-l border-gray-800 p-6 flex flex-col gap-6">
          {/* Timer */}
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">경과 시간</p>
            <p className="text-4xl font-mono font-bold text-purple-400 tabular-nums">
              {phase === 'idle' ? '00.0' : elapsedSec}s
            </p>
          </div>

          {/* Phase UI */}
          {phase === 'idle' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400 text-center">
                시작 버튼을 누르면 타이머가 시작됩니다.
                <br />좌석을 선택하고 빠르게 예매를 완료해보세요!
              </p>
              <button
                onClick={startPractice}
                className="w-full bg-purple-600 hover:bg-purple-500 transition-colors font-bold py-4 rounded-xl text-lg"
              >
                시작
              </button>
            </div>
          )}

          {phase === 'selecting' && (
            <div className="space-y-3">
              <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-3 text-center">
                <p className="text-amber-400 font-semibold text-sm">좌석을 선택하세요</p>
                <p className="text-xs text-gray-400 mt-1">초록색 좌석을 클릭하세요</p>
              </div>
              <button
                onClick={reset}
                className="w-full text-gray-400 hover:text-white text-sm py-2 transition-colors"
              >
                처음부터 다시
              </button>
            </div>
          )}

          {phase === 'confirming' && selectedSeat && (
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-xl p-4 space-y-2 text-sm">
                <p className="text-gray-400">선택한 좌석</p>
                <p className="text-xl font-bold">
                  {selectedSeat.section}구역 {selectedSeat.row}행 {selectedSeat.number}번
                </p>
                <p className="text-gray-400">{selectedSeat.price.toLocaleString()}원</p>
              </div>
              <button
                onClick={confirmBooking}
                className="w-full bg-purple-600 hover:bg-purple-500 transition-colors font-bold py-3 rounded-xl"
              >
                예매 확정
              </button>
              <button
                onClick={cancelSelection}
                className="w-full text-gray-400 hover:text-white text-sm py-2 transition-colors"
              >
                다시 선택
              </button>
            </div>
          )}

          {phase === 'done' && selectedSeat && (
            <div className="space-y-4">
              <div className="bg-emerald-900/30 border border-emerald-700 rounded-xl p-4 text-center space-y-2">
                <p className="text-2xl">🎉</p>
                <p className="font-bold text-emerald-400">예매 완료!</p>
                <p className="text-sm text-gray-300">
                  {selectedSeat.section}구역 {selectedSeat.row}행 {selectedSeat.number}번
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">최종 기록</p>
                <p className="text-3xl font-mono font-bold text-purple-400">{elapsedSec}s</p>
                <p className="text-xs text-gray-500 mt-1">
                  {elapsed < 5000 ? '🏆 엄청 빠르네요!' : elapsed < 15000 ? '😊 좋은 속도예요!' : '💪 조금 더 빨리 도전해보세요!'}
                </p>
              </div>
              <button
                onClick={reset}
                className="w-full bg-gray-700 hover:bg-gray-600 transition-colors font-semibold py-3 rounded-xl"
              >
                다시 연습하기
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
