import { createFileRoute } from '@tanstack/react-router'
import DashboardPage from '@/presentation/features/dashboard'

export const Route = createFileRoute('/_app/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DashboardPage />
}
