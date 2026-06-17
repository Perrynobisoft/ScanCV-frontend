import { useEffect, useState } from 'react'

export function usePdfBlob(pdfUrl?: string) {
  const [blob, setBlob] = useState<Blob>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (!pdfUrl) return

    let mounted = true

    const loadPdf = async () => {
      try {
        setLoading(true)
        setError(undefined)

        const response = await fetch(pdfUrl)

        if (!response.ok) {
          throw new Error(`Failed to load PDF (${response.status})`)
        }

        const pdfBlob = await response.blob()

        if (mounted) {
          setBlob(pdfBlob)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
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
  }, [pdfUrl])

  return {
    blob,
    loading,
    error,
  }
}
