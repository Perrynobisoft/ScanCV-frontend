import { useEffect, useState } from 'react'
import { useRepository } from '@/di/RepositoriesProvider'
import { type PaginatedData } from '@/application/dto/response/PaginatedResponse'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

export const useCvList = (searchQuery?: string) => {
  const { cvRepository } = useRepository()
  const [page, setPage] = useState(DEFAULT_PAGE)
  const [limit] = useState(DEFAULT_LIMIT)

  const query = cvRepository.getAll(
    {
      page,
      limit,
      search: searchQuery || undefined,
    },
    { enabled: searchQuery !== undefined },
  )

  useEffect(() => {
    setPage(DEFAULT_PAGE)
  }, [searchQuery])

  const normalizeListResponse = (
    response:
      | PaginatedData<unknown>
      | { data?: PaginatedData<unknown> }
      | undefined,
  ): PaginatedData<unknown> | undefined => {
    if (!response) return undefined
    if ('data' in response && response.data) return response.data
    return response as PaginatedData<unknown>
  }

  const listResponse = normalizeListResponse(query.data)
  const items = listResponse?.items ?? []
  const total = listResponse?.meta?.total ?? 0
  const totalPages =
    listResponse?.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit))
  const errorMessage =
    query.error?.error?.message || (query.error as any)?.message || null

  return {
    page,
    setPage,
    limit,
    items,
    total,
    totalPages,
    isLoading: query.isLoading,
    errorMessage,
    searchQuery,
  }
}
