import { Briefcase, Tag } from 'lucide-react'
import { m } from '@/paraglide/messages'

type FilterOption = {
  label: string
  value: string
}

interface SuggestionsDropdownProps {
  isOpen: boolean
  inputValue: string
  matchingJobTitles: FilterOption[]
  matchingSkills: FilterOption[]
  focusedIndex: number
  onSelect: (value: string) => void
  onHoverItem: (index: number) => void
}

export function SuggestionsDropdown({
  isOpen,
  inputValue,
  matchingJobTitles,
  matchingSkills,
  focusedIndex,
  onSelect,
  onHoverItem,
}: SuggestionsDropdownProps) {
  if (!isOpen || !inputValue.trim()) return null

  const totalSuggestionsLength =
    matchingJobTitles.length + matchingSkills.length

  if (totalSuggestionsLength === 0) {
    return null
  }

  return (
    <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full rounded-md border border-slate-200 bg-white/95 backdrop-blur-md py-1 shadow-lg max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
      {/* Job Titles Section */}
      {matchingJobTitles.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase select-none bg-slate-50/50">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            {m.suggestions_job_titles_label()}
          </div>
          <div className="py-0.5">
            {matchingJobTitles.map((item, idx) => {
              const isFocused = focusedIndex === idx
              return (
                <div
                  key={item.value}
                  onClick={() => onSelect(item.value)}
                  onMouseEnter={() => onHoverItem(idx)}
                  className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer transition-colors duration-150 ${
                    isFocused
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {matchingSkills.length > 0 && (
        <div
          className={
            matchingJobTitles.length > 0 ? 'border-t border-slate-100' : ''
          }
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase select-none bg-slate-50/50">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            {m.suggestions_skills_label()}
          </div>
          <div className="py-0.5">
            {matchingSkills.map((item, idx) => {
              const overallIdx = matchingJobTitles.length + idx
              const isFocused = focusedIndex === overallIdx
              return (
                <div
                  key={item.value}
                  onClick={() => onSelect(item.value)}
                  onMouseEnter={() => onHoverItem(overallIdx)}
                  className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer transition-colors duration-150 ${
                    isFocused
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default SuggestionsDropdown
