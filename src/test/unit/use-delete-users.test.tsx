import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useDeleteUsers } from '@/presentation/hooks/users/useDeleteUsers'

const deleteRepositoryMock = vi.fn()
const mutateMock = vi.fn()

vi.mock('@/di/RepositoriesProvider', () => ({
  useRepository: () => ({
    usersRepository: {
      delete: deleteRepositoryMock,
    },
  }),
}))

describe('useDeleteUsers', () => {
  beforeEach(() => {
    mutateMock.mockReset()
    deleteRepositoryMock.mockReset()
    deleteRepositoryMock.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    })
  })

  it('creates the delete mutation at hook initialization and forwards params on remove', () => {
    const onSuccess = vi.fn()
    const { result } = renderHook(() => useDeleteUsers())

    expect(deleteRepositoryMock).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.remove({ id: 7 }, onSuccess)
    })

    expect(mutateMock).toHaveBeenCalledWith(
      { id: 7 },
      expect.objectContaining({
        onError: expect.any(Function),
        onSuccess: expect.any(Function),
      }),
    )
  })
})
