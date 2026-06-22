import { useRepository } from '@/di/RepositoriesProvider'
import type { ResponseCommon } from '@/application/dto/response/ResponseCommon'
import { getFormattedErrorMessage } from '@/application/dto/response/ErrorResponse'
import { type LoginRequest, type LoginResponse } from '@/domain/models/Auth'
import { persistAuthTokens } from '@/shared/auth-storage'
import { useAuth } from '@/presentation/provider/auth/auth-provider'
import { m } from '@/paraglide/messages'
import { toast } from 'sonner'

export const useLogin = () => {
  const auth = useAuth()
  const { authRepository } = useRepository()
  const { mutateAsync: loginMutation, ...rest } = authRepository.login()

  return {
    login: async (credentials: LoginRequest): Promise<LoginResponse | null> => {
      const normalizedCredentials = {
        email: credentials.email.trim(),
        password: credentials.password,
      }

      try {
        const response = (await loginMutation(
          normalizedCredentials,
        )) as ResponseCommon<LoginResponse>
        const result = response.data

        // Persist both tokens to cookies (with their expiry dates)
        persistAuthTokens(result)

        // Set auth state directly from login response — no extra fetch needed
        auth.setAuthenticated(result.user)

        toast.success(m.login_success())
        return result
      } catch (error) {
        toast.error(getFormattedErrorMessage(error, m.login_error_generic()))
        return null
      }
    },
    ...rest,
  }
}
