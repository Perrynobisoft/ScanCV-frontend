import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useMe } from '@/presentation/hooks/auth/useMe'
import { createQueryClientWrapper } from '@/test/query-client'
import { RepositoryProvider } from '@/di/RepositoriesProvider'
import type { ReactNode } from 'react'

// useMe now calls GET /auth/me directly — only hasStoredAccessToken needs mocking
// so the auth-provider doesn't short-circuit the query
vi.mock('@/shared/auth-storage', async () => {
  const actual = await vi.importActual<typeof import('@/shared/auth-storage')>(
    '@/shared/auth-storage',
  )
  return {
    ...actual,
    getStoredAccessToken: () => 'mock-access-token',
    hasStoredAccessToken: () => true,
  }
})

const createWrapper = () => {
  const QueryWrapper = createQueryClientWrapper()
  return ({ children }: { children: ReactNode }) => (
    <QueryWrapper>
      <RepositoryProvider>{children}</RepositoryProvider>
    </QueryWrapper>
  )
}

describe('useMe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the authenticated user from GET /auth/me', async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useMe(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Matches the /auth/me MSW handler response shape: { data: User }
    expect(result.current.result).toMatchObject({
      id: 1,
      email: 'test@test.com',
      fullName: 'Test User',
    })
  })
})
