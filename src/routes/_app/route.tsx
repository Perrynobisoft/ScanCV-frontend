import { createFileRoute, Outlet } from '@tanstack/react-router'
import Header from '@/presentation/components/Header'
import Sidebar from '@/presentation/components/Sidebar'
import { useLocale } from '@/presentation/provider/locale/locale-provider'
import { requireAuth } from '@/shared/route-guards'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    requireAuth({ auth: context.auth, location })
  },
})

function RouteComponent() {
  const { locale } = useLocale()

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
