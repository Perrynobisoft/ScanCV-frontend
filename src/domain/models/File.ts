export type FileItem = {
  file: File
  id: string
  file_name?: string
  status?: FileUploadStatus
  message?: string
  size?: number
}

export enum FileUploadStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
