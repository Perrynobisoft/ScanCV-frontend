import { createFileRoute } from '@tanstack/react-router'
import TalentPoolPage from '@/presentation/features/talent-pool'

export const Route = createFileRoute('/_app/talent-pool')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TalentPoolPage />
}
