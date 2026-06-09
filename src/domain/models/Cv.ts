export interface CvFile {
  id: number
  uploadedBy: number
  originalFileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  aiDocumentId?: string
  createdAt: string
  updatedAt: string
}

export interface Skill {
  id: number
  name: string
  createdAt: string
}

export interface CvSkill {
  id: number
  cvInfoId: number
  skillId: number
  confidenceScore: number
  yearsOfExperience: number
  skill: Skill
}

export interface CvItem {
  id: number
  cvFileId: number
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  summary: string
  educations: string[]
  certifications: string[]
  status: string
  createdAt: string
  updatedAt: string
  file?: CvFile
  skills?: CvSkill[]
}

export interface SearchCvRequest {
  query?: string
  page?: number
  limit?: number
}

export interface CreateCvRequest {
  cvFileId: number
  fullName: string
  email: string
  phone?: string
  dateOfBirth?: string
  address?: string
  summary?: string
  educations?: string[]
  certifications?: string[]
  status?: string
  skills?: Array<{
    skillId: number
    confidenceScore: number
    yearsOfExperience: number
  }>
}

export interface UpdateCvRequest extends Partial<CreateCvRequest> {
  id: number
}
