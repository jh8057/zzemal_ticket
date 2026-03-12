import { useNavigate } from 'react-router-dom'
import Countdown from '../components/Countdown'
import { CONCERT } from '../lib/mockData'

// 티켓 오픈 날짜: 다음 달 1일 오전 10시
const OPEN_DATE = new Date('2026-04-01T10:00:00+09:00')

export default function MainPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <h1 className="text-xl font-bold text-purple-400">🎟 쩌말티켓</h1>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center gap-10 px-4 py-12">
        <div className="text-center space-y-2">
          <p className="text-sm text-purple-400 font-semibold tracking-widest uppercase">
            Coming Soon
          </p>
          <h2 className="text-4xl font-bold">{CONCERT.title}</h2>
          <p className="text-gray-400">
            {CONCERT.date} {CONCERT.time} · {CONCERT.venue}
          </p>
        </div>

        {/* Countdown */}
        <div className="bg-gray-800 rounded-2xl px-10 py-8 space-y-4 text-center shadow-xl">
          <p className="text-sm text-gray-400">티켓 오픈까지</p>
          <Countdown targetTime={OPEN_DATE} />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <button
            onClick={() => navigate('/practice')}
            className="flex-1 bg-purple-600 hover:bg-purple-500 transition-colors font-semibold py-4 rounded-xl text-lg"
          >
            혼자 연습하기
          </button>
          <button
            disabled
            className="flex-1 bg-gray-700 text-gray-500 font-semibold py-4 rounded-xl text-lg cursor-not-allowed"
            title="Phase 2에서 오픈"
          >
            대기열 참여
          </button>
        </div>

        <p className="text-xs text-gray-600">
          대기열 참여는 티켓 오픈 후 활성화됩니다 (Phase 2)
        </p>
      </main>
    </div>
  )
}
