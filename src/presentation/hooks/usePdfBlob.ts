import { useEffect, useState } from 'react'
import useAxios from '@/infrastructure/hooks/useAxios'

export function usePdfBlob(pdfUrl?: string) {
  const [blob, setBlob] = useState<Blob>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const { axiosInstance } = useAxios()

  useEffect(() => {
    if (!pdfUrl) return

    let mounted = true

    const loadPdf = async () => {
      try {
        setLoading(true)
        setError(undefined)

        const response = await axiosInstance.get<Blob>(pdfUrl, {
          responseType: 'blob',
          headers: {
            Accept: 'application/pdf',
            'ngrok-skip-browser-warning': 'true', // bypass ngrok's browser warning for PDF files
          },
        })

        const pdfBlob = response.data as Blob

        if (mounted) {
          setBlob(pdfBlob)
        }
      } catch (err: any) {
        if (mounted) {
          setError(
            err?.response?.data?.error?.message ||
              err?.message ||
              'Unknown error',
          )
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadPdf()

    return () => {
      mounted = false
    }
  }, [pdfUrl, axiosInstance])

  return {
    blob,
    loading,
    error,
  }
}
