import { useMemo, useState, useEffect } from 'react'
import { useCvList } from '@/presentation/hooks/cv/useCvList'
import { type CvItem } from '@/domain/models/Cv'
import { Input } from '@/presentation/components/ui/input'
import { Select } from '@/presentation/components/ui/select'
import { m } from '@/paraglide/messages'
import { Pagination } from '@/presentation/components/ui/pagination'
import CvTable from './cv-table'
import CvDetail from '../CvDetail'
import { Search, Users } from 'lucide-react'
import useDebounce from '@/presentation/hooks/useDebounce'

const JOB_TITLE_OPTIONS = [
  { label: 'Job Titles', value: '' },
  { label: 'Software Engineer', value: 'software_engineer' },
  { label: 'Data Scientist', value: 'data_scientist' },
  { label: 'Product Manager', value: 'product_manager' },
]

const SKILL_OPTIONS = [
  { label: 'Skills', value: '' },
  { label: 'ReactJS', value: 'reactjs' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
]

const YEARS_OF_EXPERIENCE_OPTIONS = [
  { label: 'Years of Experience', value: 'All' },
  { label: 'Under 1 year', value: 'Under 1y' },
  { label: '1-3 years', value: '1-3y' },
  { label: '3-5 years', value: '3-5y' },
  { label: '5+ years', value: '5y+' },
]

const LOCATION_OPTIONS = [
  { label: 'Locations', value: '' },
  { label: 'New York', value: 'new_york' },
  { label: 'San Francisco', value: 'san_francisco' },
  { label: 'Remote', value: 'remote' },
]

const WORK_TYPE_OPTIONS = [
  { label: 'Work Types', value: '' },
  { label: 'Remote', value: 'remote' },
  { label: 'Full-time', value: 'fulltime' },
  { label: 'Part-time', value: 'parttime' },
]

export default function CvListPage() {
  const [keywordInput, setKeywordInput] = useState('')
  const [keywordQuery, setKeywordQuery] = useState<string | undefined>(
    undefined,
  )
  const [experienceFilter, setExperienceFilter] = useState('')
  const [jobTitleFilter, setJobTitleFilter] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [workTypeFilter, setWorkTypeFilter] = useState('')

  const keywordSearch = useCvList(keywordQuery, {
    job_title: jobTitleFilter,
    location: locationFilter,
    experience: experienceFilter,
    skills: skillFilter,
    work_type: workTypeFilter,
  })
  const { page, setPage, items, total, totalPages, isLoading } = keywordSearch
  const filteredCvs = useMemo(() => items as CvItem[], [items])
  const [selectedCv, setSelectedCv] = useState<CvItem | null>(null)

  const handleInputChange = (value: string) => {
    setKeywordInput(value)
  }

  const searchValue = keywordInput
  const debouncedKeyword = useDebounce(searchValue, 600)

  useEffect(() => {
    // set undefined when empty to keep previous behavior
    setKeywordQuery(debouncedKeyword ? debouncedKeyword : undefined)
  }, [debouncedKeyword])

  return (
    <main className="space-y-6 overflow-y-auto">
      <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3">
          {/* Search Section */}
          <div className="flex items-center gap-4">
            <Users className="w-4 h-4 text-accent" />
            <span className="text-md font-medium text-slate-700">
              CV Directory
            </span>
            <span className="w-fit bg-[#CCFBF1] text-accent px-2 py-1 rounded-full text-[10px]">
              {filteredCvs.length}
            </span>

            {/* Search Input */}
            <div className="relative w-1/2">
              <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search candidates, positions, skills..."
                value={searchValue}
                onChange={(e) => handleInputChange(e.target.value)}
                className="rounded-sm pl-8 pr-3 py-1! bg-gray-50! focus:bg-white! focus:ring-1 focus:accent! focus:border-accent! focus:outline-accent transition-colors duration-200!"
              />
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Select
              options={JOB_TITLE_OPTIONS}
              className="w-30 rounded-sm"
              value={jobTitleFilter}
              onChange={(e) => setJobTitleFilter(e.target.value)}
            />
            <Select
              options={SKILL_OPTIONS}
              className="w-30 rounded-sm"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
            <Select
              options={YEARS_OF_EXPERIENCE_OPTIONS}
              className="w-30 rounded-sm"
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
            />
            <Select
              options={LOCATION_OPTIONS}
              className="w-30 rounded-sm"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <Select
              options={WORK_TYPE_OPTIONS}
              className="w-30 rounded-sm"
              value={workTypeFilter}
              onChange={(e) => setWorkTypeFilter(e.target.value)}
            />
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
              onRowClick={(cv) => setSelectedCv(cv as CvItem)}
            />
          )}
          {selectedCv && (
            <CvDetail
              cv={selectedCv}
              pdfUrl={selectedCv?.cv_file?.file_url ?? ''}
              onClose={() => setSelectedCv(null)}
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
