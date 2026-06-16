import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCvList } from '@/presentation/hooks/cv/useCvList'
import { type CvItem } from '@/domain/models/Cv'
import { Input } from '@/presentation/components/ui/input'
import { Select } from '@/presentation/components/ui/select'
import { m } from '@/paraglide/messages'
import { Pagination } from '@/presentation/components/ui/pagination'
import CvTable from './cv-table'
import { Search } from 'lucide-react'
import useDebounce from '@/presentation/hooks/useDebounce'

const SKILL_OPTIONS = [
  { label: 'All Skills', value: '' },
  { label: 'ReactJS', value: 'reactjs' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
]

const POSITION_OPTIONS = [
  { label: 'All Positions', value: '' },
  { label: 'Frontend Developer', value: 'frontend' },
  { label: 'Data Scientist', value: 'datascientist' },
  { label: 'Product Manager', value: 'product' },
]

const STYLE_OPTIONS = [
  { label: 'All Styles', value: '' },
  { label: 'Remote', value: 'remote' },
  { label: 'Full-time', value: 'fulltime' },
  { label: 'Part-time', value: 'parttime' },
]

const EXPERIENCE_OPTIONS = ['All', 'Under 1y', '1-3y', '3-5y', '5y+']

export default function CvListPage() {
  const [keywordInput, setKeywordInput] = useState('')
  const [keywordQuery, setKeywordQuery] = useState<string | undefined>(
    undefined,
  )
  const [experienceFilter, setExperienceFilter] = useState('All')
  const [skillFilter, setSkillFilter] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [styleFilter, setStyleFilter] = useState('')

  const keywordSearch = useCvList(keywordQuery, {
    experience: experienceFilter,
    skills: skillFilter,
    position: positionFilter,
    style: styleFilter,
  })
  const { page, setPage, items, total, totalPages, isLoading } = keywordSearch
  const filteredCvs = useMemo(() => items as CvItem[], [items])

  const handleInputChange = (value: string) => {
    setKeywordInput(value)
  }

  const searchValue = keywordInput
  const navigate = useNavigate()
  const debouncedKeyword = useDebounce(searchValue, 600)

  useEffect(() => {
    // set undefined when empty to keep previous behavior
    setKeywordQuery(debouncedKeyword ? debouncedKeyword : undefined)
  }, [debouncedKeyword])

  return (
    <main className="space-y-6 overflow-hidden">
      <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search candidates, positions, skills..."
              value={searchValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-80! rounded-sm pl-8 pr-3 py-2"
            />
          </div>
          <Select
            options={SKILL_OPTIONS}
            className="w-30 rounded-sm"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
          />
          <Select
            options={POSITION_OPTIONS}
            className="w-30 rounded-sm"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          />
          <Select
            options={STYLE_OPTIONS}
            className="w-30 rounded-sm"
            value={styleFilter}
            onChange={(e) => setStyleFilter(e.target.value)}
          />
          <div className="flex items-center gap-2 text-sm">
            {EXPERIENCE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setExperienceFilter(option)}
                className={`rounded-full border px-4 py-2 transition truncate ${
                  experienceFilter === option
                    ? 'border-accent bg-cyan-50 text-accent'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {isLoading && (
            <div className="rounded-[22px] border border-dashed border-slate-200 p-8 text-center text-slate-500">
              Loading candidate profiles...
            </div>
          )}

          {!isLoading && filteredCvs.length === 0 && (
            <div className="rounded-[22px] border border-dashed border-slate-200 p-8 text-center text-slate-500">
              {m.cv_no_match()}
            </div>
          )}

          {!isLoading && filteredCvs.length > 0 && (
            <CvTable
              data={filteredCvs}
              loading={isLoading}
              onRowClick={(cv) => {
                navigate({ to: `/cv/${cv.id}` })
              }}
            />
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing {filteredCvs.length} of {total} candidates
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </section>
    </main>
  )
}
