import type { AuthContext } from '@/presentation/provider/auth/auth-provider'
import type { Roles } from '@/shared/enums/Roles'
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
  roleId: number | null | undefined,
  allowedRoles: Roles[],
) => {
  if (!roleId) return false
  return allowedRoles.includes(roleId)
}

export const requireRoles = ({
  auth,
  allowedRoles,
}: {
  auth: AuthContext
  allowedRoles: Roles[]
}) => {
  const roleId = auth.user?.role ? Number(auth.user.role) : undefined

  if (!hasRequiredRole(roleId, allowedRoles)) {
    throw redirect({
      to: '/403',
      replace: true,
    })
  }
}
