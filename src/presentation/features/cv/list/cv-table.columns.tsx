import Avatar from '@/presentation/components/ui/avatar'
import { Button } from '@/presentation/components/ui/button'
import { formatDate } from '@/shared/date'
import type { TableColumn } from '@/presentation/components/ui/table/table.types'
import type { CvItem } from './cv-table.types'
import { Download } from 'lucide-react'

export const cvColumns: TableColumn<CvItem>[] = [
  {
    key: 'candidate',
    title: 'CANDIDATE',
    width: 'w-[260px]',
    render: (cv: CvItem) => (
      <div className="flex items-start gap-3">
        <Avatar name={cv.full_name} />

        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">
            {cv.full_name}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {formatDate(cv.created_at)}
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'position',
    title: 'APPLIED POSITION',
    width: 'w-[180px]',
    render: (cv: CvItem) => (
      <span className="text-sm text-slate-700">{cv.position ?? '—'}</span>
    ),
  },
  {
    key: 'email',
    title: 'EMAIL',
    width: 'w-[220px]',
    render: (cv: CvItem) => (
      <span className="whitespace-nowrap text-sm text-slate-700">
        {cv.email ?? '—'}
      </span>
    ),
  },
  {
    key: 'phone',
    title: 'PHONE',
    width: 'w-[140px]',
    render: (cv: CvItem) => (
      <span className="whitespace-nowrap text-sm text-slate-700">
        {cv.phone ?? '—'}
      </span>
    ),
  },
  {
    key: 'skills',
    title: 'MAIN SKILLS',
    width: 'w-[260px]',
    render: (cv: CvItem) => (
      <div className="flex flex-wrap gap-1.5">
        {(cv.skills ?? []).slice(0, 3).map((skill: string) => (
          <span
            key={skill}
            className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-700"
          >
            {skill}
          </span>
        ))}

        {(cv.skills?.length ?? 0) > 3 && (
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500">
            +{cv.skills!.length - 3}
          </span>
        )}
      </div>
    ),
  },
  {
    key: 'workStyle',
    title: 'WORK STYLE',
    width: 'w-[120px]',
    render: (cv: CvItem) =>
      cv.work_style ? (
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {cv.work_style}
        </span>
      ) : (
        '—'
      ),
  },
  {
    key: 'exp',
    title: 'EXP',
    width: 'w-[80px]',
    render: (cv: CvItem) => (
      <span>{cv.experience_years ? `${cv.experience_years}y` : '—'}</span>
    ),
  },
  {
    key: 'status',
    title: 'STATUS',
    width: 'w-[120px]',
    render: (cv: CvItem) => (
      <Button variant="default" className="rounded-sm">
        {cv.status ?? 'Yêu thích'}
      </Button>
    ),
  },
  {
    key: 'actions',
    title: 'ACTIONS',
    width: 'w-[160px]',
    render: () => (
      <div className="flex gap-2 whitespace-nowrap">
        {/* <Button variant="default" className="h-8 px-3 text-xs rounded-sm! text-accent!">
          <Eye className='h-4 w-4' />
          View
        </Button> */}

        <Button
          variant="default"
          className="h-8 px-3 text-xs rounded-sm! text-accent!"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    ),
  },
]
