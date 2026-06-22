import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'
import { type AuthRepository } from '@/application/repositories/AuthRepository'
import {
  type ChangePasswordRequest,
  type ForgotPasswordRequest,
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type RegisterResponse,
  type ResetPasswordRequest,
  type User,
} from '@/domain/models/Auth'
import {
  useGetApi,
  usePatchApi,
  usePostApi,
} from '@/infrastructure/hooks/useApi'
import { Endpoints } from '@/shared/endpoints'
import { type QueryOptions } from '@/shared/types/react-query'
import type { UpdateUsersRequest } from 'src/domain/models/Users'

export const AuthRepositoryImpl = (): AuthRepository => ({
  login: () =>
    usePostApi<LoginRequest, ResponseCommon<LoginResponse>>({
      endpoint: Endpoints.Auth.LOGIN,
    }),
  logout: () => usePostApi({ endpoint: Endpoints.Auth.LOGOUT }),
  register: () =>
    usePostApi<RegisterRequest, ResponseCommon<RegisterResponse>>({
      endpoint: Endpoints.Auth.REGISTER,
    }),
  forgotPassword: () =>
    usePostApi<ForgotPasswordRequest, ResponseCommon<any>>({
      endpoint: Endpoints.Auth.FORGOT_PASSWORD,
    }),
  changePassword: () =>
    usePostApi<ChangePasswordRequest, ResponseCommon<any>>({
      endpoint: Endpoints.Auth.CHANGE_PASSWORD,
    }),
  resetPassword: () =>
    usePostApi<ResetPasswordRequest, ResponseCommon<any>>({
      endpoint: Endpoints.Auth.RESET_PASSWORD,
    }),

  me: (options?: QueryOptions<ResponseCommon<User>>) =>
    useGetApi<ResponseCommon<User>>({
      endpoint: Endpoints.Auth.ME,
      ...options,
    }),

  updateMe: () =>
    usePatchApi<UpdateUsersRequest, ResponseCommon<User>>({
      endpoint: Endpoints.Auth.ME,
    }),
})
