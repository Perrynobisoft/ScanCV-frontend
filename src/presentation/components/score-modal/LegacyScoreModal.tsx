import { useMemo } from 'react'
import type { CvItem } from '@/domain/models/Cv'
import AppropriateScoreModal from './AppropriateScoreModal'
import type { LegacyScoreModalProps } from './types'

export default function LegacyScoreModal({
  isOpen,
  onClose,
  score,
  reason,
}: LegacyScoreModalProps) {
  const cv = useMemo(
    () =>
      ({
        scores: { final_score: score, offline_score: score },
        reasons: { overall_conclusion: reason, offline_reason: reason },
      }) as CvItem,
    [reason, score],
  )

  return <AppropriateScoreModal isOpen={isOpen} onClose={onClose} cv={cv} />
}
