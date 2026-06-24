import { useState } from 'react'
import Table from '@/presentation/components/ui/table/table'
import type { CvItem } from '@/domain/models/Cv'
import type { TableColumn } from '@/presentation/components/ui/table/table.types'
import { EvaluationScoreModal } from '@/presentation/components/score-modal'
import useModal from '@/presentation/hooks/useModal'
import { Button } from '@/presentation/components/ui/button'
import { Download, Star } from 'lucide-react'
import toast from 'react-hot-toast'

type Props = {
  data: CvItem[]
  loading?: boolean
  onRowClick?: (cv: CvItem) => void
}

export default function CvTable({ data, loading, onRowClick }: Props) {
  const scoreModal = useModal()
  const [selectedCv, setSelectedCv] = useState<CvItem | null>(null)

  const handleScoreClick = (e: React.MouseEvent, cv: CvItem) => {
    e.stopPropagation()
    setSelectedCv(cv)
    scoreModal.open()
  }

  const handleDownload = async (
    e: React.MouseEvent<HTMLButtonElement>,
    cv: CvItem,
  ) => {
    e.stopPropagation()
    try {
      const pdfUrl = cv.cv_file?.file_url ?? ''
      if (!pdfUrl) {
        toast.error('No PDF URL available for this CV')
        return
      }
      const response = await fetch(pdfUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cv.full_name}_CV.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch {
      toast.error('Failed to download CV')
    }
  }

  // Create columns dynamically to access state
  const columns: TableColumn<CvItem>[] = [
    {
      key: 'score',
      title: 'SCORE',
      width: 'w-14',
      render: (cv: CvItem) => (
        <div
          onClick={(e) => handleScoreClick(e as React.MouseEvent, cv)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-accent font-semibold cursor-pointer hover:bg-emerald-200 transition-colors"
        >
          {cv.scores.offline_score ?? '-'}
        </div>
      ),
    },
    {
      key: 'candidate',
      title: 'NAME',
      width: 'w-32',
      render: (cv: CvItem) => (
        <span className="text-sm font-semibold text-slate-900 truncate">
          {cv.full_name}
        </span>
      ),
    },
    {
      key: 'position',
      title: 'JOB TITLE',
      width: 'w-28',
      render: (cv: CvItem) => (
        <span className="text-sm text-slate-700 truncate">
          {cv.position ?? '—'}
        </span>
      ),
    },
    {
      key: 'skills',
      title: 'SKILLS',
      width: 'w-40',
      render: (cv: CvItem) => (
        <div className="flex flex-wrap gap-1">
          {(cv.skills ?? []).slice(0, 2).map((skill: string) => (
            <span
              key={skill}
              className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-700 truncate"
            >
              {skill}
            </span>
          ))}

          {(cv.skills?.length ?? 0) > 2 && (
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500">
              +{cv.skills!.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'exp',
      title: 'EXP',
      width: 'w-12',
      render: (cv: CvItem) => (
        <span className="text-sm">
          {cv.total_experience_years ? `${cv.total_experience_years}y` : '—'}
        </span>
      ),
    },
    {
      key: 'workType',
      title: 'WORK TYPE',
      width: 'w-24',
      render: (cv: CvItem) =>
        cv.work_type ? (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 truncate inline-block">
            {cv.work_type}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'actions',
      title: 'ACTIONS',
      width: 'w-20',
      render: (cv: CvItem) => {
        return (
          <div className="flex gap-1.5 whitespace-nowrap">
            <Button
              variant="default"
              className="h-8 px-2 text-xs rounded-sm! text-accent!"
            >
              <Star className="h-4 w-4" />
            </Button>

            <Button
              variant="default"
              className="h-8 px-2 text-xs rounded-sm! text-accent!"
              onClick={(e) => handleDownload(e, cv)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <Table<CvItem>
        data={data}
        columns={columns}
        rowKey="cv_file_id"
        loading={loading}
        emptyText="No CV found"
        tableClassName="w-full"
        maxHeight="45vh"
        onRowClick={onRowClick}
      />
      {selectedCv && (
        <EvaluationScoreModal
          isOpen={scoreModal.isOpen}
          onClose={scoreModal.close}
          cv={selectedCv}
        />
      )}
    </>
  )
}
