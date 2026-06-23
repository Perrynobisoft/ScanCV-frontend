import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'
import {
  type ChangePasswordRequest,
  type ConfirmEmailRequest,
  type ForgotPasswordRequest,
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type RegisterResponse,
  type ResetPasswordRequest,
  type UpdateMeRequest,
  type User,
} from '@/domain/models/Auth'
import {
  type useGetApi,
  type usePatchApi,
  type usePostApi,
} from '@/infrastructure/hooks/useApi'
import { type QueryOptions } from '@/shared/types/react-query'

export interface AuthRepository {
  login: () => ReturnType<
    typeof usePostApi<LoginRequest, ResponseCommon<LoginResponse>>
  >
  register: () => ReturnType<
    typeof usePostApi<RegisterRequest, ResponseCommon<RegisterResponse>>
  >
  logout: () => ReturnType<typeof usePostApi>
  forgotPassword: () => ReturnType<
    typeof usePostApi<ForgotPasswordRequest, ResponseCommon<any>>
  >
  resetPassword: () => ReturnType<
    typeof usePostApi<ResetPasswordRequest, ResponseCommon<any>>
  >
  changePassword: () => ReturnType<
    typeof usePostApi<ChangePasswordRequest, ResponseCommon<any>>
  >
  me: (
    options?: QueryOptions<ResponseCommon<User>>,
  ) => ReturnType<typeof useGetApi<ResponseCommon<User>>>
  updateMe: () => ReturnType<
    typeof usePatchApi<UpdateMeRequest, ResponseCommon<User>>
  >
  confirmEmail: () => ReturnType<
    typeof usePostApi<ConfirmEmailRequest, ResponseCommon<any>>
  >
}
