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

// export interface CvSkill {
//   id?: number
//   cv_info_id?: number
//   name: string
//   confidence_score?: number
//   years_of_experience?: number
// }

export interface CvItem {
  id: number
  cv_file_id: number
  full_name: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  summary: string
  educations: string[]
  certifications: string[]
  status: string
  created_at: string
  updated_at: string
  file?: CvFile
  skills?: string[]
  uploaded_by?: User
  position: string
}

export interface SearchCvRequest {
  query?: string
  page?: number
  limit?: number
}

export interface CreateCvRequest {
  cv_file_id: number
  full_name: string
  email: string
  phone?: string
  date_of_birth?: string
  address?: string
  summary?: string
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
