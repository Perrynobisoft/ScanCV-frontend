import { m } from '@/paraglide/messages'
import { useAuth } from '@/presentation/provider/auth/auth-provider'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          {m.profile_eyebrow()}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          {m.profile_title()}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          {m.profile_description()}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">
              {m.profile_full_name_label()}
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {[user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
                m.profile_empty_value()}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">
              {m.profile_email_label()}
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {user?.email || m.profile_empty_value()}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">
              {m.profile_provider_label()}
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {user?.provider || m.profile_empty_value()}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">
              {m.profile_role_label()}
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
