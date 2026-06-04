import { useRepository } from '@/di/RepositoriesProvider'
import { type RegisterRequest } from '@/domain/models/Auth'
import { useRouter } from '@tanstack/react-router'

export const useRegister = () => {
  const router = useRouter()
  const { authRepository } = useRepository()
  const { mutate: register, ...rest } = authRepository.register()

  return {
    register: (credentials: RegisterRequest) => {
      register(credentials, {
        onSuccess: () => {
          router.navigate({ to: '/' })
        },
        onError: (_error: any) => {},
      })
    },
    ...rest,
  }
}
