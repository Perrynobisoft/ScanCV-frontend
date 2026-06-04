import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'
import { useRepository } from '@/di/RepositoriesProvider'
import { type UpdateUsersRequest, type Users } from '@/domain/models/Users'

export const useUpdateUsers = () => {
  const { usersRepository } = useRepository()
  const { mutate: update, ...rest } = usersRepository.update()

  return {
    update: (requestData: UpdateUsersRequest, onSuccess?: () => void) => {
      update(requestData, {
        onSuccess: (_data: ResponseCommon<Users>) => {
          onSuccess?.()
        },
        onError: (_error: any) => {},
      })
    },
    ...rest,
  }
}
