import { useCallback, useEffect, useRef, useState } from 'react'
import { useRepository } from '@/di/RepositoriesProvider'
import { Constants } from '@/shared/constants'

const CHUNK_SIZE = 5
const BULK_UPLOAD_BATCH_ID_KEY = Constants.BULK_UPLOAD_BATCH_ID_KEY

const loadStoredBatchId = () => {
  if (typeof window === 'undefined') return undefined
  return window.localStorage.getItem(BULK_UPLOAD_BATCH_ID_KEY) ?? undefined
}

const storeBatchId = (batchId?: string) => {
  if (typeof window === 'undefined') return
  if (batchId) {
    window.localStorage.setItem(BULK_UPLOAD_BATCH_ID_KEY, batchId)
  } else {
    window.localStorage.removeItem(BULK_UPLOAD_BATCH_ID_KEY)
  }
}

type UseBulkUploadReturn = {
  upload: (
    files: File[],
    onBatchCreated?: (batchId: string, websocketUrl?: string) => void,
  ) => Promise<{ batchId?: string; websocketUrl?: string }>
  isProcessing: boolean
  isUploadPending: boolean
  errors: string[]
  cancel: () => Promise<void>
  clearBatchId: () => void
  batchId?: string
}

export default function useBulkUpload(): UseBulkUploadReturn {
  const [uploadPending, setUploadPending] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [batchId, setBatchId] = useState<string | undefined>(() =>
    loadStoredBatchId(),
  )
  const abortRef = useRef<AbortController | null>(null)
  const { cvRepository } = useRepository()

  useEffect(() => {
    storeBatchId(batchId)
  }, [batchId])

  const cancelBulkUploadMutation = cvRepository.cancelBulkUpload()

  const clearBatchId = useCallback(() => {
    setBatchId(undefined)
  }, [])

  const cancel = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }

    if (batchId) {
      try {
        await cancelBulkUploadMutation.mutateAsync({ batchId })
      } catch (err: any) {
        setErrors((e) => [
          ...e,
          err?.error?.message || 'Cancel batch upload failed',
        ])
      } finally {
        clearBatchId()
      }
    }

    setUploadPending(false)
  }, [batchId, cancelBulkUploadMutation, clearBatchId])

  const bulkUploadMutation = cvRepository.bulkUpload()

  const upload = useCallback(
    async (
      files: File[],
      onBatchCreated?: (batchId: string, websocketUrl?: string) => void,
    ) => {
      setErrors([])
      setUploadPending(true)

      abortRef.current = new AbortController()

      let currentBatchId = batchId
      let websocketUrl: string | undefined

      try {
        for (let index = 0; index < files.length; index += CHUNK_SIZE) {
          if (abortRef.current.signal.aborted) break

          const chunk = files.slice(index, index + CHUNK_SIZE)
          const formData = new FormData()
          chunk.forEach((file) => formData.append('files', file))
          formData.append('requestId', `req-${Date.now()}-${Math.random()}`)
          if (currentBatchId) formData.append('batchId', currentBatchId)

          try {
            const response = await bulkUploadMutation.mutateAsync(formData)
            currentBatchId = response.data.batch_id
            setBatchId(currentBatchId)
            websocketUrl = response.data.websocket_endpoint
            onBatchCreated?.(currentBatchId, websocketUrl)
          } catch (err: any) {
            const status = err?.error?.status
            const message =
              err?.error?.message || err?.message || 'Upload failed'

            if (status === 409) {
              if (currentBatchId) {
                currentBatchId = undefined
                clearBatchId()
              }
              setErrors((e) => [
                ...e,
                'Existing batch is invalid or full; cleared batchId. Please retry upload.',
              ])
            } else {
              setErrors((e) => [...e, message])
            }
            break
          }
        }

        setUploadPending(false)
        return { batchId: currentBatchId, websocketUrl }
      } catch (err: any) {
        setUploadPending(false)
        if (err?.name === 'AbortError') {
          return { batchId: currentBatchId, websocketUrl }
        }
        setErrors((e) => [...e, err?.message || String(err)])
        return { batchId: currentBatchId, websocketUrl }
      }
    },
    [batchId, bulkUploadMutation, clearBatchId],
  )

  const isProcessing = Boolean(batchId || uploadPending)
  const isUploadPending = uploadPending

  return {
    upload,
    isProcessing,
    isUploadPending,
    errors,
    cancel,
    clearBatchId,
    batchId,
  }
}
