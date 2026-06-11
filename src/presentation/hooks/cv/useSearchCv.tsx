import { useEffect, useState } from 'react'
import { useRepository } from '@/di/RepositoriesProvider'
import { type PaginatedData } from '@/application/dto/response/PaginatedResponse'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

export const useSearchCv = () => {
  const { cvRepository } = useRepository()
  const [searchValue, setSearchValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(DEFAULT_PAGE)
  const [limit] = useState(DEFAULT_LIMIT)

  // POST search: do not send search text as query param. We'll send
  // { query, page, limit } in the POST body when mutating.
  const searchMutation = cvRepository.search()
  const { mutateAsync } = searchMutation

  useEffect(() => {
    if (!searchQuery) return
    if (page === DEFAULT_PAGE) return
    void mutateAsync({ query: searchQuery, page, limit })
  }, [searchQuery, page, limit, mutateAsync])

  const handleSearch = (query?: string) => {
    const value = query ?? searchValue
    setPage(DEFAULT_PAGE)
    setSearchQuery(value)
    void mutateAsync({ query: value, page: DEFAULT_PAGE, limit })
  }

  const normalizeSearchResponse = (
    response:
      | PaginatedData<unknown>
      | { data?: PaginatedData<unknown> }
      | undefined,
  ): PaginatedData<unknown> | undefined => {
    if (!response) return undefined
    if ('data' in response && response.data) return response.data
    return response as PaginatedData<unknown>
  }

  const searchResponse = normalizeSearchResponse(searchMutation.data)
  const items = searchResponse?.items ?? []
  const total = searchResponse?.meta?.total ?? 0
  const totalPages =
    searchResponse?.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit))
  const errorMessage =
    searchMutation.error?.error?.message ||
    (searchMutation.error as any)?.message ||
    null

  return {
    searchValue,
    setSearchValue,
    handleSearch,
    page,
    setPage,
    limit,
    items,
    total,
    totalPages,
    isLoading: searchMutation.status === 'pending',
    errorMessage,
    hasSearched: Boolean(searchQuery),
  }
}
