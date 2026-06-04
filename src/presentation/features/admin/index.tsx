import { m } from '@/paraglide/messages'
import { useAuth } from '@/presentation/provider/auth/auth-provider'

export default function AdminPage() {
  const { user } = useAuth()

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <section className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">
        <div className="bg-amber-50 px-8 py-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            {m.admin_eyebrow()}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {m.admin_title()}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
            {m.admin_description()}
          </p>
        </div>

        <div className="grid gap-4 px-8 py-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">
              {m.admin_access_label()}
            </p>
            <p className="mt-2 text-base font-semibold text-emerald-600">
              {m.admin_access_value()}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">
              {m.admin_role_label()}
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {user?.role?.name || m.profile_empty_value()}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">
              {m.admin_scope_label()}
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {m.admin_scope_value()}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
