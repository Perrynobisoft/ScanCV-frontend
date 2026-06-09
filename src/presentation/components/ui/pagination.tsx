import { Button } from './button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = []
  const startPage = Math.max(1, currentPage - 2)
  const endPage = Math.min(totalPages, currentPage + 2)

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        className="px-2 py-1 border border-gray-200"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        ‹
      </Button>

      {startPage > 1 && (
        <Button
          variant="ghost"
          className="px-3 py-1 border border-gray-200"
          onClick={() => onPageChange(1)}
        >
          1
        </Button>
      )}

      {startPage > 2 && <span className="px-2">…</span>}

      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'primary' : 'ghost'}
          className={
            page === currentPage
              ? 'px-3 py-1'
              : 'px-3 py-1 border border-gray-200'
          }
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {endPage < totalPages - 1 && <span className="px-2">…</span>}

      {endPage < totalPages && (
        <Button
          variant="ghost"
          className="px-3 py-1 border border-gray-200"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Button>
      )}

      <Button
        variant="ghost"
        className="px-2 py-1 border border-gray-200"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        ›
      </Button>
    </div>
  )
}
