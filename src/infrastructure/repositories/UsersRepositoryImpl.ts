import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'
import { type PaginatedResponse } from '@/application/dto/response/PaginatedResponse'
import { type UsersRepository } from '@/application/repositories/UsersRepository'
import {
  type Users,
  type CreateUsersRequest,
  type UpdateUsersRequest,
} from '@/domain/models/Users'
import {
  type DeleteCommonParams,
  type GetByIdCommonParams,
} from '@/domain/models/common/CommonParams'
import { type PaginationParams } from '@/domain/models/common/PaginationParams'
import {
  useDeleteApi,
  useGetApi,
  usePostApi,
  usePatchApi,
} from '@/infrastructure/hooks/useApi'
import { Endpoints } from '@/shared/endpoints'
import { type QueryOptions } from '@/shared/types/react-query'

export const UsersRepositoryImpl = (): UsersRepository => ({
  getAll: (
    params?: PaginationParams,
    options?: QueryOptions<PaginatedResponse<Users>>,
  ) => {
    return useGetApi<PaginatedResponse<Users>>({
      endpoint: Endpoints.Users.GET_ALL,
      queryParams: {
        ...(params || {}),
      },
      options,
    })
  },
  getById: (
    params: GetByIdCommonParams,
    options?: QueryOptions<ResponseCommon<Users>>,
  ) => {
    return useGetApi<ResponseCommon<Users>>({
      endpoint: Endpoints.Users.GET,
      queryParams: {
        ...(params || {}),
      },
      options,
    })
  },
  create: () => {
    return usePostApi<CreateUsersRequest, ResponseCommon<Users>>({
      endpoint: Endpoints.Users.CREATE,
    })
  },
  update: () => {
    return usePatchApi<UpdateUsersRequest, ResponseCommon<Users>>({
      endpoint: Endpoints.Users.UPDATE,
      buildUrlParams: (params: UpdateUsersRequest) => ({
        id: params.id,
      }),
    })
  },
  delete: () => {
    return useDeleteApi<DeleteCommonParams, ResponseCommon<boolean>>({
      endpoint: Endpoints.Users.DELETE,
      buildUrlParams: (params: DeleteCommonParams) => ({
        id: params.id,
      }),
    })
  },
})
