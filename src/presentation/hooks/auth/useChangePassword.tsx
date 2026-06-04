import { useRepository } from '@/di/RepositoriesProvider'
import { type ChangePasswordRequest } from '@/domain/models/Auth'
import { useAuth } from '@/presentation/provider/auth/auth-provider'
import { useRouter } from '@tanstack/react-router'

export const useChangePassword = () => {
  const router = useRouter()
  const auth = useAuth()
  const { authRepository } = useRepository()
  const { mutate: changePassword, ...rest } = authRepository.changePassword()

  return {
    changePassword: (requestData: ChangePasswordRequest) => {
      changePassword(requestData, {
        onSuccess: () => {
          auth.clearAuth()
          router.navigate({ to: '/' }) // Redirect sau khi login
        },
      })
    },
    ...rest,
  }
}
