import type { CvItem } from '@/domain/models/Cv'
import type { ScoreDetail } from './types'
import { m } from '@/paraglide/messages'

export function qualityDetails(cv: CvItem): ScoreDetail[] {
  const details = cv.quality_details
  return [
    {
      title: m.score_detail_basic_information(),
      score: details?.basic_information?.score,
      reason: details?.basic_information?.reason,
    },
    {
      title: m.score_detail_self_evaluation(),
      score: details?.self_evaluation?.score,
      reason: details?.self_evaluation?.reason,
    },
    {
      title: m.score_detail_education(),
      score: details?.education?.score,
      reason: details?.education?.reason,
    },
    {
      title: m.score_detail_work_experience(),
      score: details?.work_experience?.score,
      reason: details?.work_experience?.reason,
    },
    {
      title: m.score_detail_skills_specialties(),
      score: details?.skills_specialties?.score,
      reason: details?.skills_specialties?.reason,
    },
  ]
}

export function appropriateDetails(cv: CvItem): ScoreDetail[] {
  return [
    {
      title: m.score_detail_total_score(),
      score: cv.scores.final_score,
      reason: cv.reasons?.overall_conclusion,
    },
    {
      title: m.score_detail_evaluation_score(),
      score: cv.scores.offline_score ?? cv.quality_score,
      reason: cv.reasons?.offline_reason ?? cv.quality_reasons,
    },
    {
      title: m.score_detail_matching_score(),
      score: cv.scores.matching_score,
      reason: cv.reasons?.matching_reason,
    },
  ]
}
