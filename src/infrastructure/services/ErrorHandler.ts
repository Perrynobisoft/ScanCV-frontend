import toast from 'react-hot-toast'
import { getFormattedErrorMessage } from '@/application/dto/response/ErrorResponse'

class ErrorHandler {
  static notifyApiError(error: unknown, fallback?: string) {
    const message = getFormattedErrorMessage(error, fallback)
    toast.error(message)
  }

  static notify(message: string) {
    toast.error(message)
  }
}

export default ErrorHandler
