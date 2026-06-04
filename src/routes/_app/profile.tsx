import ProfilePage from '@/presentation/features/profile'
import { Roles } from '@/shared/enums/Roles'
import { requireRoles } from '@/shared/route-guards'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/profile')({
  beforeLoad: ({ context }) => {
    requireRoles({
      auth: context.auth,
      allowedRoles: [Roles.ADMIN, Roles.USER],
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <ProfilePage />
}
