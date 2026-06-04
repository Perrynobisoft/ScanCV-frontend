import { useRepository } from '@/di/RepositoriesProvider'
import { type GetByIdCommonParams } from '@/domain/models/common/CommonParams'

export const useGetUsersById = (
  params: GetByIdCommonParams,
  enabled?: boolean,
) => {
  const { usersRepository } = useRepository()
  const query = usersRepository.getById(params, { enabled })

  return {
    result: query.data,
    ...query,
  }
}
