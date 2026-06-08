import { useLogout } from '@/presentation/hooks/auth/useLogout'
import { useAuth } from '@/presentation/provider/auth/auth-provider'
import { m } from '@/paraglide/messages'
import { useLocale } from '@/presentation/provider/locale/locale-provider'
import { useState } from 'react'
import { Roles } from '@/shared/enums/Roles'
import { Link, useRouter } from '@tanstack/react-router'
import { GB, DE, VN } from 'country-flag-icons/react/3x2'

const LOCALE_CONFIG = {
  en: { flag: GB, name: 'English' },
  de: { flag: DE, name: 'Deutsch' },
  vi: { flag: VN, name: 'Tiếng Việt' },
} as const

const getLocaleInfo = (locale: string) => {
  return (
    (LOCALE_CONFIG as Record<string, any>)[locale] || {
      flag: '🌐',
      name: locale,
    }
  )
}

export default function Header() {
  const router = useRouter()
  const { user } = useAuth()
  const { logout, isPending } = useLogout()
  const {
    locale: currentLocale,
    setLocale: changeLocale,
    locales: availableLocales,
  } = useLocale()
  const canAccessAdmin = user?.role?.id === Roles.ADMIN
  const [open, setOpen] = useState(false)

  const CurrentFlag = getLocaleInfo(currentLocale).flag

  const handleLogout = () => {
    logout(() => {
      void router.navigate({
        to: '/auth/login',
        replace: true,
      })
    })
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
          <Link className="text-sm font-medium text-slate-600" to="/cv">
            {m.cv_management()}
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
          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((s) => !s)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 transition"
            >
              {typeof CurrentFlag === 'function' ? (
                <CurrentFlag className="h-4 w-6" aria-hidden />
              ) : (
                <span className="text-lg">{CurrentFlag}</span>
              )}
              <span className="font-medium text-slate-700">
                {currentLocale.toUpperCase()}
              </span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-slate-200 z-50">
                {availableLocales.map((loc) => {
                  const Flag = getLocaleInfo(loc).flag
                  return (
                    <button
                      key={loc}
                      onClick={() => {
                        setOpen(false)
                        if (loc !== currentLocale) {
                          void changeLocale(loc)
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${
                        currentLocale === loc
                          ? 'bg-slate-100 font-semibold text-slate-900'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                      type="button"
                    >
                      {typeof Flag === 'function' ? (
                        <Flag className="h-4 w-6" aria-hidden />
                      ) : (
                        <span className="text-xl">{Flag}</span>
                      )}
                      <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {getLocaleInfo(loc).name}
                        </span>
                        <span className="text-xs text-slate-500">{loc}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
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
