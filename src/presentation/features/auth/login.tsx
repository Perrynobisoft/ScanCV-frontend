import { useLogin } from '@/presentation/hooks/auth/useLogin'
import { AuthLayout } from '@/presentation/layouts/auth/auth-layout'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const search = useSearch({ from: '/auth/login' })
  const { login, isPending } = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const result = await login({ email, password })

    if (!result) {
      setError('Invalid email or password. Please try again.')
      return
    }

    // Handle first-login password change requirement
    if ((result as any).requirePasswordChange) {
      await router.navigate({ to: '/auth/change-password' })
      return
    }

    await router.invalidate()

    if (search.redirectTo) {
      router.history.push(search.redirectTo)
      return
    }

    await router.navigate({ to: '/dashboard' })
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to your RecruitAI account
          </p>
        </div>

        {/* OAuth buttons */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <Button
            className="h-10 w-full rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-none hover:bg-slate-50"
            type="button"
            variant="default"
          >
            <svg height="18" viewBox="0 0 24 24" width="18">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>

          <Button
            className="h-10 w-full rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-none hover:bg-slate-50"
            type="button"
            variant="default"
          >
            <svg height="18" viewBox="0 0 23 23" width="18">
              <path
                d="M1 1h9.5v9.5H1V1zm11 0h9.5v9.5H12V1zM1 12h9.5v9.5H1V12zm11 0h9.5v9.5H12V12z"
                fill="#00A4EF"
              />
              <path d="M1 1h9.5v9.5H1V1z" fill="#F25022" />
              <path d="M12 1h9.5v9.5H12V1z" fill="#7FBA00" />
              <path d="M1 12h9.5v9.5H1V12z" fill="#00A4EF" />
              <path d="M12 12h9.5v9.5H12V12z" fill="#FFB900" />
            </svg>
            Microsoft
          </Button>
        </div>

        {/* Divider */}
        <div className="mb-5 flex items-center gap-3">
          <hr className="flex-1 border-slate-200" />
          <span className="text-xs text-slate-400">or sign in with email</span>
          <hr className="flex-1 border-slate-200" />
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="email"
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <Input
                autoComplete="email"
                className="pl-9"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                required
                type="email"
                value={email}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="password"
              >
                Password
              </label>
              <a
                className="text-xs font-medium text-slate-500 hover:text-[#0d9488]"
                href="#"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <Input
                autoComplete="current-password"
                className="pl-9 pr-10"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                onClick={() => setShowPassword((v) => !v)}
                type="button"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && <p className="text-xs font-medium text-red-500">{error}</p>}

          {/* Submit */}
          <Button
            className="mt-1 h-11 w-full rounded-lg bg-[#0d9488] text-sm font-semibold text-white hover:bg-[#0b7c71] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin"
                  fill="none"
                  height="16"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    fill="currentColor"
                  />
                </svg>
                Signing in...
              </>
            ) : (
              <>Sign In →</>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <a
            className="font-semibold text-slate-800 hover:text-[#0d9488]"
            href="#"
          >
            Request access
          </a>
        </p>
      </div>
    </AuthLayout>
  )
}
