import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'
import { type PaginatedResponse } from '@/application/dto/response/PaginatedResponse'
import {
  type CvItem,
  type GetAllCvRequest,
  type CreateCvRequest,
  type SearchCvRequest,
  type UpdateCvRequest,
} from '@/domain/models/Cv'
import {
  type DeleteCommonParams,
  type GetByIdCommonParams,
} from '@/domain/models/common/CommonParams'
import {
  type BulkUploadStatusResponse,
  type BulkUploadResponse,
} from '@/domain/models/BulkUpload'
import { type PaginationParams } from '@/domain/models/common/PaginationParams'
import {
  type useDeleteApi,
  type useGetApi,
  type usePostApi,
  type usePostFormApi,
  type usePutApi,
  type usePatchApi,
} from '@/infrastructure/hooks/useApi'
import { type QueryOptions } from '@/shared/types/react-query'

export interface MarkAsTalentRequest {
  id: number
  is_marked: boolean
}

export interface CvRepository {
  search: (
    params?: PaginationParams,
  ) => ReturnType<typeof usePostApi<SearchCvRequest, PaginatedResponse<CvItem>>>
  getAll: (
    params?: GetAllCvRequest,
    options?: QueryOptions<PaginatedResponse<CvItem>>,
  ) => ReturnType<typeof usePostApi<GetAllCvRequest, PaginatedResponse<CvItem>>>
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
  bulkUpload: () => ReturnType<
    typeof usePostFormApi<ResponseCommon<BulkUploadResponse>>
  >
  getBulkUploadStatus: (params: {
    batchId: string
  }) => ReturnType<typeof useGetApi<ResponseCommon<BulkUploadStatusResponse>>>
  cancelBulkUpload: () => ReturnType<
    typeof usePostApi<{ batchId: string }, ResponseCommon<unknown>>
  >
  getTalentPool: (
    params?: GetAllCvRequest,
    options?: QueryOptions<PaginatedResponse<CvItem>>,
  ) => ReturnType<typeof usePostApi<GetAllCvRequest, PaginatedResponse<CvItem>>>
  markAsTalent: () => ReturnType<
    typeof usePatchApi<MarkAsTalentRequest, ResponseCommon<CvItem>>
  >
}
