export interface ResponseCommon<T> {
  data: T
  message?: string
  success: boolean
  statusCode?: number
}
