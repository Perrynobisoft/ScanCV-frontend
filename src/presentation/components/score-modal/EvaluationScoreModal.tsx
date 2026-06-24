import { useMemo, useState } from 'react'
import { FileText } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import ScoreCard from './ScoreCard'
import ScoreCircle from './ScoreCircle'
import ScoreModalBase from './ScoreModalBase'
import { qualityDetails } from './scoreDetails'
import type { EvaluationScoreModalProps } from './types'
import { FALLBACK_REASON, initials } from './utils'

export default function EvaluationScoreModal({
  isOpen,
  onClose,
  cv,
  onRescoreSubmit,
}: EvaluationScoreModalProps) {
  const [request, setRequest] = useState('')
  const details = useMemo(() => qualityDetails(cv), [cv])
  const score = cv.quality_score ?? cv.scores.offline_score
  const reason = cv.quality_reasons ?? cv.reasons?.offline_reason

  const handleSubmit = () => {
    onRescoreSubmit?.(request)
    onClose()
    setRequest('')
  }

  return (
    <ScoreModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Overall - CV Evaluation Score"
      headerMode="avatar"
      headerInitials={initials(cv.full_name)}
      className="h-[85vh] w-full max-w-5xl"
    >
      <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[1fr_0.95fr]">
        <section className="flex min-h-0 flex-col gap-4 border-r border-slate-100 p-5">
          <div className="flex justify-center">
            <ScoreCircle score={score} />
          </div>

          <div className="rounded-sm bg-slate-100 px-4 py-3 text-sm text-slate-700">
            <h3 className="mb-1 font-bold text-slate-900">Lý do chấm điểm</h3>
            <p className="leading-6">{reason || FALLBACK_REASON}</p>
          </div>

          <div className="flex min-h-45 flex-1 flex-col overflow-hidden rounded-sm border border-slate-200">
            <div className="bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              Yêu cầu chấm lại
            </div>
            <textarea
              value={request}
              onChange={(event) => setRequest(event.target.value)}
              className="min-h-0 flex-1 resize-none px-4 py-3 text-sm text-slate-700 outline-none"
              placeholder="Nhập yêu cầu chấm lại điểm..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="default"
              className="min-w-20 rounded-sm!"
              onClick={onClose}
            >
              Lưu
            </Button>
            <Button
              variant="accent"
              className="min-w-20 rounded-sm!"
              onClick={handleSubmit}
            >
              Gửi
            </Button>
          </div>
        </section>

        <section className="min-h-0 overflow-y-auto p-4">
          <div className="mb-5 w-fit border-b-2 border-accent px-1 pb-3 text-sm font-bold text-slate-700">
            <FileText className="mr-2 inline h-4 w-4 text-accent" />
            Assessment Rubrics ({details.length})
          </div>
          <div className="space-y-3">
            {details.map((item, index) => (
              <ScoreCard
                key={item.title}
                item={item}
                defaultOpen={index === 0}
              />
            ))}
          </div>
        </section>
      </div>
    </ScoreModalBase>
  )
}
