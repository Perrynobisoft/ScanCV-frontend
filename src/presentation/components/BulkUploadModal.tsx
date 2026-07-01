import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRepository } from '@/di/RepositoriesProvider'
import useBulkUpload from '@/presentation/hooks/useBulkUpload'
import useWebSocket from '@/presentation/hooks/useWebSocket'
import { X, Trash2, Upload } from 'lucide-react'
import { FileUploadStatus, type FileItem } from '@/domain/models/File'
import {
  BulkUploadBatchStatus,
  BulkUploadFileStatus,
  BulkUploadWebSocketEventType,
  type BatchProgressEvent,
  type BulkUploadFileEvent,
  type BulkUploadProgress,
  type BulkUploadWebSocketEvent,
  type BatchCompletedEvent,
  type BatchCancelledEvent,
} from '@/domain/models/BulkUpload'
import { m } from '@/paraglide/messages'

export default function BulkUploadModal({ onClose }: { onClose: () => void }) {
  const { cvRepository } = useRepository()
  const {
    upload,
    isProcessing,
    isUploadPending,
    cancel,
    clearBatchId,
    batchId,
  } = useBulkUpload()
  const { connect, disconnect, connected, messages } =
    useWebSocket<BulkUploadWebSocketEvent>()

  const [items, setItems] = useState<FileItem[]>([])
  const [batchProgress, setBatchProgress] = useState<BulkUploadProgress | null>(
    null,
  )
  const inputRef = useRef<HTMLInputElement | null>(null)

  const calculateProgress = (
    total_files: number,
    completed_files: number,
    failed_files: number,
    cancelled_files: number,
    processing_files: number,
  ) => {
    if (total_files === 0) return 0
    const donePoints = completed_files + failed_files + cancelled_files
    const processingPoints = processing_files * 0.5
    return Math.round(((donePoints + processingPoints) / total_files) * 100)
  }

  const addFiles = (files: FileList | null) => {
    if (!files) return

    const arr = Array.from(files).map((f) => ({
      file: f,
      id: `${f.name}-${f.size}-${Date.now()}`,
      file_name: f.name,
      size: f.size,
      status: FileUploadStatus.QUEUED,
    }))

    setItems((s) => [...s, ...arr])
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    addFiles(e.dataTransfer.files)
  }

  const removeItem = (id: string) =>
    setItems((s) => s.filter((i) => i.id !== id))

  const startUpload = async () => {
    const uploadableItems = items.filter(
      (item) => item.status !== FileUploadStatus.COMPLETED,
    )
    if (uploadableItems.length === 0) return

    const files = uploadableItems.map((i) => i.file)
    await upload(files, (id, websocketUrl) => {
      const url =
        websocketUrl ??
        `${process.env.VITE_APP_WEBSOCKET_URL}/ws/upload-progress/${id}`
      connect(url)
    })
  }

  const clearAll = async () => {
    if (isUploadPending) {
      await cancel()
    }
    clearBatchId()
    setItems([])
    setBatchProgress(null)
    disconnect()
  }

  const totalSize = useMemo(
    () => items.reduce((acc, it) => acc + it.file.size, 0),
    [items],
  )
  const statusQuery = cvRepository.getBulkUploadStatus({
    batchId: batchId ?? '',
  })

  useEffect(() => {
    if (connected) return

    const data = statusQuery.data?.data
    if (!data) return

    const statusItems = data.items.map((file) => ({
      file: new File([], file.file_name),
      id: `${file.file_id}-${file.file_name}`,
      file_name: file.file_name,
      status:
        file.status === BulkUploadFileStatus.COMPLETED
          ? FileUploadStatus.COMPLETED
          : file.status === BulkUploadFileStatus.PROCESSING
            ? FileUploadStatus.PROCESSING
            : FileUploadStatus.FAILED,
      message: file.error_message,
      size: file.file_size,
    }))

    setItems(statusItems)

    setBatchProgress({
      total_files: data.total_files,
      completed_files: data.completed_files,
      failed_files: data.failed_files,
      cancelled_files: 0,
      processing_files: data.processing_files,
      pending_files: Math.max(0, data.total_files - data.uploaded_files),
      progress: calculateProgress(
        data.total_files,
        data.completed_files,
        data.failed_files,
        0,
        data.processing_files,
      ),
    })

    connect(
      `${process.env.VITE_APP_WEBSOCKET_URL}/ws/upload-progress/${batchId}`,
    )
    if (
      data.status === BulkUploadBatchStatus.COMPLETED ||
      data.status === BulkUploadBatchStatus.CANCELLED
    ) {
      clearBatchId()
    }
  }, [
    batchId,
    clearBatchId,
    connected,
    connect,
    disconnect,
    statusQuery.data?.data,
  ])

  useEffect(() => {
    if (messages.length === 0) return

    const latest = messages[messages.length - 1]
    if (!latest || typeof latest !== 'object') return

    const event = latest as BulkUploadWebSocketEvent

    const updateFileItem = (fileEvent: BulkUploadFileEvent) => {
      setItems((prev) =>
        prev.map((item) => {
          if (
            item.file.name !== fileEvent.file_name &&
            item.file_name !== fileEvent.file_name
          )
            return item

          if (fileEvent.type === BulkUploadWebSocketEventType.FILE_STARTED) {
            return { ...item, status: FileUploadStatus.PROCESSING }
          }

          if (fileEvent.type === BulkUploadWebSocketEventType.FILE_COMPLETED) {
            return {
              ...item,
              status: FileUploadStatus.COMPLETED,
            }
          }

          if (fileEvent.type === BulkUploadWebSocketEventType.FILE_FAILED) {
            return {
              ...item,
              status: FileUploadStatus.FAILED,
              message: fileEvent.error_message || 'Failed',
            }
          }

          return item
        }),
      )
    }

    switch (event.type) {
      case BulkUploadWebSocketEventType.FILE_STARTED:
        updateFileItem(event)
        break
      case BulkUploadWebSocketEventType.FILE_COMPLETED:
        updateFileItem(event)
        break
      case BulkUploadWebSocketEventType.FILE_FAILED:
        updateFileItem(event)
        break
      case BulkUploadWebSocketEventType.BATCH_PROGRESS: {
        const progressEvent = event as BatchProgressEvent
        setBatchProgress({
          ...progressEvent,
          progress: calculateProgress(
            progressEvent.total_files,
            progressEvent.completed_files,
            progressEvent.failed_files,
            progressEvent.cancelled_files,
            progressEvent.processing_files,
          ),
        })
        break
      }
      case BulkUploadWebSocketEventType.BATCH_COMPLETED:
        disconnect()
        clearBatchId()
        break
      case BulkUploadWebSocketEventType.BATCH_CANCELLED: {
        const summary = event as BatchCompletedEvent | BatchCancelledEvent
        setBatchProgress({
          total_files: summary.total_files,
          completed_files: summary.completed_files,
          failed_files: summary.failed_files,
          cancelled_files: summary.cancelled_files,
          processing_files: 0,
          pending_files: 0,
          progress: calculateProgress(
            summary.total_files,
            summary.completed_files,
            summary.failed_files,
            summary.cancelled_files,
            0,
          ),
        })
        disconnect()
        clearBatchId()
        break
      }
      default:
        break
    }
  }, [messages, disconnect, clearBatchId])

  // Tối ưu được thành reducer
  const statusCounts = useMemo(
    () => ({
      queued: items.filter((it) => it.status === FileUploadStatus.QUEUED)
        .length,
      processing: items.filter(
        (it) => it.status === FileUploadStatus.PROCESSING,
      ).length,
      completed: items.filter((it) => it.status === FileUploadStatus.COMPLETED)
        .length,
      failed: items.filter((it) => it.status === FileUploadStatus.FAILED)
        .length,
    }),
    [items],
  )

  return (
    <div className="relative z-60 flex max-h-[calc(100vh-4rem)] w-full max-w-150 min-w-100 flex-col gap-2 overflow-hidden rounded-md bg-white shadow-2xl px-6 py-4">
      <button
        type="button"
        className="absolute right-4 top-4 z-70 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </button>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-slate-100 text-accent">
            <Upload className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{m.bulk_upload_title()}</h3>
            <p className="text-sm text-slate-500">{m.bulk_upload_subtitle()}</p>
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div className="gap-2 flex flex-col">
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="group flex flex-col gap-2 rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-center transition hover:border-slate-300 hover:bg-white cursor-pointer"
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,application/pdf"
            onChange={(e) => addFiles(e.target.files)}
          />
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-accent shadow-sm">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-base font-semibold text-slate-700">
            {m.bulk_upload_dropzone_title()}
          </p>
          <p className="text-sm text-slate-500">
            {m.bulk_upload_dropzone_subtitle()}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-slate-300 bg-white px-3 py-1">
              PDF
            </span>
            <span className="rounded-full border border-slate-300 bg-slate-200/80 px-3 py-1">
              DOCX
            </span>
            <span className="rounded-full border border-slate-300 bg-slate-200/80 px-3 py-1">
              DOC
            </span>
          </div>
        </div>

        {/* Result Processing */}
        <div className="space-y-2 rounded-md bg-slate-100 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                {m.bulk_upload_progress_title()}
              </div>
              <div className="text-xs text-slate-500">
                {m.bulk_upload_progress_subtitle()}
              </div>
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {batchProgress ? batchProgress.progress : 0}%
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{
                width: `${batchProgress ? batchProgress.progress : 0}%`,
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            <div className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
              {m.bulk_upload_status_parsed()}{' '}
              {batchProgress
                ? batchProgress.completed_files
                : statusCounts.completed}
            </div>
            <div className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
              {m.bulk_upload_status_parsing()}{' '}
              {batchProgress
                ? batchProgress.processing_files
                : statusCounts.processing}
            </div>
            <div className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">
              {m.bulk_upload_status_failed()}{' '}
              {batchProgress ? batchProgress.failed_files : statusCounts.failed}
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
              {m.bulk_upload_status_queued()}{' '}
              {batchProgress
                ? batchProgress.pending_files
                : statusCounts.queued}
            </div>
          </div>
        </div>
      </div>

      {/* File processing */}
      <div className="flex flex-col flex-1 min-h-0 rounded-md border border-slate-200 bg-white">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-100 text-slate-500 rounded-tl-md rounded-tr-md">
          <div>
            <div className="text-sm font-semibold">
              {m.bulk_upload_files_header({ count: items.length })}
            </div>
            <div className="text-xs text-slate-500">
              {(totalSize / 1024 / 1024).toFixed(2)} MB total
            </div>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 && (
            <div className="flex items-center justify-center rounded-md h-full p-4 text-center text-slate-500">
              {m.bulk_upload_no_files()}
            </div>
          )}

          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between gap-4 p-4 border-t border-slate-200"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">
                  {it.file_name ?? it.file.name}
                </div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span>
                    {((it.size ?? it.file.size ?? 0) / 1024).toFixed(0)} KB
                  </span>
                  {it.message && <span>{it.message}</span>}
                </div>
              </div>

              {/* Tách badge ra được */}
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    it.status === FileUploadStatus.COMPLETED
                      ? 'bg-emerald-100 text-emerald-700'
                      : it.status === FileUploadStatus.PROCESSING
                        ? 'bg-amber-100 text-amber-700'
                        : it.status === FileUploadStatus.FAILED
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {it.status === FileUploadStatus.COMPLETED &&
                    m.bulk_upload_file_status_parsed()}
                  {it.status === FileUploadStatus.PROCESSING &&
                    m.bulk_upload_file_status_parsing()}
                  {it.status === FileUploadStatus.FAILED &&
                    m.bulk_upload_file_status_failed()}
                  {it.status === FileUploadStatus.QUEUED &&
                    m.bulk_upload_file_status_queued()}
                </span>
                <button
                  onClick={() => removeItem(it.id)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 my-auto">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={clearAll}
            className="rounded-sm border border-slate-200 bg-slate-50 py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {m.bulk_upload_btn_clear()}
          </button>
          <button
            onClick={cancel}
            disabled={!isProcessing}
            className="rounded-sm border border-rose-200 bg-rose-50 py-2 px-3 text-sm font-medium text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {m.bulk_upload_btn_cancel()}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={startUpload}
            disabled={
              isUploadPending ||
              isProcessing ||
              items.length === 0 ||
              items.every((item) => item.status === FileUploadStatus.COMPLETED)
            }
            className="rounded-sm bg-accent px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {m.bulk_upload_btn_upload()}
          </button>
        </div>
      </div>
    </div>
  )
}
