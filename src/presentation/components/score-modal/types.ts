import type { ReactNode } from 'react'
import type { CvItem } from '@/domain/models/Cv'

export type ScoreDetail = {
  title: string
  score?: number
  reason?: string
}

export type ScoreModalBaseProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  headerMode: 'avatar' | 'icon'
  headerInitials?: string
  children: ReactNode
  className: string
}

export type EvaluationScoreModalProps = {
  isOpen: boolean
  onClose: () => void
  cv: CvItem
  onRescoreSubmit?: (request: string) => void
}

export type AppropriateScoreModalProps = {
  isOpen: boolean
  onClose: () => void
  cv: CvItem
}

export type LegacyScoreModalProps = {
  isOpen: boolean
  onClose: () => void
  score: number | undefined
  reason?: string | undefined
  fullName: string
}
