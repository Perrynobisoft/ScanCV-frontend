export interface Role {
  id: number
  name: string
  __entity: string
}

export interface Status {
  id: number
  name: string
  __entity: string
}

export interface Users {
  id: number
  email: string
  firstName: string
  lastName: string
  provider: string
  socialId: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateUsersRequest {
  email: string
  fullname: string
  password: string
  confirmPassword: string
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
