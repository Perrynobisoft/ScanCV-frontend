import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'
import { useRepository } from '@/di/RepositoriesProvider'
import { type CreateUsersRequest, type Users } from '@/domain/models/Users'

export const useCreateUsers = () => {
  const { usersRepository } = useRepository()
  const { mutate: create, ...rest } = usersRepository.create()

  return {
    create: (requestData: CreateUsersRequest, onSuccess?: () => void) => {
      create(requestData, {
        onSuccess: (_data: ResponseCommon<Users>) => {
          onSuccess?.()
        },
        onError: (_error: any) => {},
      })
    },
    ...rest,
  }
}
