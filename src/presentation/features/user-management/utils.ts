import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function formatLastActive(dateStr?: string | null): string {
  if (!dateStr) return '—'
  const date = dayjs(dateStr)
  const diffMinutes = dayjs().diff(date, 'minute')
  if (diffMinutes < 2) return 'Now'
  return date.fromNow()
}

export const ROLE_LABEL_MAP: Record<string, string> = {
  '1': 'Admin',
  '2': 'Recruiter',
  '3': 'Interviewer',
}

export const ROLE_ID_MAP: Record<string, number> = {
  Admin: 1,
  Recruiter: 2,
  Interviewer: 3,
}

export const STATUS_ID_MAP: Record<string, number> = {
  Active: 1,
  Inactive: 2,
}
