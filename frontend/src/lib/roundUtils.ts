/**
 * 사이클 구조 (4분 단위)
 *   0s ~ 59s  : 대기열 오픈 (입장 가능)
 *  60s ~ 179s : 좌석 선택 (2분)
 * 180s ~ 239s : 쿨다운 (1분 버퍼)
 *
 * 100좌석 / 최대 300명 → 좌석 경쟁 후 자연 종료 + 1분 쿨다운
 */

export const CYCLE_MS = 4 * 60 * 1000   // 4분 사이클
export const QUEUE_OPEN_MS = 60 * 1000  // 대기열 오픈 1분
export const SELECT_MS = 2 * 60 * 1000  // 좌석 선택 2분

/** 오늘 자정 기준 4분 단위로 몇 번째 회차인지 (1-based) */
export function calcRound(): number {
  const now = new Date()
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return Math.floor((now.getTime() - midnight) / CYCLE_MS) + 1
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

/** 현재 4분 사이클의 시작(0s)부터 경과 ms */
export function cycleElapsedMs(): number {
  return Date.now() % CYCLE_MS
}

/** 현재 대기열 오픈 구간인지 (사이클 시작 후 60초 이내) */
export function isQueueOpen(): boolean {
  return cycleElapsedMs() < QUEUE_OPEN_MS
}

/** 오픈 직전 10초 여부 (UI 강조용) */
export function isQueueSoon(): boolean {
  const elapsed = cycleElapsedMs()
  return !isQueueOpen() && elapsed >= CYCLE_MS - 10 * 1000
}
