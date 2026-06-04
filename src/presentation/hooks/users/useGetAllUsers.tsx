import { useRepository } from '@/di/RepositoriesProvider'
import { type PaginationParams } from '@/domain/models/common/PaginationParams'

export const useGetAllUsers = (
  params?: PaginationParams,
  enabled?: boolean,
) => {
  const { usersRepository } = useRepository()
  const query = usersRepository.getAll(params, { enabled })

  return {
    result: query.data,
    ...query,
  }
}
