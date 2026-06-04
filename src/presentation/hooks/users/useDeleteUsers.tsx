import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'
import { useRepository } from '@/di/RepositoriesProvider'
import { type DeleteCommonParams } from '@/domain/models/common/CommonParams'

export const useDeleteUsers = () => {
  const { usersRepository } = useRepository()
  const { mutate: remove, ...rest } = usersRepository.delete()
  return {
    remove: (params: DeleteCommonParams, onSuccess?: () => void) => {
      remove(params, {
        onSuccess: (_data: ResponseCommon<boolean>) => {
          onSuccess?.()
        },
        onError: (_error: any) => {},
      })
    },
    ...rest,
  }
}
