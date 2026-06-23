import ProfilePage from '@/presentation/features/profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProfilePage />
}
