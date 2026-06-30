import { useState } from 'react'
import Table from '@/presentation/components/ui/table/table'
import type { CvItem } from '@/domain/models/Cv'
import type { TableColumn } from '@/presentation/components/ui/table/table.types'
import { EvaluationScoreModal } from '@/presentation/components/score-modal'
import useModal from '@/presentation/hooks/useModal'
import { Button } from '@/presentation/components/ui/button'
import { Bookmark, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMarkAsTalent } from '@/presentation/hooks/cv/useMarkAsTalent'
import { m } from '@/paraglide/messages'

type Props = {
  data: CvItem[]
  loading?: boolean
  height: string
  onRowClick?: (cv: CvItem) => void
  onMarkChange?: (updatedCv: CvItem) => void
}

export default function CvTable({
  data,
  loading,
  height,
  onRowClick,
  onMarkChange,
}: Props) {
  const scoreModal = useModal()
  const [selectedCv, setSelectedCv] = useState<CvItem | null>(null)
  const { markAsTalent, isPending: isMarkingTalent } = useMarkAsTalent()
  // Track optimistic mark state per cv_infos_id
  const [markOverrides, setMarkOverrides] = useState<Record<number, boolean>>(
    {},
  )

  const handleBookmarkClick = (e: React.MouseEvent, cv: CvItem) => {
    e.stopPropagation()
    const currentMark = markOverrides[cv.cv_infos_id] ?? cv.is_marked ?? false
    const nextMark = !currentMark
    // Optimistic update
    setMarkOverrides((prev) => ({ ...prev, [cv.cv_infos_id]: nextMark }))
    markAsTalent(
      cv.cv_infos_id,
      nextMark,
      (response) => {
        if (response?.data) onMarkChange?.(response.data)
      },
      () => {
        // Revert on error
        setMarkOverrides((prev) => ({ ...prev, [cv.cv_infos_id]: currentMark }))
        toast.error(m.cv_table_bookmark_error())
      },
    )
  }

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
        toast.error(m.cv_table_no_pdf())
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
      toast.error(m.cv_table_download_error())
    }
  }

  const columns: TableColumn<CvItem>[] = [
    {
      key: 'score',
      title: m.cv_table_col_score(),
      width: 'w-14',
      render: (cv: CvItem) => (
        <div
          onClick={(e) => handleScoreClick(e as React.MouseEvent, cv)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-accent font-semibold cursor-pointer hover:bg-emerald-200 transition-colors"
        >
          {cv.scores.offline_score ?? (
            <span className="text-xs text-slate-400">{m.common_none()}</span>
          )}
        </div>
      ),
    },
    {
      key: 'candidate',
      title: m.cv_table_col_name(),
      width: 'w-32',
      render: (cv: CvItem) => (
        <span className="text-sm font-semibold text-slate-900 truncate">
          {cv.full_name || (
            <span className="font-normal text-slate-400 italic">
              {m.common_unknown()}
            </span>
          )}
        </span>
      ),
    },
    {
      key: 'position',
      title: m.cv_table_col_job_title(),
      width: 'w-28',
      render: (cv: CvItem) =>
        cv.position ? (
          <span className="text-sm text-slate-700 truncate">{cv.position}</span>
        ) : (
          <span className="text-sm text-slate-400 italic">
            {m.common_no_title()}
          </span>
        ),
    },
    {
      key: 'skills',
      title: m.cv_table_col_skills(),
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
      title: m.cv_table_col_exp(),
      width: 'w-12',
      render: (cv: CvItem) =>
        cv.total_experience_years ? (
          <span className="text-sm">{cv.total_experience_years}y</span>
        ) : (
          <span className="text-sm text-slate-400">{m.common_none()}</span>
        ),
    },
    {
      key: 'summary',
      title: m.cv_table_col_summary(),
      width: 'w-72',
      render: (cv: CvItem) =>
        cv.summary ? (
          <span className="text-sm truncate inline-block text-wrap">
            {cv.summary.length < 300
              ? cv.summary
              : cv.summary.substring(0, 300) + '...'}
          </span>
        ) : (
          <span className="text-sm text-slate-400 italic">
            {m.common_no_summary()}
          </span>
        ),
    },
    {
      key: 'actions',
      title: m.cv_table_col_actions(),
      width: 'w-20',
      render: (cv: CvItem) => {
        const isMarked = markOverrides[cv.cv_infos_id] ?? cv.is_marked ?? false
        return (
          <div className="flex gap-1.5 whitespace-nowrap">
            <Button
              variant={isMarked ? 'accent' : 'default'}
              className="h-8 px-2 text-xs rounded-sm!"
              disabled={isMarkingTalent}
              onClick={(e) => handleBookmarkClick(e, cv)}
            >
              <Bookmark
                className={`h-4 w-4 ${isMarked ? 'fill-white text-white' : 'fill-white text-accent'}`}
              />
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
        emptyText={m.cv_table_empty()}
        tableClassName="w-full"
        height={height}
        minRows={5}
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
