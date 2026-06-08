# CV Nobisoft Search - Agent Context

## Project Overview

CV Nobisoft Search là hệ thống tìm kiếm hồ sơ ứng viên bằng AI.

Thay vì tìm kiếm bằng keyword truyền thống, người dùng nhập yêu cầu bằng ngôn ngữ tự nhiên và hệ thống trả về danh sách CV phù hợp nhất.

Ví dụ:

"Tìm senior frontend React từ 2 năm kinh nghiệm trở lên"

"Tìm ứng viên đã từng làm fintech và biết AWS"

Hệ thống sử dụng Semantic Search dựa trên Embedding và Vector Database.

---

# Business Goals

Mục tiêu của hệ thống:

- Quản lý kho CV tập trung
- Upload CV số lượng lớn
- Tìm kiếm CV bằng AI
- Giảm thời gian tìm ứng viên
- Hỗ trợ HR quản lý trạng thái tuyển dụng

---

# User Roles

## HR User

Có thể:

- Đăng nhập
- Upload CV
- Bulk Upload CV
- Tìm kiếm CV
- Xem CV
- Download CV
- Cập nhật trạng thái CV

## Admin

Có toàn bộ quyền của HR

Thêm:

- CRUD CV
- Quản lý người dùng
- Quản lý hệ thống

---

# Core Business Flow

## Upload CV Flow

1. User upload file PDF hoặc DOCX
2. Hệ thống lưu file gốc
3. Hệ thống trích xuất nội dung CV
4. Hệ thống sinh embedding
5. Embedding được lưu vào Vector Database
6. Metadata được lưu vào PostgreSQL
7. CV sẵn sàng cho tìm kiếm

---

## Search Flow

1. User nhập prompt
2. Hệ thống sinh embedding cho prompt
3. Query Vector Database
4. Lấy Top K CV liên quan
5. Trả về danh sách CV theo relevance score

---

# CV Lifecycle

CV có các trạng thái:

- New
- Contacted
- Interviewing
- Offered
- Hired
- Rejected

Chỉ trạng thái thay đổi.
File CV gốc không thay đổi.

---

# Duplicate CV Rules

Một CV được xem là trùng khi:

- Cùng Email

hoặc

- Cùng Phone

hoặc

- Hash nội dung giống nhau

Khi phát hiện trùng:

- Không tạo CV mới
- Tăng version
- Ghi log upload

---

# Main Entities

## CV

Fields:

- id
- fileName
- filePath
- candidateName
- email
- phone
- position
- skills
- experienceYears
- status
- uploadDate
- version

---

## User

Fields:

- id
- email
- role

Role:

- ADMIN
- HR

---

# Search Architecture

Search Type:

Semantic Search

Components:

- OpenAI Embedding Model
- ChromaDB
- PostgreSQL

Search Pipeline:

Query
→ Embedding
→ ChromaDB Similarity Search
→ Top K Results
→ PostgreSQL Metadata
→ Response

---

# Technical Architecture

Frontend

- React
- TypeScript

Backend

- ASP.NET REST API

Storage

- PostgreSQL
- Local File Storage

Authentication

- JWT
- OAuth2
- Google SSO
- Microsoft SSO

---

# Non Functional Requirements

Search latency:

< 3 seconds

Concurrent uploads:

100+ CV

Availability:

99.9%

---

# Important Rules For AI Agents

1. Không được xoá dữ liệu CV vật lý.
2. Không được sửa file CV gốc.
3. Mọi thay đổi trạng thái CV phải được audit log.
4. Upload CV phải hỗ trợ idempotency.
5. Search phải ưu tiên semantic search trước keyword search.
6. Metadata luôn nằm trong PostgreSQL.
7. Embedding luôn nằm trong ChromaDB.

---

# Future Roadmap

- Candidate Ranking
- Resume Summarization
- AI Candidate Matching
- JD to CV Matching
- Interview Recommendation
