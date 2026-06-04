import { useLogout } from '@/presentation/hooks/auth/useLogout'
import { useAuth } from '@/presentation/provider/auth/auth-provider'
import { m } from '@/paraglide/messages'
import { getLocale, locales, setLocale } from '@/paraglide/runtime.js'
import { Roles } from '@/shared/enums/Roles'
import { Link, useRouter } from '@tanstack/react-router'

export default function Header() {
  const router = useRouter()
  const { user } = useAuth()
  const { logout, isPending } = useLogout()
  const currentLocale = getLocale()
  const canAccessAdmin = user?.role?.id === Roles.ADMIN

  const handleLogout = () => {
    logout(() => {
      void router.navigate({
        to: '/auth/login',
        replace: true,
      })
    })
  }

  const handleLanguageChange = (locale: (typeof locales)[number]) => {
    if (locale !== currentLocale) {
      void setLocale(locale)
    }
  }

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <nav className="flex items-center gap-6">
          <Link
            className="text-lg font-semibold tracking-tight text-slate-950"
            to="/dashboard"
          >
            {m.header_brand()}
          </Link>
          <Link className="text-sm font-medium text-slate-600" to="/dashboard">
            {m.header_dashboard()}
          </Link>
          <Link className="text-sm font-medium text-slate-600" to="/profile">
            {m.header_profile()}
          </Link>
          {canAccessAdmin && (
            <Link className="text-sm font-medium text-slate-600" to="/admin">
              {m.header_admin()}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {m.language_label()}
            </span>
            {locales.map((locale) => (
              <button
                key={locale}
                className={`rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  currentLocale === locale
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                onClick={() => handleLanguageChange(locale)}
                type="button"
              >
                {locale}
              </button>
            ))}
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">
              {user?.firstName || user?.email || m.header_authenticated_user()}
            </p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>

          <button
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            onClick={handleLogout}
            type="button"
          >
            {isPending ? m.logout_button_loading() : m.logout_button()}
          </button>
        </div>
      </div>
    </header>
  )
}
