import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import Header from '@/presentation/components/Header'
import Sidebar from '@/presentation/components/Sidebar'
import { useLocale } from '@/presentation/provider/locale/locale-provider'
import { requireAuth } from '@/shared/route-guards'
import { useAuth } from '@/presentation/provider/auth/auth-provider'
import { useEffect } from 'react'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    // Skip redirect while auth is still resolving — the component handles it reactively
    if (!context.auth.isLoading) {
      requireAuth({ auth: context.auth, location })
    }
  },
})

function RouteComponent() {
  const { locale } = useLocale()
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  // After useMe resolves, if still not authenticated → redirect to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({
        to: '/auth/login',
        search: {
          redirectTo: window.location.pathname + window.location.search,
        },
        replace: true,
      })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-accent" />
          <span className="text-sm text-slate-500">Đang xác thực...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900" lang={locale}>
      <div className="flex min-h-screen">
        <div className="fixed w-72 h-full z-30">
          <Sidebar />
        </div>

        <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden pl-72">
          <Header />
          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet key={locale} />
          </div>
        </div>
      </div>
    </div>
  )
}
