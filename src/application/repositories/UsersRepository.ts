import {
  type Users,
  type CreateUsersRequest,
  type UpdateUsersRequest,
} from '@/domain/models/Users'
import {
  type DeleteCommonParams,
  type GetByIdCommonParams,
} from '@/domain/models/common/CommonParams'
import {
  type useDeleteApi,
  type useGetApi,
  type usePostApi,
  type usePutApi,
} from '@/infrastructure/hooks/useApi'
import { type QueryOptions } from '@shared/types/react-query'
import { type ResponseCommon } from '@application/dto/response/ResponseCommon'
import type { PaginationParams } from '@domain/models/common/PaginationParams'

export interface UsersRepository {
  getAll: (
    params?: PaginationParams,
    options?: QueryOptions<ResponseCommon<Users[]>>,
  ) => ReturnType<typeof useGetApi<ResponseCommon<Users[]>>>
  getById: (
    params: GetByIdCommonParams,
    options?: QueryOptions<ResponseCommon<Users>>,
  ) => ReturnType<typeof useGetApi>
  create: () => ReturnType<
    typeof usePostApi<CreateUsersRequest, ResponseCommon<Users>>
  >
  update: () => ReturnType<
    typeof usePutApi<UpdateUsersRequest, ResponseCommon<Users>>
  >
  delete: () => ReturnType<
    typeof useDeleteApi<DeleteCommonParams, ResponseCommon<boolean>>
  >
}
