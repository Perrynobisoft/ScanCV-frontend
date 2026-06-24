import { useState } from 'react'
import { ChevronUp } from 'lucide-react'
import type { ScoreDetail } from './types'
import { FALLBACK_REASON, formatScore } from './utils'

type ScoreCardProps = {
  item: ScoreDetail
  defaultOpen?: boolean
}

export default function ScoreCard({
  item,
  defaultOpen = false,
}: ScoreCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 text-left cursor-pointer"
        onClick={() => setIsOpen((value) => !value)}
      >
        <span className="h-6 w-1 rounded-full bg-red-500" />
        <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900">
          {item.title}
        </span>
        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
          {formatScore(item.score)}
        </span>
        <ChevronUp
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            isOpen ? '' : 'rotate-180'
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-2 text-sm leading-6 text-slate-600">
          {item.reason || FALLBACK_REASON}
        </div>
      )}
    </div>
  )
}
