import { useRepository } from '@/di/RepositoriesProvider'
import { Endpoints } from '@/shared/endpoints'
import type { QueryOptions } from '@/shared/types/react-query'
import type { ResponseCommon } from '@/application/dto/response/ResponseCommon'
import type { User } from '@/domain/models/Auth'

export const useMe = (options?: QueryOptions<ResponseCommon<User>>) => {
  const { authRepository } = useRepository()

  const query = authRepository.me(options)

  return {
    data: query.data,
    error: query.error,
    isError: query.isError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
    // response shape: { data: User }
    result: (query.data as ResponseCommon<User> | undefined)?.data ?? null,
    queryKey: [Endpoints.Auth.ME],
  }
}
