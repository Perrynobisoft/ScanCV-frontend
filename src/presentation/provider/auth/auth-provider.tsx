import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useContext,
  useState,
} from 'react'
import type { User } from '@/domain/models/Auth'
import { useQueryClient } from '@tanstack/react-query'
import {
  hasStoredAccessToken,
  getStoredUser,
  clearStoredUser,
} from '@/shared/auth-storage'
import { handleLogout as clearStoredAuth } from '@/shared/helpers'
import { useMe } from '@/presentation/hooks/auth/useMe'

export interface AuthContext {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  setAuthenticated: (user?: User | null) => void
  clearAuth: () => void
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  // Bước 1: Kiểm tra xem có accessToken trong cookie không.
  // Nếu không → chưa login, không cần làm gì thêm.
  const hasToken = hasStoredAccessToken()

  // Bước 2: Nếu có token, thử lấy user từ localStorage trước (nhanh, không cần network).
  const cachedUser = hasToken ? getStoredUser() : null

  const [isAuthenticated, setIsAuthenticated] = useState(hasToken)
  const [user, setUser] = useState<User | null>(cachedUser)

  // Bước 3: Chỉ gọi /auth/me khi đã có token nhưng chưa có user trong localStorage.
  // Nếu đã lấy được user từ localStorage thì skip luôn.
  const meQuery = useMe({
    enabled: isAuthenticated && !cachedUser,
    retry: false,
  })

  const setAuthenticated = useCallback((nextUser: User | null = null) => {
    setIsAuthenticated(true)
    setUser(nextUser)
  }, [])

  const clearAuth = useCallback(() => {
    clearStoredAuth(queryClient)
    clearStoredUser()
    setIsAuthenticated(false)
    setUser(null)
  }, [queryClient])

  // Nếu /auth/me trả lỗi (token hết hạn / invalid) → logout
  useEffect(() => {
    if (meQuery.isError && isAuthenticated) {
      clearAuth()
    }
  }, [clearAuth, isAuthenticated, meQuery.isError])

  // Khi /auth/me trả về user → cập nhật state
  useEffect(() => {
    if (meQuery.result) {
      setUser(meQuery.result)
    }
  }, [meQuery.result])

  const value = useMemo<AuthContext>(
    () => ({
      isAuthenticated,
      user,
      // isLoading = true chỉ khi đang fetch /auth/me (không có cache localStorage)
      isLoading: isAuthenticated && !user && meQuery.isFetching,
      setAuthenticated,
      clearAuth,
    }),
    [clearAuth, isAuthenticated, meQuery.isFetching, setAuthenticated, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
