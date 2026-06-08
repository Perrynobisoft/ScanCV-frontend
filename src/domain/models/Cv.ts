export interface CvItem {
  id: number
  candidateName: string
  email: string
  position: string
  skills: string[]
  uploadDate: string
  owner: string
}

export interface SearchCvRequest {
  query: string
}

export interface CreateCvRequest {
  candidateName: string
  email: string
  position: string
  skills: string[]
  owner: string
  uploadDate?: string
}

export interface UpdateCvRequest extends Partial<CreateCvRequest> {
  id: number
}
