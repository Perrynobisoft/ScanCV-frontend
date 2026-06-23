# Bulk CV Upload - API Contract

## 1. Create / Continue Bulk Upload

API này được frontend gọi để upload một nhóm file (chunk). Frontend có thể gửi đồng thời tối đa 5 file trong một request.

Nếu `batchId` chưa tồn tại, backend sẽ tạo batch mới. Nếu `batchId` đã tồn tại, backend sẽ thêm các file vào batch hiện tại.

### Endpoint

```http
POST /api/v1/cvs/bulk-upload
```

### Authentication

```text
Authorization: Bearer <JWT_TOKEN>
```

### Content-Type

```text
multipart/form-data
```

### Request

| Field     | Type        | Required | Description                                                   |
| --------- | ----------- | -------- | ------------------------------------------------------------- |
| batchId   | string      | No       | Batch upload identifier. Nếu null, backend tự sinh batch mới. |
| requestId | string      | Yes      | Idempotency key của request.                                  |
| files     | IFormFile[] | Yes      | Danh sách file PDF/DOCX. Tối đa 5 file/request.               |

### Example Request

```http
POST /api/v1/cvs/bulk-upload
Content-Type: multipart/form-data

batchId: batch_8c55c38d
requestId: req_4ef4a2c1

files: cv01.pdf
files: cv02.pdf
files: cv03.docx
files: cv04.pdf
files: cv05.pdf
```

### Response

```json
{
  "success": true,
  "message": "Files accepted for processing.",
  "data": {
    "batchId": "batch_8c55c38d",
    "acceptedFiles": [
      {
        "fileName": "cv01.pdf",
        "status": "ACCEPTED"
      },
      {
        "fileName": "cv02.pdf",
        "status": "ACCEPTED"
      },
      {
        "fileName": "cv03.docx",
        "status": "ACCEPTED"
      },
      {
        "fileName": "cv04.pdf",
        "status": "ACCEPTED"
      },
      {
        "fileName": "cv05.pdf",
        "status": "ACCEPTED"
      }
    ],
    "websocketUrl": "/ws/upload-progress/batch_8c55c38d"
  }
}
```

### HTTP Status

| Status                    | Description                                 |
| ------------------------- | ------------------------------------------- |
| 202 Accepted              | File đã được backend nhận và đưa vào queue. |
| 400 Bad Request           | Request không hợp lệ.                       |
| 401 Unauthorized          | Chưa xác thực.                              |
| 413 Payload Too Large     | File vượt giới hạn kích thước.              |
| 500 Internal Server Error | Lỗi hệ thống.                               |

---

## 2. WebSocket - Upload Progress

Frontend mở một kết nối WebSocket duy nhất cho toàn bộ batch.

### Endpoint

```text
WS /ws/upload-progress/{batchId}
```

Backend chủ động gửi các event dưới dạng JSON.

### Event: File Accepted

Backend đã nhận và lưu file thành công.

```json
{
  "type": "FILE_ACCEPTED",
  "batchId": "batch_8c55c38d",
  "fileName": "cv01.pdf"
}
```

### Event: File Processing

```json
{
  "type": "FILE_PROCESSING",
  "batchId": "batch_8c55c38d",
  "fileName": "cv01.pdf"
}
```

### Event: File Completed

```json
{
  "type": "FILE_COMPLETED",
  "batchId": "batch_8c55c38d",
  "fileName": "cv01.pdf",
  "cvId": 1234
}
```

### Event: File Failed

```json
{
  "type": "FILE_FAILED",
  "batchId": "batch_8c55c38d",
  "fileName": "cv02.pdf",
  "errorCode": "AI_EXTRACTION_ERROR",
  "errorMessage": "Unable to extract candidate information."
}
```

### Event: Batch Progress

```json
{
  "type": "BATCH_PROGRESS",
  "batchId": "batch_8c55c38d",
  "totalFiles": 100,
  "uploadedFiles": 78,
  "completedFiles": 58,
  "failedFiles": 4,
  "processingFiles": 16,
  "progress": 62
}
```

Trong đó:

- `uploadedFiles`: số file backend đã nhận thành công.
- `completedFiles`: số file đã xử lý xong.
- `failedFiles`: số file xử lý lỗi.
- `processingFiles`: số file đã upload nhưng đang chờ hoặc đang được worker xử lý.
- `progress`: `(completedFiles + failedFiles) / totalFiles * 100`.

### Event: Batch Completed

```json
{
  "type": "BATCH_COMPLETED",
  "batchId": "batch_8c55c38d",
  "totalFiles": 100,
  "completedFiles": 96,
  "failedFiles": 4
}
```

---

## 3. Get Batch Status

API này dùng để đồng bộ lại trạng thái khi frontend refresh trang hoặc mất kết nối WebSocket.

### Endpoint

```http
GET /api/v1/cvs/bulk-upload/{batchId}
```

## Response

{
"success": true,
"data": {
"batch_id": "batch_8c55c38d",
"status": "PROCESSING",
"total_files": 100,
"uploaded_files": 78,
"completed_files": 58,
"failed_files": 4,
"processing_files": 16,
"progress": 62,
"items": [
{
"file_id": "1",
"file_name": "cv_a.pdf",
"file_size": 245760,
"status": "COMPLETED"
},
{
"file_id": "2",
"file_name": "cv_b.pdf",
"file_size": 189440,
"status": "FAILED",
"error_message": "Invalid PDF"
},
{
"file_id": "3",
"file_name": "cv_c.pdf",
"file_size": 312832,
"status": "PROCESSING"
}
]
}
}

## Bảng batch_uploads

## batch_uploads

id
batch_id
status
total_files
uploaded_files
completed_files
failed_files
processing_files
progress
created_at
updated_at

## Bảng batch_upload_items

## batch_upload_items

id
batch_upload_id
file_name
file_size
status
error_message
created_at
updated_at

## Item Status:

QUEUE
PROCESSING
COMPLETED
FAILED

## 4. Cancel Batch Upload

Hủy việc upload và xử lý các file chưa hoàn thành.

### Endpoint

```http
POST /api/v1/cvs/bulk-upload/{batchId}/cancel
```

### Request Body

Không có request body.

### Response

```json
{
  "success": true,
  "message": "Batch cancellation requested.",
  "data": {
    "batchId": "batch_8c55c38d",
    "status": "CANCELLING"
  }
}
```

### Business Rules

- Các request upload đang gửi từ frontend sẽ bị frontend tự hủy bằng `AbortController`.
- Các file backend đã nhận thành công vẫn được giữ lại.
- File đang được worker xử lý sẽ tiếp tục chạy đến khi hoàn thành.
- Worker không lấy thêm file mới thuộc batch này để xử lý.
- Khi toàn bộ worker kết thúc, backend gửi sự kiện `BATCH_CANCELLED` qua WebSocket.

---

## 5. Business Flow

```text
User selects files
        │
        ▼
Frontend creates batch
        │
        ├── POST /bulk-upload (max 5 files/request)
        ├── POST /bulk-upload (max 5 files/request)
        ├── ...
        │
        ▼
Backend accepts files
        │
        ├── Save original file
        ├── Push background job
        └── Send WebSocket events
                │
                ▼
       PDF/DOCX → Markdown
                │
                ▼
          AI Extraction
                │
                ▼
        Save PostgreSQL
                │
                ▼
      FILE_COMPLETED / FILE_FAILED
                │
                ▼
        BATCH_COMPLETED
```

## 6. Frontend Responsibilities

- Chia danh sách file thành các request, tối đa 5 file/request.
- Lưu `batchId` của phiên upload hiện tại.
- Mở duy nhất một WebSocket theo `batchId`.
- Khi refresh trang, gọi `GET /bulk-upload/{batchId}` để lấy trạng thái hiện tại.
- Khi người dùng hủy, gọi `POST /bulk-upload/{batchId}/cancel` và đồng thời hủy các request upload còn đang gửi bằng `AbortController`.
