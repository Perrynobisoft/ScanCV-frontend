import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getMeQueryOptions } from '@/presentation/hooks/auth/useMe'
import Header from '@/presentation/components/Header'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirectTo: location.href,
        },
        replace: true,
      })
    }

    try {
      await context.queryClient.ensureQueryData(getMeQueryOptions())
    } catch {
      context.auth.clearAuth()
      throw redirect({
        to: '/auth/login',
        search: {
          redirectTo: location.href,
        },
        replace: true,
      })
    }
  },
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Outlet />
    </div>
  )
}
