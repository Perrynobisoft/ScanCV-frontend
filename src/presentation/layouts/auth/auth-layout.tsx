import { m } from '@/paraglide/messages'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.22),_transparent_42%),linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_100%)]">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="hidden rounded-[2rem] border border-white/60 bg-slate-950 p-10 text-slate-100 shadow-2xl shadow-slate-900/15 lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
            {m.auth_layout_brand()}
          </p>
          <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight">
            {m.auth_layout_title()}
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-7 text-slate-300">
            {m.auth_layout_description()}
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/70 bg-white/90 py-6 shadow-xl shadow-slate-300/40 backdrop-blur">
          {children}
        </div>
      </div>
    </div>
  )
}
