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
  role: Role
  status: Status
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateUsersRequest {
  email: string
  firstName: string
  lastName: string
  provider?: string
  socialId?: string
  roleId?: number
  statusId?: number
}

export interface UpdateUsersRequest extends Partial<CreateUsersRequest> {
  id: number
}
