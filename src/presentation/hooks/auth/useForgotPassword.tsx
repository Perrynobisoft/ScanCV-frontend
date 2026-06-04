import { useRepository } from '@/di/RepositoriesProvider'
import { type ForgotPasswordRequest } from '@/domain/models/Auth'
import { useRouter } from '@tanstack/react-router'

export const useForgotPassword = () => {
  const { authRepository } = useRepository()
  const router = useRouter()
  const { mutate: forgotPasswordMutate, ...rest } =
    authRepository.forgotPassword()

  return {
    forgotPassword: (request: ForgotPasswordRequest) => {
      forgotPasswordMutate(request, {
        onSuccess: () => {
          router.navigate({ to: '/' })
        },
        onError: (_error: any) => {},
      })
    },
    ...rest,
  }
}
