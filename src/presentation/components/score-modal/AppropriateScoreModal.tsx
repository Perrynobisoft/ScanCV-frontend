import { useMemo } from 'react'
import ScoreCard from './ScoreCard'
import ScoreCircle from './ScoreCircle'
import ScoreModalBase from './ScoreModalBase'
import { appropriateDetails } from './scoreDetails'
import type { AppropriateScoreModalProps } from './types'
import { m } from '@/paraglide/messages'

export default function AppropriateScoreModal({
  isOpen,
  onClose,
  cv,
}: AppropriateScoreModalProps) {
  const details = useMemo(() => appropriateDetails(cv), [cv])
  const score = cv.scores.final_score ?? cv.scores.matching_score

  return (
    <ScoreModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={m.score_appropriate_title()}
      headerMode="icon"
      className="h-[80vh] w-full max-w-md"
    >
      <div className="space-y-4 p-5">
        <div className="flex justify-center">
          <ScoreCircle score={score} />
        </div>
        <div className="space-y-3">
          {details.map((item, index) => (
            <ScoreCard key={item.title} item={item} defaultOpen={index === 0} />
          ))}
        </div>
      </div>
    </ScoreModalBase>
  )
}
