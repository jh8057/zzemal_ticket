import { useEffect, useState } from 'react'

interface CountdownProps {
  targetTime: Date
}

export default function Countdown({ targetTime }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft())

  function calcTimeLeft() {
    const diff = targetTime.getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [targetTime])

  return (
    <div className="flex gap-4 items-center justify-center">
      {timeLeft.days > 0 && (
        <TimeUnit value={timeLeft.days} label="일" />
      )}
      <TimeUnit value={timeLeft.hours} label="시간" />
      <Colon />
      <TimeUnit value={timeLeft.minutes} label="분" />
      <Colon />
      <TimeUnit value={timeLeft.seconds} label="초" />
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-5xl font-mono font-bold text-white tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs text-gray-400 mt-1">{label}</span>
    </div>
  )
}

function Colon() {
  return <span className="text-4xl font-bold text-gray-500 mb-4">:</span>
}
