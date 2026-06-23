import type { LoginResponse, RefreshTokenResponse } from '@/domain/models/Auth'
import { Constants } from './constants'

// accessToken lưu vào JS-accessible cookie (không thể HttpOnly vì JS set).
// refreshToken được backend set qua Set-Cookie HttpOnly — JS không lưu, không đọc được.
type AccessTokenPayload = Pick<
  LoginResponse | RefreshTokenResponse,
  'accessToken' | 'accessTokenExpiresAt'
>

// ─── Cookie helpers ───────────────────────────────────────────────────────────

// Thêm Secure flag khi chạy trên HTTPS (production).
const isSecureContext = location.protocol === 'https:'

const setCookie = (name: string, value: string, expiresAt: string) => {
  if (typeof document === 'undefined') return
  const expires = new Date(expiresAt).toUTCString()
  const secure = isSecureContext ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict${secure}`
}

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}

const removeCookie = (name: string) => {
  if (typeof document === 'undefined') return
  const secure = isSecureContext ? '; Secure' : ''
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict${secure}`
}

// ─── Token persistence ────────────────────────────────────────────────────────

// Chỉ lưu accessToken. refreshToken do backend quản lý qua HttpOnly cookie.
export const persistAuthTokens = (payload: AccessTokenPayload) => {
  setCookie(
    Constants.API_TOKEN_STORAGE,
    payload.accessToken,
    payload.accessTokenExpiresAt,
  )
}

export const clearAuthStorage = () => {
  removeCookie(Constants.API_TOKEN_STORAGE)
  // refreshToken (HttpOnly) được xóa bởi backend khi gọi /auth/logout
}

export const clearStoredAccessToken = () => {
  removeCookie(Constants.API_TOKEN_STORAGE)
}

export const getStoredAccessToken = (): string | null => {
  return getCookie(Constants.API_TOKEN_STORAGE)
}

export const hasStoredAccessToken = () => {
  return !!getStoredAccessToken()
}

export const getUserIdFromToken = (): number | null => {
  const token = getStoredAccessToken()
  if (!token) return null
  try {
    const base64 = token.split('.')[1]
    const decoded = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(decoded) as Record<string, unknown>
    const id = payload.sub ?? payload.id ?? payload.userId
    return id ? Number(id) : null
  } catch {
    return null
  }
}
