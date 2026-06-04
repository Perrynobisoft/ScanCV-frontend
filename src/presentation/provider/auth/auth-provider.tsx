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
import { hasStoredAccessToken } from '@/shared/auth-storage'
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
  const [isAuthenticated, setIsAuthenticated] = useState(hasStoredAccessToken())
  const [user, setUser] = useState<User | null>(null)
  const meQuery = useMe({
    enabled: isAuthenticated,
    retry: false,
  })

  const setAuthenticated = useCallback((nextUser: User | null = null) => {
    setIsAuthenticated(true)
    setUser(nextUser)
  }, [])

  const clearAuth = useCallback(() => {
    clearStoredAuth(queryClient)
    setIsAuthenticated(false)
    setUser(null)
  }, [queryClient])

  useEffect(() => {
    if (meQuery.isError && isAuthenticated) {
      clearAuth()
    }
  }, [clearAuth, isAuthenticated, meQuery.isError])

  useEffect(() => {
    if (meQuery.result) {
      setUser(meQuery.result)
    }
  }, [meQuery.result])

  const value = useMemo<AuthContext>(
    () => ({
      isAuthenticated,
      user,
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
