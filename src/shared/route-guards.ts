import type { AuthContext } from '@/presentation/provider/auth/auth-provider'
import type { Roles } from '@/shared/enums/Roles'
import { redirect } from '@tanstack/react-router'

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
  const roleId = auth.user?.role?.id

  if (!hasRequiredRole(roleId, allowedRoles)) {
    throw redirect({
      to: '/403',
      replace: true,
    })
  }
}
