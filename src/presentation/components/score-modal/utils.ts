export const FALLBACK_REASON = 'Chua co ly do cham diem.'

export function formatScore(score?: number) {
  if (typeof score !== 'number' || !Number.isFinite(score)) return '-'

  if (Number.isInteger(score)) return score.toString()

  return score.toFixed(2).replace(/\.?0+$/, '')
}

export function initials(name?: string) {
  const words = (name || 'CV').trim().split(/\s+/)
  const first = words[0]?.[0] ?? 'C'
  const last = words.length > 1 ? words[words.length - 1]?.[0] : words[0]?.[1]
  return `${first}${last ?? 'V'}`.toUpperCase()
}
