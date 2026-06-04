import { useRepository } from '@/di/RepositoriesProvider'
import { type ConfirmEmailRequest } from '@/domain/models/Auth'

export const useConfirmEmail = () => {
  const { authRepository } = useRepository()
  const { mutate: confirmEmail, ...rest } = authRepository.confirmEmail()

  return {
    confirmEmail: (
      credentials: ConfirmEmailRequest,
      onSuccess?: () => void,
    ) => {
      confirmEmail(credentials, {
        onSuccess: () => {
          onSuccess?.()
        },
        onError: (_error: any) => {},
      })
    },
    ...rest,
  }
}
