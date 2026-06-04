import { m } from '@/paraglide/messages'

export interface FormattedErrorDetail {
  message: string
  status?: number
  timestamp: string
  path?: string
}

export interface FormattedError {
  error: FormattedErrorDetail
}

export const getFormattedErrorMessage = (
  formattedError: unknown,
  fallback = m.common_error_generic(),
) => {
  const error = formattedError as Partial<FormattedError>

  return error.error?.message || fallback
}
