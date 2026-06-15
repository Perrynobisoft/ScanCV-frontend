import { createFileRoute } from '@tanstack/react-router'
import UserManagementPage from '@/presentation/features/user-management/user-management'

export const Route = createFileRoute('/_app/user-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <UserManagementPage />
}
