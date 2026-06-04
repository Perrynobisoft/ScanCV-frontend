import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'
import { type AuthRepository } from '@/application/repositories/AuthRepository'
import {
  type ChangePasswordRequest,
  type ConfirmEmailRequest,
  type ConfirmEmailResponse,
  type ForgotPasswordRequest,
  type LoginRequest,
  type LoginResponse,
  type LoginWithFacebookRequest,
  type LoginWithGoogleRequest,
  type RegisterRequest,
  type RegisterResponse,
  type ResetPasswordRequest,
  type UpdateMeRequest,
  type User,
} from '@/domain/models/Auth'
import {
  useGetApi,
  usePatchApi,
  usePostApi,
} from '@/infrastructure/hooks/useApi'
import { Endpoints } from '@/shared/endpoints'
import { type QueryOptions } from '@tanstack/react-query'

export const AuthRepositoryImpl = (): AuthRepository => ({
  login: () =>
    usePostApi<LoginRequest, ResponseCommon<LoginResponse>>({
      endpoint: Endpoints.Auth.LOGIN,
    }),
  loginWithGoogle: () =>
    usePostApi<LoginWithGoogleRequest, ResponseCommon<LoginResponse>>({
      endpoint: Endpoints.Auth.LOGIN_WITH_GOOGLE,
    }),
  loginWithFacebook: () =>
    usePostApi<LoginWithFacebookRequest, ResponseCommon<LoginResponse>>({
      endpoint: Endpoints.Auth.LOGIN_WITH_FACEBOOK,
    }),
  logout: () => usePostApi({ endpoint: Endpoints.Auth.LOGOUT }),
  register: () =>
    usePostApi<RegisterRequest, ResponseCommon<RegisterResponse>>({
      endpoint: Endpoints.Auth.REGISTER,
    }),
  confirmEmail: () =>
    usePostApi<ConfirmEmailRequest, ResponseCommon<ConfirmEmailResponse>>({
      endpoint: Endpoints.Auth.CONFIRM_EMAIL,
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

  me: (options?: QueryOptions) =>
    useGetApi<ResponseCommon<User>>({
      endpoint: Endpoints.Auth.ME,
      ...options,
    }),

  updateMe: () =>
    usePatchApi<UpdateMeRequest, ResponseCommon<User>>({
      endpoint: Endpoints.Auth.ME,
    }),
})
