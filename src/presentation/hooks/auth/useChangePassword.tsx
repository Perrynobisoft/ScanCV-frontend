import { useRepository } from '@/di/RepositoriesProvider'
import { type ChangePasswordRequest } from '@/domain/models/Auth'
import { useRouter } from '@tanstack/react-router'
import { useLogout } from './useLogout'

export const useChangePassword = () => {
  const router = useRouter()
  const { logout } = useLogout()
  const { authRepository } = useRepository()
  const { mutate: changePassword, ...rest } = authRepository.changePassword()

  return {
    changePassword: (requestData: ChangePasswordRequest) => {
      changePassword(requestData, {
        onSuccess: () => {
          logout()
          router.navigate({ to: '/' }) // Redirect sau khi đổi mật khẩu
        },
      })
    },
    ...rest,
  }
}
