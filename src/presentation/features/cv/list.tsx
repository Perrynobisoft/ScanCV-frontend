import { useMemo, useState } from 'react'
import { useSearchCv } from '@/presentation/hooks/cv/useSearchCv'
import { useCvList } from '@/presentation/hooks/cv/useCvList'
import { formatDate } from '@/shared/date'
import { type CvItem } from '@/domain/models/Cv'
import { SearchMode, SEARCH_MODE_OPTIONS } from '@/shared/enums/SearchMode'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Select } from '@/presentation/components/ui/select'
import Avatar from '@/presentation/components/ui/avatar'
import { m } from '@/paraglide/messages'
import { Pagination } from '@/presentation/components/ui/pagination'

export default function CvListPage() {
  const [searchMode, setSearchMode] = useState<SearchMode>(SearchMode.Keyword)
  const [keywordInput, setKeywordInput] = useState('')
  const [keywordQuery, setKeywordQuery] = useState<string | undefined>(
    undefined,
  )

  const aiSearch = useSearchCv()
  const keywordSearch = useCvList(keywordQuery)

  const activeSearch = searchMode === 'ai' ? aiSearch : keywordSearch
  const searchValue = searchMode === 'ai' ? aiSearch.searchValue : keywordInput

  const handleSearch = (query?: string) => {
    const value = query ?? searchValue
    if (searchMode === SearchMode.Ai) {
      aiSearch.handleSearch(value)
    } else {
      setKeywordQuery(value)
    }
  }

  const handleInputChange = (value: string) => {
    if (searchMode === SearchMode.Ai) {
      aiSearch.setSearchValue(value)
    } else {
      setKeywordInput(value)
    }
  }

  const { page, setPage, items, total, totalPages, isLoading } = activeSearch
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const filteredCvs = useMemo(() => items as CvItem[], [items])

  const toggleSelect = (id: number) => {
    setSelectedIds((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    )
  }

  return (
    <main className="max-w-300 mx-auto mt-8 p-6">
      {/* Top search banner (Tailwind) */}
      <section className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
        <div className="flex gap-3 items-center w-full">
          <Input
            placeholder="Find senior Java developers with AWS experience in Seattle..."
            value={searchValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <Select
              value={searchMode}
              onChange={(e) => setSearchMode(e.target.value as SearchMode)}
              options={SEARCH_MODE_OPTIONS}
              className="w-56 py-3"
            />
            <Button
              onClick={() => handleSearch()}
              variant="primary"
              className="py-3"
            >
              Search →
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold">{m.cv_talent_workspace()}</h2>
            <p className="text-sm text-gray-500">
              {m.cv_showing({ count: filteredCvs.length })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="default">Bulk Upload</Button>
            <Button variant="primary">Upload CV</Button>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-white">
                <th className="p-3 text-left w-10">
                  <input
                    type="checkbox"
                    aria-label="select all"
                    checked={
                      selectedIds.length === filteredCvs.length &&
                      filteredCvs.length > 0
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? filteredCvs.map((c) => c.id) : [],
                      )
                    }
                  />
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-500">
                  Candidate name
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-500">
                  Position
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-500">
                  Skills
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-500">
                  Upload date
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-500">
                  Owner
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredCvs.map((cv) => (
                <tr key={cv.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(cv.id)}
                      onChange={() => toggleSelect(cv.id)}
                    />
                  </td>
                  <td className="p-3 flex items-center gap-3">
                    <Avatar name={cv.full_name} />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {cv.full_name}
                      </div>
                      <div className="text-sm text-gray-500">{cv.email}</div>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-700 capitalize">
                    {cv.position}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 flex-wrap">
                      {(cv.skills ?? []).slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="bg-gray-100 text-sm px-2 py-1 rounded-full text-gray-800"
                        >
                          {skill}
                        </span>
                      ))}
                      {(cv.skills ?? []).length > 3 && (
                        <span className="text-sm text-gray-500">
                          +{(cv.skills ?? []).length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {formatDate(cv.created_at)}
                  </td>
                  <td className="p-3 text-sm text-gray-900">
                    {cv.uploaded_by?.full_name ?? 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isLoading && (
            <div className="p-5 text-center text-gray-500">Loading...</div>
          )}

          {!isLoading && filteredCvs.length === 0 && (
            <div className="p-5 text-center text-gray-500">
              {m.cv_no_match()}
            </div>
          )}

          <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-500">
              Showing {filteredCvs.length} of {total} candidates
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
