import type { CvItem } from '@/domain/models/Cv'
import type { ScoreDetail } from './types'

export function qualityDetails(cv: CvItem): ScoreDetail[] {
  const details = cv.quality_details
  return [
    {
      title: 'Basic Information',
      score: details?.basic_information?.score,
      reason: details?.basic_information?.reason,
    },
    {
      title: 'Self Evaluation',
      score: details?.self_evaluation?.score,
      reason: details?.self_evaluation?.reason,
    },
    {
      title: 'Education',
      score: details?.education?.score,
      reason: details?.education?.reason,
    },
    {
      title: 'Work Experience',
      score: details?.work_experience?.score,
      reason: details?.work_experience?.reason,
    },
    {
      title: 'Skills Specialities',
      score: details?.skills_specialities?.score,
      reason: details?.skills_specialities?.reason,
    },
  ]
}

export function appropriateDetails(cv: CvItem): ScoreDetail[] {
  return [
    {
      title: 'Total Score',
      score: cv.scores.final_score,
      reason: cv.reasons?.overall_conclusion,
    },
    {
      title: 'Evaluation Score',
      score: cv.scores.offline_score ?? cv.quality_score,
      reason: cv.reasons?.offline_reason ?? cv.quality_reasons,
    },
    {
      title: 'Matching Score',
      score: cv.scores.matching_score,
      reason: cv.reasons?.matching_reason,
    },
  ]
}
