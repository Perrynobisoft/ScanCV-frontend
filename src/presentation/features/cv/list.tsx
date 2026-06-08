import { useMemo, useState } from 'react'
import { useCvList } from '@/presentation/hooks/cv/useCvList'
import { useRepository } from '@/di/RepositoriesProvider'
import type { CvItem } from '@/domain/models/Cv'
import { formatDate } from '@/shared/date'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import Avatar from '@/presentation/components/ui/avatar'
import { m } from '@/paraglide/messages'

export default function CvListPage() {
  const { data: cvs } = useCvList()
  const { cvRepository } = useRepository()
  const [searchValue, setSearchValue] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [apiCvs, setApiCvs] = useState<CvItem[] | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const searchApi = cvRepository.search()

  const filteredCvs = useMemo(() => {
    // Only use API results when available. Otherwise show the full mock list.
    if (apiCvs) return apiCvs
    return cvs
  }, [cvs, apiCvs])

  const toggleSelect = (id: number) => {
    setSelectedIds((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    )
  }

  const handleSearch = async (query?: string) => {
    const q = query ?? searchValue
    setApiError(null)
    try {
      const response = await searchApi.mutateAsync({ query: q })
      const searchResults = Array.isArray(response?.data) ? response.data : []

      setApiCvs(searchResults)
    } catch (err: any) {
      setApiError(err?.error?.message || err?.message || 'API error')
      setApiCvs(null)
    }
  }

  return (
    <main className="max-w-300 mx-auto mt-8 p-6">
      {/* Top search banner (Tailwind) */}
      <section className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
        <div className="flex gap-3 items-center w-full">
          <Input
            placeholder="Find senior Java developers with AWS experience in Seattle..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={() => handleSearch()}
            variant="primary"
            className="py-3"
          >
            Search →
          </Button>
        </div>
        <div className="mt-3 text-sm text-gray-500">
          {m.cv_try_label()}
          <Button
            variant="ghost"
            className="text-blue-600 hover:underline mx-1 p-0"
            onClick={() => {
              setSearchValue('Recent PhD graduates in Machine Learning')
              handleSearch('Recent PhD graduates in Machine Learning')
            }}
          >
            "Recent PhD graduates in Machine Learning"
          </Button>
          <span className="text-gray-300">•</span>
          <Button
            variant="ghost"
            className="text-blue-600 hover:underline mx-1 p-0"
            onClick={() => {
              setSearchValue('Top 10% React developers from last month')
              handleSearch('Top 10% React developers from last month')
            }}
          >
            "Top 10% React developers from last month"
          </Button>
        </div>

        {apiError && (
          <div className="mt-3 text-sm text-red-500">{apiError}</div>
        )}
      </section>

      <section className="flex items-center justify-between gap-4 my-4">
        <div className="flex gap-2 items-center flex-wrap">
          <div className="text-sm font-semibold text-gray-500">
            {m.cv_filters()}
          </div>
          <div className="bg-gray-50 border border-gray-100 px-2 py-1 rounded-md text-sm text-gray-800 flex items-center gap-2">
            Ownership: All
            <Button
              variant="ghost"
              className="text-gray-400 px-1 py-0 hover:bg-transparent"
            >
              ✕
            </Button>
          </div>
          <div className="bg-gray-50 border border-gray-100 px-2 py-1 rounded-md text-sm text-gray-800 flex items-center gap-2">
            Position: Engineering
            <Button
              variant="ghost"
              className="text-gray-400 px-1 py-0 hover:bg-transparent"
            >
              ✕
            </Button>
          </div>
          <Button
            variant="ghost"
            className="text-blue-600 font-semibold bg-transparent hover:bg-gray-100"
          >
            {m.cv_add_filter()}
          </Button>
        </div>

        {/* <div>
          <Button variant="default" className="mr-2">Filters</Button>
        </div> */}
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
                    <Avatar name={cv.candidateName} />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {cv.candidateName}
                      </div>
                      <div className="text-sm text-gray-500">{cv.email}</div>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-700">{cv.position}</td>
                  <td className="p-3">
                    <div className="flex gap-2 flex-wrap">
                      {cv.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="bg-gray-100 text-sm px-2 py-1 rounded-full text-gray-800"
                        >
                          {s}
                        </span>
                      ))}
                      {cv.skills.length > 3 && (
                        <span className="text-sm text-gray-500">
                          +{cv.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {formatDate(cv.uploadDate)}
                  </td>
                  <td className="p-3 flex items-center gap-2 text-sm text-gray-900">
                    <Avatar name={cv.owner} size={28} />
                    <div className="text-sm text-gray-900">{cv.owner}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCvs.length === 0 && (
            <div className="p-5 text-center text-gray-500">
              {m.cv_no_match()}
            </div>
          )}

          {/* Footer pagination mock */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing 1-15 of {filteredCvs.length} candidates
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="px-2 py-1 border border-gray-200"
              >
                &lt;
              </Button>
              <Button variant="primary" className="px-3 py-1">
                1
              </Button>
              <Button
                variant="ghost"
                className="px-3 py-1 border border-gray-200"
              >
                2
              </Button>
              <Button
                variant="ghost"
                className="px-3 py-1 border border-gray-200"
              >
                3
              </Button>
              <Button
                variant="ghost"
                className="px-2 py-1 border border-gray-200"
              >
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
