export interface User {
  id: number
  email: string
  fullName: string
  role: string
  status: string
  lastActive: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  accessTokenExpiresAt: string
  // refreshToken không có trong response body.
  // Backend set qua Set-Cookie: HttpOnly; Secure; Path=/api/v1/auth/refresh
  user: User
}

export interface RefreshTokenResponse {
  accessToken: string
  accessTokenExpiresAt: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ResetPasswordRequest {
  hash: string
  password: string
}
export interface ForgotPasswordRequest {
  email: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  role: string
}

export interface RegisterResponse {
  userId: number
}
