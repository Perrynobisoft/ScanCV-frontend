import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/presentation/provider/auth/auth-provider'
import { Roles } from '@/shared/enums/Roles'
import { NAVIGATION } from '@/shared/constants/sidebar'
import { Brain, Settings } from 'lucide-react'
import { ROUTES } from '@/shared/constants/routes'
import Avatar from './ui/avatar'
import { m } from '@/paraglide/messages'
import { useLocale } from '@/presentation/provider/locale/locale-provider'

export default function Sidebar() {
  useLocale() // subscribe to locale changes so m.xxx() calls re-render
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const canAccessAdmin = user?.role === Roles.ADMIN

  const displayName = user?.fullName || user?.email || 'User'
  const displayEmail = user?.email ?? ''

  return (
    <aside className="flex h-full overflow-y-auto flex-col border-r border-slate-200 bg-primary px-6 py-8 z-30">
      <div className="mb-5">
        <Link
          className="inline-flex items-center gap-3 text-2xl font-semibold"
          to={ROUTES.CV}
        >
          {/* Logo */}
          <div className="bg-accent rounded-sm p-3">
            <Brain className="h-3.5 w-3.5 text-white rounded-full " />
          </div>
          {/* Brand Name */}
          <div>
            <span className="text-white">{m.sidebar_brand()}</span>
            <p className="text-sm text-accent">{m.sidebar_brand_tagline()}</p>
          </div>
        </Link>
      </div>

      <nav className="mt-5 flex flex-col gap-2 text-sm font-medium text-white">
        {NAVIGATION.map((item) => {
          if (item?.adminOnly && !canAccessAdmin) {
            return null
          }
          const isActive = location.pathname.startsWith(item.to)

          return (
            <Link
              key={item.to}
              className={`flex gap-2 rounded-sm px-4 py-3 transition ${isActive ? 'bg-slate-100/20 text-accent' : 'hover:bg-slate-100/20 hover:text-accent'}`}
              to={item.to}
            >
              {item.icon && <item.icon className="h-5 w-5" />}
              {item.label()}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex w-full items-center gap-3 py-3 text-sm text-white">
        <div className="min-w-0 flex-1 flex gap-2">
          <Avatar name={displayName} />
          <div>
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-cyan-100">{displayEmail}</p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-transparent text-cyan-100 hover:text-white"
          aria-label="settings"
          onClick={() => void navigate({ to: '/profile' })}
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}
