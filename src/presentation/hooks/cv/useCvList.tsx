import { useEffect, useState } from 'react'
import { useRepository } from '@/di/RepositoriesProvider'
import { type PaginatedData } from '@/application/dto/response/PaginatedResponse'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

export const useCvList = (
  searchQuery?: string,
  filter?: {
    experience?: string
    skills?: string
    position?: string
    style?: string
  },
) => {
  const { cvRepository } = useRepository()
  const [page, setPage] = useState(DEFAULT_PAGE)
  const [limit] = useState(DEFAULT_LIMIT)

  const listMutation = cvRepository.getAll()
  const { mutateAsync } = listMutation

  useEffect(() => {
    setPage(DEFAULT_PAGE)
  }, [
    searchQuery,
    filter?.experience,
    filter?.skills,
    filter?.position,
    filter?.style,
  ])

  const mapExperienceToYears = (exp?: string): number | undefined => {
    if (!exp || exp === 'All') return undefined
    if (exp === 'Under 1y') return 0
    if (exp === '1-3y') return 1
    if (exp === '3-5y') return 3
    if (exp === '5y+') return 5
    const parsed = parseInt(exp ?? '', 10)
    return Number.isNaN(parsed) ? undefined : parsed
  }

  useEffect(() => {
    void mutateAsync({
      page,
      limit,
      search: searchQuery ?? '',
      extensions: 'string',
      filter: {
        experience_years: mapExperienceToYears(filter?.experience),
        skills: filter?.skills ?? '',
        position: filter?.position ?? '',
        style: filter?.style ?? '',
      },
    })
  }, [
    mutateAsync,
    searchQuery,
    page,
    limit,
    filter?.experience,
    filter?.skills,
    filter?.position,
    filter?.style,
  ])

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

  const listResponse = normalizeListResponse(listMutation.data)
  const items = listResponse?.items ?? []
  const total = listResponse?.meta?.total ?? 0
  const totalPages =
    listResponse?.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit))
  const errorMessage =
    listMutation.error?.error?.message ||
    (listMutation.error as any)?.message ||
    null

  return {
    page,
    setPage,
    limit,
    items,
    total,
    totalPages,
    isLoading: listMutation.status === 'pending',
    errorMessage,
    searchQuery,
  }
}
