import type { AuthContext } from '@/presentation/provider/auth/auth-provider'
import { redirect } from '@tanstack/react-router'

/**
 * Redirects to /auth/login if the user is not authenticated.
 * Preserves the current path as `redirectTo` so the user is sent back after login.
 */
export const requireAuth = ({
  auth,
  location,
}: {
  auth: AuthContext
  location: { href: string }
}) => {
  if (!auth.isAuthenticated) {
    throw redirect({
      to: '/auth/login',
      search: { redirectTo: location.href },
      replace: true,
    })
  }
}

export const hasRequiredRole = (
  role: string | null | undefined,
  allowedRoles: string[],
) => {
  if (!role) return false
  return allowedRoles.includes(role)
}

export const requireRoles = ({
  auth,
  allowedRoles,
}: {
  auth: AuthContext
  allowedRoles: string[]
}) => {
  const role = auth.user?.role.toLocaleLowerCase() ?? undefined

  if (!hasRequiredRole(role, allowedRoles)) {
    throw redirect({
      to: '/403',
      replace: true,
    })
  }
}
