import HttpClient from '@/infrastructure/http/HttpClient'
import { Endpoints } from '@/shared/endpoints'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { User, Role } from '@/domain/models/Auth'

export interface MeResponse {
  result: User & {
    role?: Role | null
  }
}

export const getMeQueryOptions = () =>
  queryOptions({
    queryKey: [Endpoints.Auth.ME],
    queryFn: async () => {
      const response = await HttpClient.getAxiosInstance().get<MeResponse>(
        Endpoints.Auth.ME,
      )

      return response.data
    },
    retry: false,
  })

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
    result: query.data?.result ?? null,
  }
}
