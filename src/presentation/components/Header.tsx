import { useAuth } from '@/presentation/provider/auth/auth-provider'
import { useRouter } from '@tanstack/react-router'
import { Button } from './ui/button'
import { Upload, Bell, ChevronDown } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const { user } = useAuth()

  const initials = (() => {
    const name = user?.firstName || user?.email || 'AN'
    return name
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  })()

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

          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-white text-slate-600">
            <Bell className="h-4 w-4" />
          </button>

          <div className="inline-flex items-center gap-3 rounded-full px-3 py-1">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white font-semibold">
              {initials}
            </div>
            <div className="text-sm text-slate-900">Admin</div>
            <ChevronDown className="h-4 w-4 text-slate-600" />
          </div>
        </div>
      </div>
    </header>
  )
}
