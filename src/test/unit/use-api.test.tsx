import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useDeleteApi } from '@/infrastructure/hooks/useApi'
import { createQueryClientWrapper } from '@/test/query-client'

const deleteSpy = vi.fn()
const createAbortSignalSpy = vi.fn()

vi.mock('@/infrastructure/hooks/useAxios', () => ({
  default: () => ({
    axiosInstance: {
      delete: deleteSpy,
    },
    newAbortSignal: createAbortSignalSpy,
  }),
}))

describe('useDeleteApi', () => {
  beforeEach(() => {
    deleteSpy.mockReset()
    createAbortSignalSpy.mockReset()
    createAbortSignalSpy.mockReturnValue(new AbortController().signal)
    deleteSpy.mockResolvedValue({
      data: { success: true },
    })
  })

  it('passes payload-derived query params and request config to axios.delete', async () => {
    const wrapper = createQueryClientWrapper()
    const { result } = renderHook(
      () =>
        useDeleteApi<{ id: number }, { success: boolean }>({
          endpoint: '/users/delete',
          buildQueryParams: (payload) => ({ id: payload.id }),
        }),
      { wrapper },
    )

    await act(async () => {
      await result.current.mutateAsync({ id: 42 })
    })

    expect(deleteSpy).toHaveBeenCalledWith('/users/delete?id=42', {
      data: { id: 42 },
      headers: undefined,
      signal: expect.any(AbortSignal),
    })
  })
})
