export type SoloRecord = {
  mode: 'queue' | 'seat'
  elapsedMs: number
  recordedAt: number
}

const STORAGE_KEY = 'solo_records'

function getWeekStart(ts: number): number {
  const d = new Date(ts)
  const day = d.getDay() // 0=Sun, 1=Mon...
  const diff = (day === 0 ? -6 : 1 - day) // 이번 주 월요일
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + diff)
  return d.getTime()
}

function loadAll(): SoloRecord[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveAll(records: SoloRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export function saveRecord(mode: 'queue' | 'seat', elapsedMs: number) {
  const now = Date.now()
  const weekStart = getWeekStart(now)
  // 이번 주 데이터만 유지 + 새 기록 추가
  const kept = loadAll().filter(r => r.recordedAt >= weekStart)
  kept.push({ mode, elapsedMs, recordedAt: now })
  saveAll(kept)
}

export function loadRecords(mode: 'queue' | 'seat'): SoloRecord[] {
  const weekStart = getWeekStart(Date.now())
  return loadAll().filter(r => r.mode === mode && r.recordedAt >= weekStart)
}

export function calcStats(records: SoloRecord[]) {
  if (records.length === 0) return null
  const times = records.map(r => r.elapsedMs)
  return {
    count: records.length,
    best: Math.min(...times),
    avg: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
  }
}
