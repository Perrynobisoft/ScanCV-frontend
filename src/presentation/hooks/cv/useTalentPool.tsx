import { useEffect, useState } from 'react'
import { useRepository } from '@/di/RepositoriesProvider'
import { type PaginatedData } from '@/application/dto/response/PaginatedResponse'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

export const useTalentPool = () => {
  const { cvRepository } = useRepository()
  const [page, setPage] = useState(DEFAULT_PAGE)
  const [limit] = useState(DEFAULT_LIMIT)

  const mutation = cvRepository.getTalentPool()
  const { mutateAsync } = mutation

  useEffect(() => {
    void mutateAsync({ page, limit })
  }, [mutateAsync, page, limit])

  const normalizeResponse = (
    response:
      | PaginatedData<unknown>
      | { data?: PaginatedData<unknown> }
      | undefined,
  ): PaginatedData<unknown> | undefined => {
    if (!response) return undefined
    if ('data' in response && response.data) return response.data
    return response as PaginatedData<unknown>
  }

  const listResponse = normalizeResponse(mutation.data)
  const items = listResponse?.items ?? []
  const total = listResponse?.meta?.total ?? 0
  const totalPages =
    listResponse?.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit))

  return {
    page,
    setPage,
    items,
    total,
    totalPages,
    isLoading: mutation.status === 'pending',
    refetch: () => void mutateAsync({ page, limit }),
  }
}
