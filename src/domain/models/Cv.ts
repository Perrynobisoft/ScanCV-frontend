import type { User } from './Auth'

export interface CvFile {
  id: number
  uploaded_by: number
  original_file_name: string
  file_url: string
  file_type: string
  file_size: number
  ai_document_id?: string
  created_at: string
  updated_at: string
}

export interface CvItem {
  cv_infos_id: number
  cv_file_id: number
  full_name: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  summary: string
  educations: {
    field: string
    degree: string
    university: string
    graduation_year: number
  }[]
  certifications: string[]
  status: string
  created_at: string
  updated_at: string
  cv_file?: CvFile
  skills?: string[]
  uploaded_by?: User
  position: string
  total_experience_years?: number
  work_type?: string
  tag?: 'new' | 'in-progress' | 'rejected' | 'hired' | 'contacted'
  is_marked?: boolean
  note?: string
  quality_score?: number
  quality_reasons?: string
  quality_details?: {
    basic_information: {
      score: number
      reason: string
    }
    self_evaluation?: {
      score: number
      reason: string
    }
    skills_specialties?: {
      score: number
      reason: string
    }
    work_experience?: {
      score: number
      reason: string
    }
    education?: {
      score: number
      reason: string
    }
  }
  scores: {
    offline_score?: number
    matching_score?: number
    final_score?: number
  }
  reasons?: {
    offline_reason?: string
    matching_reason?: string
    overall_conclusion?: string
  }
}

export interface SearchCvRequest {
  query?: string
  page?: number
  limit?: number
}

export interface GetAllCvRequest {
  page?: number
  limit?: number
  search?: string
  filter?: {
    total_experience_years?: number
    skills?: string
    position?: string
    work_type?: string
  }
  extensions?: string
}

export interface CreateCvRequest {
  cv_file_id: number
  full_name: string
  email: string
  phone?: string
  date_of_birth?: string
  address?: string
  position?: string
  work_type?: string
  total_experience_years?: number
  summary?: string
  is_marked?: boolean
  note?: string
  tag?: string
  educations?: string[]
  certifications?: string[]
  status?: string
  skills?: Array<{
    name: string
    confidence_score?: number
    years_of_experience?: number
  }>
}

export interface UpdateCvRequest extends Partial<CreateCvRequest> {
  id: number
}
