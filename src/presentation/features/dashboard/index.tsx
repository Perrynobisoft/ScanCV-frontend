import { m } from '@/paraglide/messages'
import { useAuth } from '@/presentation/provider/auth/auth-provider'

export default function DashboardPage() {
  const { user } = useAuth()
  const welcomeSuffix = user?.firstName ? `, ${user.firstName}.` : '.'

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-950 px-8 py-10 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
            {m.dashboard_overview()}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {m.dashboard_welcome({ suffix: welcomeSuffix })}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            {m.dashboard_description()}
          </p>
        </div>

        <div className="grid gap-4 px-8 py-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">
              {m.dashboard_signed_in_as()}
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {user?.email || m.dashboard_no_email()}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">
              {m.dashboard_status()}
            </p>
            <p className="mt-2 text-base font-semibold text-emerald-600">
              {m.dashboard_authenticated()}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">
              {m.dashboard_role_label()}
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {user?.role?.name || m.profile_empty_value()}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
