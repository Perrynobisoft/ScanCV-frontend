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

export interface LoginWithGoogleRequest {
  idToken: string
}

export interface LoginWithFacebookRequest {
  accessToken: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
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
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface RegisterResponse {
  userId: number
}

export interface ConfirmEmailRequest {
  hash: string
}

export interface ConfirmEmailResponse {
  message: string
}

export interface UpdateMeRequest {
  firstName?: string
  lastName?: string
  password?: string
  oldPassword?: string
}
