import { useLogin } from '@/presentation/hooks/auth/useLogin'
import { AuthLayout } from '@/presentation/layouts/auth/auth-layout'
import { m } from '@/paraglide/messages'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const search = useSearch({ from: '/auth/login' })
  const { login, isPending } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = await login({
      email,
      password,
    })

    if (!result) {
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
      <div className="mx-auto w-full max-w-md px-6 pb-10">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            {m.login_eyebrow()}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            {m.login_title()}
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            {m.login_description()}
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              {m.login_email_label()}
            </span>
            <input
              autoComplete="email"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder={m.login_email_placeholder()}
              required
              type="email"
              value={email}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              {m.login_password_label()}
            </span>
            <input
              autoComplete="current-password"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder={m.login_password_placeholder()}
              required
              type="password"
              value={password}
            />
          </label>

          <button
            className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isPending}
            type="submit"
          >
            {isPending ? m.login_submit_loading() : m.login_submit()}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
