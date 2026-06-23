export interface Users {
  id: number
  email: string
  fullName?: string
  role: Role
  status: Status
  createdAt?: string
  updatedAt?: string
}

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
