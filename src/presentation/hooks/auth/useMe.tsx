import HttpClient from '@/infrastructure/http/HttpClient'
import { Endpoints } from '@/shared/endpoints'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { User } from '@/domain/models/Auth'
import type { ResponseCommon } from '@/application/dto/response/ResponseCommon'

export const getMeQueryOptions = () => {
  return queryOptions({
    queryKey: [Endpoints.Auth.ME],
    queryFn: async () => {
      const response = await HttpClient.getAxiosInstance().get<
        ResponseCommon<User>
      >(Endpoints.Auth.ME)
      return response.data
    },
    retry: false,
  })
}

export const useMe = (
  options?: Partial<ReturnType<typeof getMeQueryOptions>>,
) => {
  const query = useQuery({
    ...getMeQueryOptions(),
    ...options,
  })

  return {
    data: query.data,
    error: query.error,
    isError: query.isError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
    result: query.data?.data ?? null,
  }
}
