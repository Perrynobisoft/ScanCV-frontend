# Authentication API

## Response Format

```ts
interface ResponseCommon<T> {
  data: T
  message?: string
  success: boolean
  statusCode?: number
}
```

## Token Types

```ts
// Trả về trong response body sau khi login / refresh
interface LoginResponse {
  accessToken: string
  accessTokenExpiresAt: string
  user: User
}

// refreshToken KHÔNG có trong response body.
// Backend tự set qua Set-Cookie header: HttpOnly, Secure, Path=/api/v1/auth/refresh
interface RefreshTokenResponse {
  accessToken: string
  accessTokenExpiresAt: string
}

interface User {
  id: number
  email: string
  fullName: string
  role: string
  status: string
  lastActive: string
}
```

## Authentication Strategy

- **accessToken** — trả trong response body, frontend lưu (memory hoặc cookie JS-accessible) và đính kèm vào mọi request qua header `Authorization: Bearer <accessToken>`.
- **refreshToken** — backend set qua `Set-Cookie` với flags `HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh`. JS không thể đọc được. Browser tự đính kèm khi gọi endpoint `/api/v1/auth/refresh` (cần `withCredentials: true`).

---

# 1. Login

## POST /api/v1/auth/login

### Request Body

```json
{
  "email": "admin@company.com",
  "password": "123456"
}
```

### Response — Thành công

**Set-Cookie header (backend tự set, JS không đọc được):**

```http
Set-Cookie: refreshToken=<jwt-refresh-token>; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh; Expires=Sun, 29 Jun 2026 12:00:00 GMT
```

**Response body:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt-access-token>",
    "accessTokenExpiresAt": "2026-06-22T12:15:00.000Z",
    "user": {
      "id": 42,
      "email": "admin@company.com",
      "fullName": "Nguyen Van Admin",
      "role": "admin",
      "status": "active",
      "lastActive": "2026-06-22T12:00:00.000Z"
    }
  }
}
```

### Response — Sai tài khoản hoặc mật khẩu

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid username or password",
  "data": null
}
```

---

# 2. Change Password

## POST /api/v1/auth/change-password

### Header

```http
Authorization: Bearer <accessToken>
```

### Request Body

```json
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewSecure@123",
  "confirmPassword": "NewSecure@123"
}
```

### Response — Thành công

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password changed successfully",
  "data": null
}
```

### Response — Sai mật khẩu hiện tại

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Old password is incorrect",
  "data": null
}
```

---

# 3. Refresh Access Token

## POST /api/v1/auth/refresh

> `refreshToken` được browser tự đính kèm qua cookie (HttpOnly, chỉ gửi đến path `/api/v1/auth/refresh`).
> Frontend cần gửi request với `withCredentials: true`.
> Không cần `Authorization` header.

### Request

```http
POST /api/v1/auth/refresh
Cookie: refreshToken=<jwt-refresh-token>   ← browser tự đính kèm, không cần set thủ công
```

### Response — Thành công

```http
Set-Cookie: refreshToken=<new-jwt-refresh-token>; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh; Expires=...
```

**Response body:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "<new-jwt-access-token>",
    "accessTokenExpiresAt": "2026-06-22T13:15:00.000Z"
  }
}
```

### Response — Refresh token hết hạn hoặc không hợp lệ

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Refresh token is invalid or expired",
  "data": null
}
```

---

# 4. Logout

## POST /api/v1/auth/logout

### Header

```http
Authorization: Bearer <accessToken>
```

### Response — Thành công

**Set-Cookie header (backend xóa refreshToken cookie):**

```http
Set-Cookie: refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh; Expires=Thu, 01 Jan 1970 00:00:00 GMT
```

**Response body:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged out successfully",
  "data": null
}
```

---

# 5. Get Current User (Me)

## GET /api/v1/auth/me

### Header

```http
Authorization: Bearer <accessToken>
```

### Response — Thành công

```json
{
  "success": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "id": 42,
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "role": "admin",
    "status": "active",
    "lastActive": "2026-06-22T10:00:00.000Z"
  }
}
```
