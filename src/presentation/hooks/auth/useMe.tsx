import HttpClient from '@/infrastructure/http/HttpClient'
import { Endpoints } from '@/shared/endpoints'
import { buildUrl } from '@/shared/url'
import { getStoredAccessToken } from '@/shared/auth-storage'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { User } from '@/domain/models/Auth'
import type { ResponseCommon } from '@/application/dto/response/ResponseCommon'

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const base64 = token.split('.')[1]
    const decoded = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export const getUserIdFromToken = (): number | null => {
  const token = getStoredAccessToken()
  if (!token) return null
  const payload = decodeJwtPayload(token)
  if (!payload) return null
  // common JWT claims for user id: sub, id, userId
  const id = payload.sub ?? payload.id ?? payload.userId
  return id ? Number(id) : null
}

export const getMeQueryOptions = () => {
  const userId = getUserIdFromToken()
  return queryOptions({
    queryKey: [Endpoints.Users.GET, userId],
    queryFn: async () => {
      if (!userId) throw new Error('No user id in token')
      const url = buildUrl(Endpoints.Users.GET, { id: userId })
      const response =
        await HttpClient.getAxiosInstance().get<ResponseCommon<{ user: User }>>(
          url,
        )
      return response.data
    },
    enabled: !!userId,
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
    result: query.data?.data?.user ?? null,
  }
}
