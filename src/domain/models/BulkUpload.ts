export enum BulkUploadWebSocketEventType {
  FILE_STARTED = 'FILE_STARTED',
  FILE_COMPLETED = 'FILE_COMPLETED',
  FILE_FAILED = 'FILE_FAILED',
  BATCH_PROGRESS = 'BATCH_PROGRESS',
  BATCH_COMPLETED = 'BATCH_COMPLETED',
  BATCH_CANCELLED = 'BATCH_CANCELLED',
}

export enum BulkUploadBatchStatus {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLING = 'CANCELLING',
  CANCELLED = 'CANCELLED',
}

export interface BulkUploadStatusFile {
  file_id: string
  file_name: string
  file_size: number
  status: BulkUploadFileStatus
  error_message?: string
}

export interface BulkUploadStatusResponse {
  batch_id: string
  status: BulkUploadBatchStatus
  total_files: number
  uploaded_files: number
  completed_files: number
  failed_files: number
  processing_files: number
  progress: number
  items: BulkUploadStatusFile[]
}

export enum BulkUploadFileStatus {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export type BulkUploadResponse = {
  batch_id: string
  accepted_files: number
  total_accepted_files: number
  websocket_endpoint: string
}

export interface BulkUploadBaseEvent {
  type: BulkUploadWebSocketEventType
  batch_id: string
}

export interface BulkUploadFileEventBase extends BulkUploadBaseEvent {
  file_id: string
  file_name: string
  status: BulkUploadFileStatus
}

export interface FileStartedEvent extends BulkUploadFileEventBase {
  type: BulkUploadWebSocketEventType.FILE_STARTED
}

export interface FileCompletedEvent extends BulkUploadFileEventBase {
  type: BulkUploadWebSocketEventType.FILE_COMPLETED
  candidate_name: string
}

export interface FileFailedEvent extends BulkUploadFileEventBase {
  type: BulkUploadWebSocketEventType.FILE_FAILED
  error_code?: string
  error_message?: string
}

export interface BatchProgressEvent extends BulkUploadBaseEvent {
  type: BulkUploadWebSocketEventType.BATCH_PROGRESS
  total_files: number
  completed_files: number
  failed_files: number
  cancelled_files: number
  processing_files: number
  pending_files: number
  progress: number
}

export interface BatchCompletedEvent extends BulkUploadBaseEvent {
  type: BulkUploadWebSocketEventType.BATCH_COMPLETED
  total_files: number
  completed_files: number
  failed_files: number
  cancelled_files: number
}

export interface BatchCancelledEvent extends BulkUploadBaseEvent {
  type: BulkUploadWebSocketEventType.BATCH_CANCELLED
  total_files: number
  completed_files: number
  failed_files: number
  cancelled_files: number
}

export type BulkUploadFileEvent =
  | FileStartedEvent
  | FileCompletedEvent
  | FileFailedEvent
export type BulkUploadWebSocketEvent =
  | BulkUploadFileEvent
  | BatchProgressEvent
  | BatchCompletedEvent
  | BatchCancelledEvent

export type BulkUploadProgress = {
  total_files: number
  completed_files: number
  failed_files: number
  cancelled_files: number
  processing_files: number
  pending_files: number
  progress: number
}
