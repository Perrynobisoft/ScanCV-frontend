import { Search, Sparkles } from 'lucide-react'
import Avatar from '@/presentation/components/ui/avatar'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { useSearchCv } from '@/presentation/hooks/cv/useSearchCv'

export default function SmartSearchPage() {
  const {
    searchValue,
    setSearchValue,
    handleSearch,
    items,
    total,
    isLoading,
    hasSearched,
  } = useSearchCv()

  return (
    <main className="space-y-6">
      <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 items-center">
            <Sparkles className="h-5 w-5 text-accent" />
            <div className="text-md font-semibold text-slate-950">
              AI Semantic Search
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-semibold text-accent">
              Powered by AI
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="relative max-w-full rounded-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              placeholder="Search candidates by skill, experience, role..."
              className="pl-12 pr-36 py-4"
            />
            <Button
              variant="accent"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6 py-3"
              onClick={() => handleSearch()}
            >
              Search
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              {hasSearched
                ? `Tìm thấy ${total} ứng viên — sắp xếp theo điểm AI`
                : 'Nhập từ khóa và nhấn Search để tìm ứng viên bằng AI.'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading && (
            <div className="rounded-[22px] border border-dashed border-slate-200 p-8 text-center text-slate-500">
              Loading candidate profiles...
            </div>
          )}

          {!isLoading && hasSearched && items.length === 0 && (
            <div className="rounded-[22px] border border-dashed border-slate-200 p-8 text-center text-slate-500">
              Không tìm thấy ứng viên nào.
            </div>
          )}

          {!isLoading &&
            items.map((item: any, index: number) => (
              <article
                key={item.id ?? index}
                className="rounded-md border border-slate-200 bg-slate-50 px-5 py-5 shadow-sm transition hover:border-cyan-200 hover:bg-white"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
                      <Avatar name={item.full_name || item.name || 'CV'} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-950 flex gap-2">
                            {item.full_name || item.name || 'Unknown'}
                            <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 shadow-sm">
                              Best Match
                            </div>
                          </h3>
                          <p className="text-sm text-slate-500">
                            {item.position || item.title || 'Candidate'} •{' '}
                            {item.experience || item.years_experience || 'N/A'}
                          </p>
                        </div>
                        {/* <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 shadow-sm">
                        Best Match
                      </div> */}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(item.skills ?? [])
                          .slice(0, 4)
                          .map((skill: string) => (
                            <span
                              key={skill}
                              className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                            >
                              {skill}
                            </span>
                          ))}
                        {(item.skills ?? []).length > 4 && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                            +{(item.skills ?? []).length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-none flex-col items-end gap-3">
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                      {item.ai_score ?? item.score ?? '—'}
                    </div>
                    <Button variant="ghost" className="rounded-full px-4 py-2">
                      View
                    </Button>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </section>
    </main>
  )
}
