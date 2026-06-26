import { useMemo, useState, useEffect } from 'react'
import { usePostQuery } from '@/infrastructure/hooks/useApi'
import { type GetAllCvRequest } from '@/domain/models/Cv'
import {
  type PaginatedData,
  type PaginatedResponse,
} from '@/application/dto/response/PaginatedResponse'
import { Endpoints } from '@/shared/endpoints'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

const mapExperienceToYears = (exp?: string): number | undefined => {
  if (!exp || exp === 'All') return undefined
  if (exp === 'Under 1y') return 0
  if (exp === '1-3y') return 1
  if (exp === '3-5y') return 3
  if (exp === '5y+') return 5
  const parsed = parseInt(exp ?? '', 10)
  return Number.isNaN(parsed) ? undefined : parsed
}

export const useCvList = (
  searchQuery?: string,
  filter?: {
    experience?: string
    skills?: string
    position?: string
    location?: string
    work_type?: string
  },
) => {
  const [page, setPage] = useState(DEFAULT_PAGE)
  const [limit] = useState(DEFAULT_LIMIT)

  // Reset to page 1 whenever search query or any filter changes
  useEffect(() => {
    setPage(DEFAULT_PAGE)
  }, [
    searchQuery,
    filter?.experience,
    filter?.skills,
    filter?.position,
    filter?.location,
    filter?.work_type,
  ])

  // Build query payload with memoization
  const queryPayload = useMemo<GetAllCvRequest>(
    () => ({
      page,
      limit,
      search: searchQuery ?? '',
      extensions: 'string',
      filter: {
        total_experience_years: mapExperienceToYears(filter?.experience),
        skills: filter?.skills ?? '',
        position: filter?.position ?? '',
        location: filter?.location ?? '',
        work_type: filter?.work_type ?? '',
      },
    }),
    [
      page,
      limit,
      searchQuery,
      filter?.experience,
      filter?.skills,
      filter?.position,
      filter?.location,
      filter?.work_type,
    ],
  )

  // Use usePostQuery for proper caching with TanStack Query
  // Query key includes payload to automatically refetch when params change
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error: queryError,
    refetch,
  } = usePostQuery<GetAllCvRequest, PaginatedResponse<any>>({
    endpoint: Endpoints.Cv.GET_ALL,
    payload: queryPayload,
  })

  // Normalize response - handle both wrapped and unwrapped response structures
  const normalizedData = useMemo<PaginatedData<any> | undefined>(() => {
    if (!response) return undefined

    // If response has 'data' property containing items, it's wrapped
    if (
      'data' in response &&
      response.data != null &&
      'items' in (response.data as any)
    ) {
      return response.data
    }

    // Otherwise assume it's the direct PaginatedData structure
    if ('items' in response && 'meta' in response) {
      return response as unknown as PaginatedData<any>
    }

    return undefined
  }, [response])

  const items = normalizedData?.items ?? []
  const total = normalizedData?.meta?.total ?? 0
  const totalPages =
    normalizedData?.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit))

  const errorMessage = useMemo(() => {
    if (!queryError) return null
    return (
      (queryError as any)?.error?.message ||
      (queryError as any)?.message ||
      null
    )
  }, [queryError])

  return {
    page,
    setPage,
    limit,
    items,
    total,
    totalPages,
    isLoading,
    isFetching,
    isError,
    errorMessage,
    searchQuery,
    refetch,
  }
}
