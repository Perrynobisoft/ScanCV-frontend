import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useMe } from '@/presentation/hooks/auth/useMe'
import { createQueryClientWrapper } from '@/test/query-client'

describe('useMe', () => {
  it('returns the mocked authenticated user', async () => {
    const wrapper = createQueryClientWrapper()
    const { result } = renderHook(() => useMe(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.result).toMatchObject({
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
    })
  })
})
