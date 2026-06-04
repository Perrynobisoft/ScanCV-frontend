import AdminPage from '@/presentation/features/admin'
import { Roles } from '@/shared/enums/Roles'
import { requireRoles } from '@/shared/route-guards'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/admin')({
  beforeLoad: ({ context }) => {
    requireRoles({
      auth: context.auth,
      allowedRoles: [Roles.ADMIN],
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminPage />
}
