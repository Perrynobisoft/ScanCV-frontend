import Avatar from '@/presentation/components/ui/avatar'
import { Button } from '@/presentation/components/ui/button'
import { Download, X, FileText } from 'lucide-react'
import PdfViewer from '@/presentation/components/PDFViewer'

export interface CVDetailProps {
  cv: any
  pdfUrl?: string
  onClose?: () => void
}

export default function CvDetail({ cv, pdfUrl, onClose }: CVDetailProps) {
  const name = cv?.full_name || cv?.name || 'Unknown'
  const title = cv?.position || cv?.title || 'Candidate'
  const email = cv?.email || ''
  const phone = cv?.phone || cv?.phone_number || ''
  const location = cv?.location || cv?.address || ''
  const education = cv?.education || ''
  const skills: string[] = (cv?.skills as string[]) || []
  const certifications: string[] = cv?.certifications || []

  return (
    <div className="h-full fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 flex flex-col h-[90vh] w-[90vw] overflow-hidden rounded-md bg-white">
        {/* PDF Header */}
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar name={name} />
            <div>
              <div className="text-lg font-semibold">{name}</div>
              <div className="text-sm text-slate-500">{title}</div>
            </div>
          </div>

          <div className="flex shrink-0">
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="grid grid-cols-3 min-h-0 flex-1">
          {/* PDF */}
          <div className="col-span-2 flex min-h-0 flex-1 flex-col">
            {/* Tool bar */}
            <div className="px-3 py-2 border border-slate-200 flex items-center justify-between bg-[#F1F5F9]">
              <div className="flex gap-2 items-center text-sm font-semibold text-slate-600">
                <FileText className="h-4 w-4 text-accent" />
                <span>CV Preview — {name}</span>
              </div>
              <a
                href={pdfUrl}
                download
                className="flex items-center justify-center gap-2 py-1 px-2 text-accent rounded-sm border border-slate-200 hover:bg-white/50 trasition"
              >
                <Download className="h-4 w-4" />
                <span className="">Tải xuống</span>
              </a>
            </div>
            <div className="min-h-0 flex-1">
              <PdfViewer pdfUrl={pdfUrl} />
            </div>
          </div>

          {/* Information */}
          <div className="col-span-1 border border-slate-200">
            {/* Info Header */}
            <div className="border border-slate-200 px-5">
              <div className="w-30 py-3 flex items-center justify-center text-sm font-semibold text-accent border-b-2 border-accent">
                <FileText className="h-4 w-4 inline-block mr-1" />
                Information
              </div>
            </div>

            {/* Info Content */}
            <div className="p-5 bg-[#F1F5F9]">
              <div className="mb-3">
                <div className="text-xs text-slate-400">Họ và tên</div>
                <div className="mt-1 rounded-md bg-slate-50 px-3 py-2 text-sm">
                  {name}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs text-slate-400">Email</div>
                <div className="mt-1 rounded-md bg-slate-50 px-3 py-2 text-sm">
                  {email}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs text-slate-400">Số điện thoại</div>
                <div className="mt-1 rounded-md bg-slate-50 px-3 py-2 text-sm">
                  {phone}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs text-slate-400">Địa điểm</div>
                <div className="mt-1 rounded-md bg-slate-50 px-3 py-2 text-sm">
                  {location}
                </div>
              </div>

              {education && (
                <div className="mb-3">
                  <div className="text-xs text-slate-400">Học vấn</div>
                  <div className="mt-1 rounded-md bg-slate-50 px-3 py-2 text-sm">
                    {education}
                  </div>
                </div>
              )}

              {skills.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-slate-400">Kỹ năng</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {certifications.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-slate-400">Chứng chỉ</div>
                  <div className="mt-2 flex flex-col gap-2">
                    {certifications.map((c: string) => (
                      <div
                        key={c}
                        className="rounded-md bg-slate-50 px-3 py-2 text-sm"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
