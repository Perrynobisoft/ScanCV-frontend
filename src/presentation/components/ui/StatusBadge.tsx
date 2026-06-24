import { CV_STATUS_LABELS } from '@/shared/constants'

interface StatusBadgeProps {
  status: keyof typeof CV_STATUS_LABELS
  className?: string
}

export default function StatusBadge({
  status,
  className = '',
}: StatusBadgeProps) {
  const statusInfo = CV_STATUS_LABELS[status]

  if (!statusInfo) {
    return null
  }

  return (
    <span
      className={`inline-flex items-center rounded-sm px-3 py-1 text-sm font-semibold text-white ${statusInfo.color} ${className}`}
    >
      {statusInfo.label}
    </span>
  )
}
