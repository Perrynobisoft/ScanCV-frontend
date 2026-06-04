import { useRepository } from '@/di/RepositoriesProvider'
import { type UpdateMeRequest } from '@/domain/models/Auth'

export const useUpdateMe = () => {
  const { authRepository } = useRepository()
  const { mutate: updateMe, ...rest } = authRepository.updateMe()

  return {
    updateMe: (
      requestData: UpdateMeRequest,
      onSuccess?: (_data: any) => void,
    ) => {
      updateMe(requestData, {
        onSuccess: (_data: any) => {
          onSuccess?.(_data)
        },
        onError: (_error: any) => {},
      })
    },
    ...rest,
  }
}
