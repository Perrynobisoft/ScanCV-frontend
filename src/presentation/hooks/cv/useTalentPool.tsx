import { useMemo, useState } from 'react'
import { usePostQuery } from '@/infrastructure/hooks/useApi'
import { type GetAllCvRequest } from '@/domain/models/Cv'
import {
  type PaginatedData,
  type PaginatedResponse,
} from '@/application/dto/response/PaginatedResponse'
import { Endpoints } from '@/shared/endpoints'
import { Constants } from '@/shared/constants'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = Constants.PaginationConfigs.TalentPoolSize

export const useTalentPool = () => {
  const [page, setPage] = useState(DEFAULT_PAGE)
  const [limit] = useState(DEFAULT_LIMIT)

  const queryPayload = useMemo<GetAllCvRequest>(
    () => ({ page, limit }),
    [page, limit],
  )

  const {
    data: response,
    isLoading,
    refetch,
  } = usePostQuery<GetAllCvRequest, PaginatedResponse<any>>({
    endpoint: Endpoints.Cv.GET_TALENT_POOL,
    payload: queryPayload,
  })

  const normalizedData = useMemo<PaginatedData<any> | undefined>(() => {
    if (!response) return undefined
    if ('data' in response && response.data) return response.data
    if ('items' in response && 'meta' in response)
      return response as unknown as PaginatedData<any>
    return undefined
  }, [response])

  const items = normalizedData?.items ?? []
  const total = normalizedData?.meta?.total ?? 0
  const totalPages =
    normalizedData?.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit))

  return {
    page,
    setPage,
    limit,
    items,
    total,
    totalPages,
    isLoading,
    refetch,
  }
}
