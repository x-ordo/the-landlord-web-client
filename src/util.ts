export function uuid(): string {
  // browser-safe uuid
  if (crypto?.randomUUID) return crypto.randomUUID()
  // fallback
  return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function fmtGold(n: number): string {
  return new Intl.NumberFormat('ko-KR').format(Math.floor(n))
}

export function timeAgo(iso: string): string {
  const t = new Date(iso).getTime()
  const d = Date.now() - t
  const s = Math.floor(d / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const day = Math.floor(h / 24)
  return `${day}d`
}
