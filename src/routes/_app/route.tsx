import { createFileRoute, Outlet } from '@tanstack/react-router'
import Header from '@/presentation/components/Header'
import { useLocale } from '@/presentation/provider/locale/locale-provider'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
  beforeLoad: async () => {
    return
  },
})

function RouteComponent() {
  const { locale } = useLocale()

  return (
    <div className="min-h-screen bg-slate-50" lang={locale}>
      <Header />
      <Outlet key={locale} />
    </div>
  )
}
