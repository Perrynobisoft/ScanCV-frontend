import { useLogin } from '@/presentation/hooks/auth/useLogin'
import { AuthLayout } from '@/presentation/layouts/auth/auth-layout'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { m } from '@/paraglide/messages'

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
      setError(m.login_error_generic())
      return
    }

    // Handle first-login password change requirement
    if ((result as any).requirePasswordChange) {
      window.location.href = '/auth/change-password'
      return
    }

    // Chờ React flush state update từ setAuthenticated() trước khi navigate.
    // Nếu navigate ngay lập tức, beforeLoad của /_app có thể đọc context cũ
    // (isAuthenticated=false) và redirect ngược về login.
    await new Promise((resolve) => setTimeout(resolve, 0))

    if (search.redirectTo) {
      router.history.push(search.redirectTo)
      return
    }

    await router.navigate({ to: '/cv' })
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-[560px]">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-[44px] font-bold leading-tight text-slate-900">
            {m.login_title()}
          </h1>
          <p className="mt-2 text-base text-slate-500">{m.login_subtitle()}</p>
        </div>

        {/* Login Form */}
        <form className="space-y-7" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label
              className="mb-2 block text-base font-semibold text-slate-700"
              htmlFor="email"
            >
              {m.login_email_label()}
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <Input
                autoComplete="email"
                className="h-[60px] pl-12 text-base"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder={m.login_email_placeholder()}
                required
                type="email"
                value={email}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                className="text-base font-semibold text-slate-700"
                htmlFor="password"
              >
                {m.login_password_label()}
              </label>
              <a
                className="text-sm font-semibold text-[#0d9488] hover:text-[#0b7c71]"
                href="#"
              >
                {m.login_forgot_password()}
              </a>
            </div>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <Input
                autoComplete="current-password"
                className="h-[60px] pl-12 pr-14 text-base"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder={m.login_password_placeholder()}
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button
                aria-label={
                  showPassword
                    ? m.login_hide_password()
                    : m.login_show_password()
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                onClick={() => setShowPassword((v) => !v)}
                type="button"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}

          {/* Submit */}
          <Button
            className="mt-3 h-[60px] text-xl"
            variant="login"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin"
                  fill="none"
                  height="20"
                  viewBox="0 0 24 24"
                  width="20"
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
                {m.login_submit_loading()}
              </>
            ) : (
              <>
                {m.login_submit()} <ArrowRight size={20} />
              </>
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}
