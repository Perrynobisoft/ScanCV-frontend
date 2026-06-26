import { useMemo, useState, useEffect, useRef } from 'react'
import { useCvList } from '@/presentation/hooks/cv/useCvList'
import { type CvItem } from '@/domain/models/Cv'
import { Input } from '@/presentation/components/ui/input'
import { SimpleSelect } from '@/presentation/components/ui/select'
import { m } from '@/paraglide/messages'
import { Pagination } from '@/presentation/components/ui/pagination'
import CvTable from './cv-table'
import CvDetail from '../CvDetail'
import { RotateCcw, Search, Users } from 'lucide-react'
import useDebounce from '@/presentation/hooks/useDebounce'
import { Button } from '@/presentation/components/ui/button'
import {
  getSkillOptionsByJobTitle,
  JOB_TITLE_OPTIONS,
  LOCATION_OPTIONS,
  YEARS_OF_EXPERIENCE_OPTIONS,
  ALL_SKILL_OPTIONS,
} from './filter-options'
import Fuse from 'fuse.js'
import SuggestionsDropdown from './suggestions-dropdown'

export default function CvListPage() {
  const [keywordInput, setKeywordInput] = useState('')

  // Active search query and filters sent to the API
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
  const [activeFilters, setActiveFilters] = useState({
    position: '',
    location: '',
    experience: '',
    skills: '',
    work_type: '',
  })

  const [experienceFilter, setExperienceFilter] = useState('')
  const [jobTitleFilter, setJobTitleFilter] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [workTypeFilter, setWorkTypeFilter] = useState('')

  // Suggestion states
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const keywordSearch = useCvList(searchQuery, activeFilters)
  const {
    page,
    setPage,
    items,
    total,
    totalPages,
    isLoading,
    isFetching,
    isError,
    errorMessage,
  } = keywordSearch
  const filteredCvs = useMemo(() => items as CvItem[], [items])
  const skillOptions = useMemo(
    () => getSkillOptionsByJobTitle(jobTitleFilter),
    [jobTitleFilter],
  )
  const [selectedCv, setSelectedCv] = useState<CvItem | null>(null)

  // Initialize Fuse instances for job titles and skills
  const fuseJobTitles = useMemo(() => {
    return new Fuse(
      JOB_TITLE_OPTIONS.filter((opt) => opt.value !== ''),
      {
        keys: ['label', 'value'],
        threshold: 0.4,
      },
    )
  }, [])

  const fuseSkills = useMemo(() => {
    return new Fuse(
      ALL_SKILL_OPTIONS.filter((opt) => opt.value !== ''),
      {
        keys: ['label', 'value'],
        threshold: 0.4,
      },
    )
  }, [])

  // Debounce the suggestion input to avoid continuous updates
  const debouncedSuggestionKeyword = useDebounce(keywordInput, 200)

  // Compute matching job titles and skills using the debounced value
  const matchingJobTitles = useMemo(() => {
    if (!debouncedSuggestionKeyword.trim()) return []
    const results = fuseJobTitles.search(debouncedSuggestionKeyword)
    return results.slice(0, 8).map((res) => res.item)
  }, [debouncedSuggestionKeyword, fuseJobTitles])

  const matchingSkills = useMemo(() => {
    if (!debouncedSuggestionKeyword.trim()) return []
    const results = fuseSkills.search(debouncedSuggestionKeyword)
    return results.slice(0, 8).map((res) => res.item)
  }, [debouncedSuggestionKeyword, fuseSkills])

  const flattenedSuggestions = useMemo(() => {
    return [
      ...matchingJobTitles.map((item) => ({ ...item, type: 'jobTitle' })),
      ...matchingSkills.map((item) => ({ ...item, type: 'skill' })),
    ]
  }, [matchingJobTitles, matchingSkills])

  const handleInputChange = (value: string) => {
    setKeywordInput(value)
    setShowSuggestions(true)
    setFocusedIndex(-1)
  }

  const handleSearch = () => {
    setSearchQuery(keywordInput ? keywordInput : undefined)
    setActiveFilters({
      position: jobTitleFilter,
      location: locationFilter,
      experience: experienceFilter,
      skills: skillFilter,
      work_type: workTypeFilter,
    })
  }

  const handleSelectSuggestion = (value: string) => {
    setKeywordInput(value)
    // Instantly perform search when suggestion is selected
    setSearchQuery(value ? value : undefined)
    setActiveFilters({
      position: jobTitleFilter,
      location: locationFilter,
      experience: experienceFilter,
      skills: skillFilter,
      work_type: workTypeFilter,
    })
    setShowSuggestions(false)
    setFocusedIndex(-1)
  }

  const handleClearFilters = () => {
    setKeywordInput('')
    setExperienceFilter('')
    setJobTitleFilter('')
    setSkillFilter('')
    setLocationFilter('')
    setWorkTypeFilter('')
    setShowSuggestions(false)
    setFocusedIndex(-1)

    // Clear active search query and active filters immediately
    setSearchQuery(undefined)
    setActiveFilters({
      position: '',
      location: '',
      experience: '',
      skills: '',
      work_type: '',
    })
  }

  const searchValue = keywordInput

  // Close suggestions dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If suggestions are open and an item is focused, Enter selects it
    if (
      showSuggestions &&
      flattenedSuggestions.length > 0 &&
      focusedIndex >= 0 &&
      focusedIndex < flattenedSuggestions.length
    ) {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSelectSuggestion(flattenedSuggestions[focusedIndex].value)
        return
      }
    }

    // Otherwise, if Enter is pressed, perform search
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
      setShowSuggestions(false)
      return
    }

    if (!showSuggestions || flattenedSuggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((prev) =>
        prev < flattenedSuggestions.length - 1 ? prev + 1 : 0,
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex((prev) =>
        prev > 0 ? prev - 1 : flattenedSuggestions.length - 1,
      )
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      e.currentTarget.blur()
    }
  }

  useEffect(() => {
    const hasSelectedSkill = skillOptions.some(
      (option) => option.value === skillFilter,
    )

    if (!hasSelectedSkill) {
      setSkillFilter('')
    }
  }, [skillFilter, skillOptions])

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

            {/* Search Input and Button */}
            <div className="flex items-center gap-2 w-1/2">
              <div ref={suggestionsRef} className="relative flex-1">
                <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search candidates, positions, skills..."
                  value={searchValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => {
                    setShowSuggestions(true)
                    setFocusedIndex(-1)
                  }}
                  onKeyDown={handleKeyDown}
                  className="rounded-sm pl-8 pr-3 py-1! bg-gray-50! focus:bg-white! focus:ring-1 focus:accent! focus:border-accent! focus:outline-accent transition-colors duration-200!"
                />
                {/* Suggestions Dropdown */}
                <SuggestionsDropdown
                  isOpen={showSuggestions}
                  inputValue={keywordInput}
                  matchingJobTitles={matchingJobTitles}
                  matchingSkills={matchingSkills}
                  focusedIndex={focusedIndex}
                  onSelect={handleSelectSuggestion}
                  onHoverItem={setFocusedIndex}
                />
              </div>
              <Button
                variant="accent"
                onClick={handleSearch}
                className="h-8 text-xs font-semibold px-4 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                Search
              </Button>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <SimpleSelect
              options={JOB_TITLE_OPTIONS}
              className="w-fit"
              value={jobTitleFilter}
              onChange={setJobTitleFilter}
              size="sm"
            />
            <SimpleSelect
              options={skillOptions}
              className="w-fit"
              value={skillFilter}
              onChange={setSkillFilter}
              size="sm"
            />
            <SimpleSelect
              options={YEARS_OF_EXPERIENCE_OPTIONS}
              className="w-fit"
              value={experienceFilter}
              onChange={setExperienceFilter}
              size="sm"
            />
            <SimpleSelect
              options={LOCATION_OPTIONS}
              className="w-fit"
              value={locationFilter}
              onChange={setLocationFilter}
              size="sm"
            />
            <Button
              variant="default"
              className="h-8 rounded-sm px-3 text-xs text-slate-600"
              onClick={handleClearFilters}
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {isFetching && (
            <div className="rounded-[22px] border border-dashed border-slate-200 p-8 text-center text-slate-500">
              Loading candidate profiles...
            </div>
          )}

          {!isFetching && isError && (
            <div className="rounded-[22px] border border-dashed border-red-200 p-8 text-center text-red-500">
              {errorMessage ?? 'Failed to load candidates. Please try again.'}
            </div>
          )}

          {!isFetching && !isError && filteredCvs.length === 0 && (
            <div className="rounded-[22px] border border-dashed border-slate-200 p-8 text-center text-slate-500">
              {m.cv_no_match()}
            </div>
          )}

          {!isFetching && !isError && filteredCvs.length > 0 && (
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
              onUpdated={(updated) => setSelectedCv(updated)}
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
