import { Link } from '@tanstack/react-router'
import { useAuth } from '@/presentation/provider/auth/auth-provider'
import { Roles } from '@/shared/enums/Roles'
import { NAVIGATION } from '@/shared/constants/sidebar'
import { Button } from './ui/button'
import { Upload, Brain, Settings } from 'lucide-react'
import { ROUTES } from '@/shared/constants/routes'

export default function Sidebar() {
  const { user } = useAuth()
  const canAccessAdmin = user?.role?.id === Roles.ADMIN
  const initials = (() => {
    const name = user?.firstName || user?.email || 'A'
    return name
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  })()

  return (
    <aside className="hidden h-full overflow-y-auto flex-col border-r border-slate-200 bg-primary px-6 py-8 lg:flex">
      <div className="mb-10">
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
            <span className="text-white">RecruitAI</span>
            <p className="text-sm text-accent">CV management.</p>
          </div>
        </Link>
      </div>

      <Button className="rounded-sm py-3 px-2 text-lg" variant="accent">
        <Upload className="h-4 w-4" />
        <span>Upload CV</span>
      </Button>

      <nav className="mt-10 flex flex-col gap-2 text-sm font-medium text-white">
        {NAVIGATION.map((item) => {
          if (item?.adminOnly && !canAccessAdmin) {
            return null
          }

          return (
            <Link
              key={item.to}
              className="flex gap-2 rounded-sm px-4 py-3 transition hover:bg-slate-100/20 hover:text-accent"
              to={item.to}
            >
              {item.icon && <item.icon className="h-5 w-5" />}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex w-full items-center gap-3 py-3 text-sm text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-sm font-semibold">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">
            {user?.firstName || 'Admin User'}
          </p>
          <p className="truncate text-xs text-cyan-100">{user?.email}</p>
        </div>

        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-cyan-100 hover:text-white"
          aria-label="settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}
