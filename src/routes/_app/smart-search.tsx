import { createFileRoute } from '@tanstack/react-router'
import SmartSearchPage from '@/presentation/features/cv/smartSearch'

export const Route = createFileRoute('/_app/smart-search')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SmartSearchPage />
}
