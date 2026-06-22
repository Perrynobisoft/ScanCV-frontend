import type { LoginResponse, RefreshTokenResponse } from '@/domain/models/Auth'
import { Constants } from './constants'

type AuthTokenPayload = Pick<
  LoginResponse | RefreshTokenResponse,
  | 'accessToken'
  | 'accessTokenExpiresAt'
  | 'refreshToken'
  | 'refreshTokenExpiresAt'
>

// ─── Cookie helpers ───────────────────────────────────────────────────────────

const setCookie = (name: string, value: string, expiresAt: string) => {
  if (typeof document === 'undefined') return
  const expires = new Date(expiresAt).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`
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
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`
}

// ─── Token persistence ────────────────────────────────────────────────────────

export const persistAuthTokens = (payload: AuthTokenPayload) => {
  setCookie(
    Constants.API_TOKEN_STORAGE,
    payload.accessToken,
    payload.accessTokenExpiresAt,
  )
  setCookie(
    Constants.API_REFRESH_TOKEN_STORAGE,
    payload.refreshToken,
    payload.refreshTokenExpiresAt,
  )
}

export const clearAuthStorage = () => {
  removeCookie(Constants.API_TOKEN_STORAGE)
  removeCookie(Constants.API_REFRESH_TOKEN_STORAGE)
}

export const clearStoredAccessToken = () => {
  removeCookie(Constants.API_TOKEN_STORAGE)
}

export const getStoredAccessToken = (): string | null => {
  return getCookie(Constants.API_TOKEN_STORAGE)
}

export const getStoredRefreshToken = (): string | null => {
  return getCookie(Constants.API_REFRESH_TOKEN_STORAGE)
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
