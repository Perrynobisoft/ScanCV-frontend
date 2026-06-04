import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import LoginPage from '@/presentation/features/auth/login'

const login = vi.fn()
const invalidate = vi.fn()
const push = vi.fn()
const navigate = vi.fn()
const useLoginMock = vi.fn()

vi.mock('@/presentation/hooks/auth/useLogin', () => ({
  useLogin: () => useLoginMock(),
}))

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>(
    '@tanstack/react-router',
  )

  return {
    ...actual,
    useRouter: () => ({
      invalidate,
      history: { push },
      navigate,
    }),
    useSearch: () => ({}),
  }
})

describe('LoginPage', () => {
  beforeEach(() => {
    login.mockReset()
    invalidate.mockReset()
    push.mockReset()
    navigate.mockReset()
    useLoginMock.mockReturnValue({
      login,
      isPending: false,
    })
  })

  it('renders the form and submits current credentials', () => {
    login.mockResolvedValue({
      user: { id: 1, email: 'test@test.com' },
    })

    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'new@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'super-secret' },
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Sign in' }))

    expect(login).toHaveBeenCalledWith({
      email: 'new@test.com',
      password: 'super-secret',
    })
  })

  it('disables submit while pending', () => {
    useLoginMock.mockReturnValue({
      login,
      isPending: true,
    })

    render(<LoginPage />)

    expect(
      (
        screen.getByRole('button', {
          name: 'Signing in...',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true)
  })
})
