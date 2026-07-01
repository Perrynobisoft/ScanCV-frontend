import { useEffect, useState } from 'react'
import useAxios from '@/infrastructure/hooks/useAxios'

/**
 * Rewrite absolute backend file URLs to relative paths so the request
 * goes through the Vite dev proxy (or nginx proxy in production),
 * avoiding mixed-content / SSL errors when the backend serves HTTP.
 *
 * e.g. "http://14.9.0.21:5226/files/foo.pdf" → "/files/foo.pdf"
 */
function toProxiedUrl(url: string): string {
  try {
    const { pathname } = new URL(url)
    return pathname
  } catch {
    return url // already a relative path or invalid — leave as-is
  }
}

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

        const response = await axiosInstance.get<Blob>(toProxiedUrl(pdfUrl), {
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
