import type { LoginResponse, RefreshTokenResponse } from '@/domain/models/Auth'
import { Constants } from './constants'

type AuthTokenPayload = Pick<
  LoginResponse | RefreshTokenResponse,
  'token' | 'refreshToken'
>

const getStorageItem = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null

  const value = localStorage.getItem(key)
  if (!value) return null

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

const setStorageItem = (key: string, value: unknown) => {
  if (value == null) return
  localStorage.setItem(key, JSON.stringify(value))
}

const removeStorageItem = (key: string) => {
  localStorage.removeItem(key)
}

export const persistAuthTokens = (payload: AuthTokenPayload) => {
  setStorageItem(Constants.API_TOKEN_STORAGE, payload.token)
  setStorageItem(Constants.API_REFRESH_TOKEN_STORAGE, payload.refreshToken)
}

export const clearAuthStorage = () => {
  removeStorageItem(Constants.API_TOKEN_STORAGE)
  removeStorageItem(Constants.API_REFRESH_TOKEN_STORAGE)
  removeStorageItem(Constants.API_USER_STORAGE)
}

export const clearStoredAccessToken = () => {
  removeStorageItem(Constants.API_TOKEN_STORAGE)
}

export const getStoredAccessToken = () => {
  return getStorageItem<string>(Constants.API_TOKEN_STORAGE)
}

export const getStoredRefreshToken = () => {
  return getStorageItem<string>(Constants.API_REFRESH_TOKEN_STORAGE)
}

export const hasStoredAccessToken = () => {
  return !!getStoredAccessToken()
}
