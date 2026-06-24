import { useRef, useState, useEffect } from 'react'
import { useAuth } from '@/presentation/provider/auth/auth-provider'
import { useRouter } from '@tanstack/react-router'
import { useLogout } from '@/presentation/hooks/auth/useLogout'
import { Button } from './ui/button'
import { Upload, Bell, ChevronDown, User, LogOut } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const { user } = useAuth()
  const { logout, isPending } = useLogout()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const initials = (() => {
    const name = user?.fullName || user?.email || 'AN'
    return name
      .split(' ')
      .map((s: string) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  })()

  const displayName = user?.fullName || user?.email || 'HR'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setDropdownOpen(false)
    await logout()
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95">
      <div className="flex max-w-full items-center justify-end px-6 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="accent"
            className="rounded-sm px-4 py-2"
            onClick={() => void router.navigate({ to: '/cv' })}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload CVs
          </Button>

          {/* Notification bell */}
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-white text-slate-600">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 hover:bg-slate-100 transition-colors"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white text-sm font-semibold">
                {initials}
              </div>
              <span className="text-sm font-medium text-slate-900">
                {displayName}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-100 bg-white shadow-lg z-50 overflow-hidden">
                {/* View Profile */}
                <button
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    setDropdownOpen(false)
                    void router.navigate({ to: '/profile' })
                  }}
                >
                  <User className="h-4 w-4 text-slate-500" />
                  <span>View Profile</span>
                </button>

                <div className="border-t border-slate-100" />

                {/* Log Out */}
                <button
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  onClick={handleLogout}
                  disabled={isPending}
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isPending ? 'Logging out…' : 'Log Out'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
