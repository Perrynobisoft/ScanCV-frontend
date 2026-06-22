type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden w-[500px] flex-shrink-0 flex-col justify-between bg-[#0d1a26] p-16 text-white lg:flex xl:w-[600px]">
        {/* Logo */}
        <div>
          <div className="mb-14 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0d9488]">
              <svg
                fill="none"
                height="30"
                viewBox="0 0 20 20"
                width="30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2L3 7v6l7 5 7-5V7l-7-5z"
                  fill="white"
                  opacity="0.9"
                />
                <circle cx="10" cy="11" fill="white" r="2.5" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold leading-tight text-white">
                RecruitAI
              </p>
              <p className="text-sm leading-tight text-[#0d9488]">
                CV Management Platform
              </p>
            </div>
          </div>

          <h2 className="mb-6 text-[38px] font-bold leading-snug text-white">
            Hire smarter with AI-powered recruitment
          </h2>
          <p className="mb-14 text-base leading-relaxed text-slate-400">
            Parse thousands of CVs in minutes, rank candidates by AI match
            score, and discover top talent instantly using semantic search.
          </p>

          {/* Stats */}
          <div className="space-y-7">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-[#0d9488]">10x</span>
              <span className="text-base text-slate-400">
                Faster CV screening
              </span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-[#0d9488]">95%</span>
              <span className="text-base text-slate-400">Parsing accuracy</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-[#0d9488]">3M+</span>
              <span className="text-base text-slate-400">CVs processed</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-slate-600">
          © 2026 RecruitAI. All rights reserved.
        </p>
      </div>

      {/* Right panel — form area */}
      <div className="flex flex-1 items-center justify-center bg-[#f7f9fb] px-8 py-16">
        {children}
      </div>
    </div>
  )
}
