export const FIVE_MIN_MS = 5 * 60 * 1000
export const ONE_MIN_MS = 60 * 1000

/** 오늘 자정(로컬 시간)부터 5분 단위로 몇 번째인지 (1-based) */
export function calcServiceRound(): number {
  const now = new Date()
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return Math.floor((now.getTime() - midnight) / FIVE_MIN_MS) + 1
}

/** 다음 N분 경계의 timestamp (ms) */
export function calcNextBoundaryMs(intervalMs: number): number {
  return Math.ceil((Date.now() + 1) / intervalMs) * intervalMs
}

/** targetMs까지 남은 시간 → { minutes, seconds } (0 이하 clamp) */
export function diffToMmSs(targetMs: number): { minutes: number; seconds: number } {
  const diff = Math.max(0, targetMs - Date.now())
  const totalSec = Math.ceil(diff / 1000)
  return {
    minutes: Math.floor(totalSec / 60),
    seconds: totalSec % 60,
  }
}

/** 숫자 2자리 zero-pad */
export function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** 현재 5분 주기 시작 후 60초 이내인지 */
export function isServiceQueueOpen(): boolean {
  return Date.now() % FIVE_MIN_MS < 60 * 1000
}
