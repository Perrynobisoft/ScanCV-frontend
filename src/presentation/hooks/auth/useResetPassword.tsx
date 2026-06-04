import { useRepository } from '@/di/RepositoriesProvider'
import { type ResetPasswordRequest } from '@/domain/models/Auth'
import { useRouter } from '@tanstack/react-router'

export const useResetPassword = () => {
  const { authRepository } = useRepository()
  const router = useRouter()
  const { mutate: resetPasswordMutate, ...rest } =
    authRepository.resetPassword()

  return {
    resetPassword: (credentials: ResetPasswordRequest) => {
      resetPasswordMutate(credentials, {
        onSuccess: (_data) => {
          router.navigate({ to: '/auth/login' })
        },
        onError: (_error: any) => {},
      })
    },
    ...rest,
  }
}
