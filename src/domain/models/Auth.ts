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
  refreshToken: string
  refreshTokenExpiresAt: string
  user: User
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RefreshTokenResponse extends LoginResponse {}

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
