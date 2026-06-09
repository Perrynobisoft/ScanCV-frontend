import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'
import { type PaginatedResponse } from '@/application/dto/response/PaginatedResponse'
import {
  type CvItem,
  type CreateCvRequest,
  type SearchCvRequest,
  type UpdateCvRequest,
} from '@/domain/models/Cv'
import {
  type DeleteCommonParams,
  type GetByIdCommonParams,
} from '@/domain/models/common/CommonParams'
import { type PaginationParams } from '@/domain/models/common/PaginationParams'
import {
  type useDeleteApi,
  type useGetApi,
  type usePostApi,
  type usePutApi,
} from '@/infrastructure/hooks/useApi'
import { type QueryOptions } from '@/shared/types/react-query'

export interface CvRepository {
  search: (
    params?: PaginationParams,
  ) => ReturnType<typeof usePostApi<SearchCvRequest, PaginatedResponse<CvItem>>>
  getAll: (
    params?: PaginationParams,
    options?: QueryOptions<PaginatedResponse<CvItem>>,
  ) => ReturnType<typeof useGetApi<PaginatedResponse<CvItem>>>
  getById: (
    params: GetByIdCommonParams,
    options?: QueryOptions<ResponseCommon<CvItem>>,
  ) => ReturnType<typeof useGetApi<ResponseCommon<CvItem>>>
  create: () => ReturnType<
    typeof usePostApi<CreateCvRequest, ResponseCommon<CvItem>>
  >
  update: () => ReturnType<
    typeof usePutApi<UpdateCvRequest, ResponseCommon<CvItem>>
  >
  delete: () => ReturnType<
    typeof useDeleteApi<DeleteCommonParams, ResponseCommon<boolean>>
  >
}
