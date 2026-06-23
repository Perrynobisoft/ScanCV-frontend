import { Roles } from '@/shared/enums/Roles'
import { requireRoles } from '@/shared/route-guards'
import { createFileRoute } from '@tanstack/react-router'
import UserManagementPage from '@/presentation/features/user-management/user-management'

export const Route = createFileRoute('/_app/user-management')({
  beforeLoad: ({ context }) => {
    requireRoles({
      auth: context.auth,
      allowedRoles: [Roles.ADMIN],
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <UserManagementPage />
}
