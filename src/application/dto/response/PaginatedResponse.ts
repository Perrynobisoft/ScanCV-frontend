import { type ResponseCommon } from './ResponseCommon'

export interface PaginatedData<T> {
  items: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages?: number
  }
}

export type PaginatedResponse<T> = ResponseCommon<PaginatedData<T>>
