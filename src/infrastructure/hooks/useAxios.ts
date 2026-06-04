import HttpClient from '@/infrastructure/http/HttpClient'
import { useCallback } from 'react'

/**
 * Hook to provide an Axios instance with request cancellation support
 */
const useAxios = () => {
  /**
   * Generate a new `AbortSignal` for the current request
   */
  const newAbortSignal = useCallback(() => HttpClient.createAbortSignal(), [])

  return {
    axiosInstance: HttpClient.getAxiosInstance(),
    newAbortSignal,
  }
}

export default useAxios
