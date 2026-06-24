import { useEffect, useState } from 'react'
import { useRepository } from '@/di/RepositoriesProvider'
import { type PaginatedData } from '@/application/dto/response/PaginatedResponse'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

export const useSearchCv = <T = unknown,>() => {
  const { cvRepository } = useRepository()
  const [searchValue, setSearchValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(DEFAULT_PAGE)
  const [limit] = useState(DEFAULT_LIMIT)

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
      | { data?: PaginatedData<unknown> | unknown[] }
      | undefined,
  ): PaginatedData<unknown> | undefined => {
    if (!response) return undefined

    // Handle nested data structure: { data: ... }
    if ('data' in response && response.data) {
      const data = response.data

      // If data is an array, wrap it in PaginatedData structure
      if (Array.isArray(data)) {
        return {
          items: data,
          meta: {
            total: data.length,
            page: 1,
            limit: data.length,
          },
        }
      }

      // If data has items and meta, it's already PaginatedData
      if ('items' in data && 'meta' in data) {
        return data as PaginatedData<unknown>
      }
    }

    // Handle direct PaginatedData structure: { items, meta }
    if ('items' in response && 'meta' in response) {
      return response as PaginatedData<unknown>
    }

    // Handle direct array (unlikely but just in case)
    if (Array.isArray(response)) {
      return {
        items: response,
        meta: {
          total: response.length,
          page: 1,
          limit: response.length,
        },
      }
    }

    return undefined
  }

  const searchResponse = normalizeSearchResponse(searchMutation.data)
  const items = (searchResponse?.items as T[]) ?? []
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
