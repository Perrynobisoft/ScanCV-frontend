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

## Token Response Data

```ts
interface LoginResponse {
  accessToken: string
  accessTokenExpiresAt: string
  refreshToken: string
  refreshTokenExpiresAt: string
  user: User
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

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt-access-token>",
    "accessTokenExpiresAt": "2026-06-22T12:15:00.000Z",
    "refreshToken": "<jwt-refresh-token>",
    "refreshTokenExpiresAt": "2026-06-29T12:00:00.000Z",
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

> `refreshToken` được gửi qua cookie `refreshToken`.

### Response — Thành công

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
