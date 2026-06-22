1. endpoint login
   đăng nhập lần đầu yêu cầu đổi mật khẩu
2. endpoint đổi mật khẩu

3. refress accesstoken

# Authentication API

## Response format

```ts
export interface ResponseCommon<T> {
  data: T
  message?: string
  success: boolean
  statusCode?: number
}
```

---

# 1. Login

## POST /api/v1/auth/login

### Request

```json
{
  "email": "admin@company.com",
  "password": "123456"
}
```

### Response - Đăng nhập thành công

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt-access-token>",
    "user": {
      "email": "admin@company.com",
      "full_name": "Nguyen Van Admin",
      "role": "admin"
    }
  }
}
```

### Response - Đăng nhập lần đầu, yêu cầu đổi mật khẩu

> Không cấp access token trước khi đổi mật khẩu.

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password change required",
  "data": {
    "requirePasswordChange": true,
    "changePasswordToken": "<temporary-token>"
  }
}
```

### Response - Sai tài khoản hoặc mật khẩu

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
Authorization: Bearer <changePasswordToken hoặc accesstoken>
```

### Request

```json
{
  "oldPassword": "Temp@123",
  "newPassword": "MySecure@123",
  "confirmPassword": "MySecure@123"
}
```

### Response

Sau khi đổi mật khẩu thành công, trả về token để người dùng không cần login lại.
refreshToken được trả về qua HTTP-only cookie (' refreshToken`). Body chứa thông tin user và metadata. Set-Cookie headers:

Set-Cookie: refreshToken=<jwt>; HttpOnly; Secure; SameSite=Strict;

```json
{
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt-access-token>",
    "user": {
        "email": "admin@company.com",
        "full_name": "Nguyen Van Admin",
        "role": "admin"
    }
  }
}
```

### Response - Sai mật khẩu cũ

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

## POST /api/v1/auth/refresh-token

### Request

refreshToken được lấy trong cookie ('refreshToken`)

### Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "<new-access-token>"
  }
}
```

### Response - Refresh token hết hạn

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Refresh token is invalid or expired",
  "data": null
}
```
