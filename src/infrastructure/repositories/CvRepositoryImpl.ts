import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'
import { type PaginatedResponse } from '@/application/dto/response/PaginatedResponse'
import {
  type CvItem,
  type CreateCvRequest,
  type SearchCvRequest,
  type UpdateCvRequest,
} from '@/domain/models/Cv'
import { type DeleteCommonParams } from '@/domain/models/common/CommonParams'
import {
  useDeleteApi,
  useGetApi,
  usePostApi,
  usePutApi,
} from '@/infrastructure/hooks/useApi'
import { Endpoints } from '@/shared/endpoints'
import { type CvRepository } from '@/application/repositories/CvRepository'

const normalizeQueryParams = (
  params?: any,
): Record<string, string | number | boolean | undefined> =>
  Object.fromEntries(
    Object.entries(params || {}).map(([k, v]) => [
      k,
      v !== null && typeof v === 'object' ? JSON.stringify(v) : (v as any),
    ]),
  )

export const CvRepositoryImpl = (): CvRepository => ({
  search: (params) =>
    usePostApi<SearchCvRequest, PaginatedResponse<CvItem>>({
      endpoint: Endpoints.Cv.SEARCH,
      queryParams: normalizeQueryParams(params),
    }),
  getAll: (_params, options) =>
    usePostApi<
      import('@/domain/models/Cv').GetAllCvRequest,
      PaginatedResponse<CvItem>
    >({
      endpoint: Endpoints.Cv.GET_ALL,
      queryParams: normalizeQueryParams(_params),
      options,
    }),
  getById: (params, options) =>
    useGetApi<ResponseCommon<CvItem>>({
      endpoint: Endpoints.Cv.GET,
      queryParams: normalizeQueryParams(params),
      options,
    }),
  create: () =>
    usePostApi<CreateCvRequest, ResponseCommon<CvItem>>({
      endpoint: Endpoints.Cv.CREATE,
    }),
  update: () =>
    usePutApi<UpdateCvRequest, ResponseCommon<CvItem>>({
      endpoint: Endpoints.Cv.UPDATE,
    }),
  delete: () =>
    useDeleteApi<DeleteCommonParams, ResponseCommon<boolean>>({
      endpoint: Endpoints.Cv.DELETE,
      buildQueryParams: (params) => normalizeQueryParams(params),
    }),
})
