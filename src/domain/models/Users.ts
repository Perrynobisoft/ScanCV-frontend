export interface Users {
  id: number
  email: string
  fullName: string
  role: string
  status: string
  lastActive: string
}

export interface CreateUsersRequest {
  email: string
  fullname: string
  provider?: string
  socialId?: string
  role: string
}

export interface UpdateUsersRequest {
  id: number
  email: string
  fullname: string
  role: string
}
