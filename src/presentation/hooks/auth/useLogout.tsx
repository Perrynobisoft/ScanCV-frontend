import { useRepository } from '@/di/RepositoriesProvider'
import { useAuth } from '@/presentation/provider/auth/auth-provider'
import { useRouter } from '@tanstack/react-router'

export const useLogout = () => {
  const { authRepository } = useRepository()
  const { clearAuth } = useAuth()
  const router = useRouter()
  const { mutateAsync: logoutMutation, isPending } = authRepository.logout()

  const logout = async () => {
    try {
      await logoutMutation(undefined)
    } catch {
      // Silently ignore — server-side logout failure should not block local cleanup
    } finally {
      clearAuth()
      await router.navigate({ to: '/auth/login', replace: true })
    }
  }

  return { logout, isPending }
}
