import { useRepository } from '@/di/RepositoriesProvider'
import { useAuth } from '@/presentation/provider/auth/auth-provider'

export const useLogout = () => {
  const auth = useAuth()
  const { authRepository } = useRepository()
  const { mutate: logout, ...rest } = authRepository.logout()

  return {
    logout: (onSettled?: () => void) => {
      logout(
        {},
        {
          onSettled: () => {
            auth.clearAuth()
            onSettled?.()
          },
        },
      )
    },
    ...rest,
  }
}
