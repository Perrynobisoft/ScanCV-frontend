import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { m } from '@/paraglide/messages'
import { useLocale } from '@/presentation/provider/locale/locale-provider'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  total?: number
  limit?: number
  itemLabel?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  total,
  limit,
  itemLabel,
}: PaginationProps) {
  useLocale() // re-render on locale change
  if (totalPages <= 1) return null

  // Tính số item đang hiển thị ở trang hiện tại
  const currentCount =
    total != null && limit != null
      ? currentPage < totalPages
        ? limit
        : total - limit * (currentPage - 1)
      : null

  const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)

    if (currentPage > 3) pages.push('ellipsis-start')

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)

    if (currentPage < totalPages - 2) pages.push('ellipsis-end')

    pages.push(totalPages)
  }

  const btnBase =
    'inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 select-none'
  const btnActive =
    'bg-accent text-white shadow-sm shadow-cyan-200 cursor-default'
  const btnInactive =
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200'
  const btnNav =
    'text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-slate-200'

  return (
    <div className="flex items-center">
      {/* Display text — left */}
      <div className="flex-1">
        {currentCount != null && total != null && (
          <p className="text-sm text-slate-500">
            {m.pagination_showing({
              current: currentCount,
              total,
              label: itemLabel ?? m.pagination_item_label_candidate(),
            })}
          </p>
        )}
      </div>

      {/* Page buttons — center */}
      <nav aria-label="Pagination" className="flex items-center gap-1">
        {/* Prev */}
        <button
          className={`${btnBase} ${btnNav}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        {pages.map((page, idx) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <span
                key={`${page}-${idx}`}
                className="inline-flex h-8 w-8 items-center justify-center text-slate-400"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            )
          }

          const isActive = page === currentPage
          return (
            <button
              key={page}
              className={`${btnBase} ${isActive ? btnActive : btnInactive}`}
              onClick={() => !isActive && onPageChange(page)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          )
        })}

        {/* Next */}
        <button
          className={`${btnBase} ${btnNav}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>

      {/* Spacer — right (mirrors left to keep center aligned) */}
      <div className="flex-1" />
    </div>
  )
}
