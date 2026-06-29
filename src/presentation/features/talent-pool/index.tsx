import { useState } from 'react'
import { BookmarkCheck } from 'lucide-react'
import { useTalentPool } from '@/presentation/hooks/cv/useTalentPool'
import { type CvItem } from '@/domain/models/Cv'
import { Pagination } from '@/presentation/components/ui/pagination'
import CvTable from '@/presentation/features/cv/list/cv-table'
import CvDetail from '@/presentation/features/cv/CvDetail'
import { SkeletonTable } from '@/presentation/components/ui/skeleton'

export default function TalentPoolPage() {
  const { items, total, totalPages, page, setPage, limit, isLoading } =
    useTalentPool()
  const [selectedCv, setSelectedCv] = useState<CvItem | null>(null)

  const cvs = items as CvItem[]

  return (
    <main className="space-y-6 overflow-y-auto">
      {/* Page header */}
      {/* <div>
        <h1 className="text-2xl font-bold text-slate-900">Talent Pool</h1>
        <p className="mt-1 text-sm text-gray-500">
          Danh sách ứng viên tiềm năng đã được đánh dấu
        </p>
      </div> */}

      <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        {/* Card header */}
        <div className="flex items-center gap-3 mb-5">
          <BookmarkCheck className="h-4 w-4 text-accent" />
          <span className="text-md font-medium text-slate-700">
            Ứng viên tiềm năng
          </span>
          <span className="w-fit bg-[#CCFBF1] text-accent px-2 py-1 rounded-full text-[10px]">
            {total}
          </span>
        </div>

        {/* Table */}
        {isLoading && <SkeletonTable rows={8} cols={7} />}

        {!isLoading && cvs.length === 0 && (
          <div className="rounded-[22px] border border-dashed border-slate-200 p-8 text-center text-slate-500">
            Chưa có ứng viên nào được đánh dấu là Talent.
          </div>
        )}

        {!isLoading && cvs.length > 0 && (
          <CvTable
            data={cvs}
            loading={isLoading}
            onRowClick={(cv) => setSelectedCv(cv as CvItem)}
            height={'63vh'}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              total={total}
              limit={limit}
            />
          </div>
        )}
      </section>

      {/* CV Detail modal */}
      {selectedCv && (
        <CvDetail
          cv={selectedCv}
          pdfUrl={selectedCv?.cv_file?.file_url ?? ''}
          onClose={() => setSelectedCv(null)}
          onUpdated={(updated) => {
            setSelectedCv(updated)
          }}
        />
      )}
    </main>
  )
}
