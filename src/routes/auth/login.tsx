import LoginPage from '@/presentation/features/auth/login'
import { redirectToSearchSchema } from '@/shared/validations/common/redirectTo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  validateSearch: redirectToSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginPage />
}
