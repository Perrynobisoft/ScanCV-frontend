import { createFileRoute } from '@tanstack/react-router'
import CvListPage from '@/presentation/features/cv/list'

export const Route = createFileRoute('/_app/cv')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CvListPage />
}
