# User Management API

Base URL

/api/v1

---

## 1. Get Users

### Endpoint

GET /users?page=1&pageSize=10&role=&status=

### Authorization

Bearer Token (Admin)

### Query Parameters

| Name   | Type   | Required | Description                   |
| ------ | ------ | -------- | ----------------------------- |
| page   | int    | No       | Current page                  |
| limit  | int    | No       | Number of items per page      |
| role   | string | No       | Admin, Recruiter, Interviewer |
| status | string | No       | Active, Inactive              |

### Response 200

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "items": [
      {
        "id": "user-001",
        "fullName": "Nguyen Van Admin",
        "email": "admin@company.com",
        "role": "Admin",
        "status": "Active",
        "lastActive": "2026-06-12T15:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "totalItems": 50,
      "totalPages": 5
    }
  }
}
```

---

## 2. Create User

### Endpoint

POST /users

### Request Body

```json
{
  "fullName": "Nguyen Van A",
  "email": "example@company.com",
  "password": "123456",
  "confirmPassword": "123456",
  "role": "Recruiter"
}
```

### Response 201

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "user-002"
  }
}
```

### Response 400

```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

## 3. Update User

### Endpoint

PATCH /users/{id}

### Description

Cập nhật thông tin user. Tất cả các field đều optional — chỉ gửi những field cần thay đổi.

### Request Body

```json
{
  "fullName": "Nguyen Van B",
  "role": "Interviewer",
  "status": "Inactive"
}
```

| Field    | Type   | Required | Description                   |
| -------- | ------ | -------- | ----------------------------- |
| fullName | string | No       | Tên đầy đủ của user           |
| role     | string | No       | Admin, Recruiter, Interviewer |
| status   | string | No       | Active, Inactive              |

### Response 200

```json
{
  "success": true,
  "message": "User updated successfully"
}
```

### Response 404

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## 4. Delete User

### Endpoint

DELETE /users/{id}

### Response 200

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Response 404

```json
{
  "success": false,
  "message": "User not found"
}
```
