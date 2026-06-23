import Avatar from '@/presentation/components/ui/avatar'
import StatusBadge from '@/presentation/components/ui/StatusBadge'
import { Button } from '@/presentation/components/ui/button'
import { Download, X, FileText, GraduationCap, Bookmark } from 'lucide-react'
import PdfViewer from '@/presentation/components/PDFViewer'
import { useState, useEffect } from 'react'
import { useCvEdit } from '@/presentation/hooks/cv/useCvEdit'
import { type CvItem } from '@/domain/models/Cv'

export interface CVDetailProps {
  cv: CvItem
  pdfUrl?: string
  onClose?: () => void
  onUpdated?: (updatedCv: CvItem) => void
}

export default function CvDetail({
  cv,
  pdfUrl,
  onClose,
  onUpdated,
}: CVDetailProps) {
  const { updateCv, isLoading: isUpdating } = useCvEdit()
  const [isMark, setIsMark] = useState(!!cv.is_marked)
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({})
  const [shouldClose, setShouldClose] = useState(false)
  const [formState, setFormState] = useState<{
    full_name: string
    email: string
    phone: string
    address: string
    position: string
    notes: string
    tag: string
    is_marked: boolean
  }>({
    full_name: cv.full_name,
    email: cv.email,
    phone: cv.phone,
    address: cv.address,
    position: cv.position,
    notes: cv.notes ?? '',
    tag: cv.tag ?? '',
    is_marked: cv.is_marked ?? false,
  })

  // Close modal only when mutation is truly complete
  useEffect(() => {
    if (shouldClose && !isUpdating) {
      onClose?.()
      setShouldClose(false)
    }
  }, [shouldClose, isUpdating, onClose])

  useEffect(() => {
    setFormState({
      full_name: cv.full_name,
      email: cv.email,
      phone: cv.phone,
      address: cv.address,
      position: cv.position,
      notes: cv.notes ?? '',
      tag: cv.tag ?? '',
      is_marked: cv.is_marked ?? false,
    })
    setIsMark(!!cv.is_marked)
  }, [cv])

  const toggleEdit = (field: keyof typeof formState) => {
    setEditMode((prev) => {
      const nextState = !prev[field]
      if (!nextState) {
        setFormState((current) => ({
          ...current,
          [field]: cv[field] ?? current[field],
        }))
      }
      return {
        ...prev,
        [field]: nextState,
      }
    })
  }

  const handleChange = (
    field: keyof typeof formState,
    value: string | boolean,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    if (!isDirty) return

    const payload = {
      id: cv.cv_infos_id,
      full_name: formState.full_name,
      email: formState.email,
      phone: formState.phone,
      address: formState.address,
      position: formState.position,
      notes: formState.notes,
      is_marked: formState.is_marked,
    }

    updateCv(
      payload,
      (response) => {
        if (response?.data) {
          onUpdated?.(response.data)
        }
        setEditMode({})
        setShouldClose(true)
      },
      () => {
        // Handle update failure if necessary
      },
    )
  }

  const isDirty =
    formState.full_name !== cv.full_name ||
    formState.email !== cv.email ||
    formState.phone !== cv.phone ||
    formState.address !== cv.address ||
    formState.position !== cv.position ||
    formState.notes !== (cv.notes ?? '') ||
    formState.tag !== (cv.tag ?? '') ||
    formState.is_marked !== (cv.is_marked ?? false)

  const name = formState.full_name || 'Unknown'
  const title = formState.position || 'Candidate'
  const email = formState.email || ''
  const phone = formState.phone || ''
  const location = formState.address || ''
  // const education = Array.isArray(cv?.educations) ? cv?.educations.join(', ') : ''
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
            <StatusBadge status={(formState.tag || 'new') as any} />

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
          <div className="col-span-1 border border-slate-200 min-h-0 flex flex-col">
            {/* Info Header */}
            <div className="border border-slate-200 px-5">
              <div className="w-30 py-3 flex items-center justify-center text-sm font-semibold text-accent border-b-2 border-accent">
                <FileText className="h-4 w-4 inline-block mr-1" />
                Information
              </div>
            </div>

            {/* Info Content */}
            <div className="p-5 bg-[#F1F5F9] overflow-y-auto flex-1">
              <div className="mb-3">
                <div className="text-xs text-slate-400 flex items-center justify-between gap-2">
                  <span>Họ và tên</span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-accent cursor-pointer"
                    onClick={() => toggleEdit('full_name')}
                  >
                    {editMode.full_name ? 'Hủy' : 'Sửa'}
                  </button>
                </div>
                {editMode.full_name ? (
                  <input
                    value={formState.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                ) : (
                  <div className="mt-1 rounded-md bg-slate-50 px-3 py-2 text-sm">
                    {name}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <div className="text-xs text-slate-400 flex items-center justify-between gap-2">
                  <span>Email</span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-accent cursor-pointer"
                    onClick={() => toggleEdit('email')}
                  >
                    {editMode.email ? 'Hủy' : 'Sửa'}
                  </button>
                </div>
                {editMode.email ? (
                  <input
                    value={formState.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                ) : (
                  <div className="mt-1 rounded-md bg-slate-50 px-3 py-2 text-sm">
                    {email}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <div className="text-xs text-slate-400 flex items-center justify-between gap-2">
                  <span>Số điện thoại</span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-accent cursor-pointer"
                    onClick={() => toggleEdit('phone')}
                  >
                    {editMode.phone ? 'Hủy' : 'Sửa'}
                  </button>
                </div>
                {editMode.phone ? (
                  <input
                    value={formState.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                ) : (
                  <div className="mt-1 rounded-md bg-slate-50 px-3 py-2 text-sm">
                    {phone}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <div className="text-xs text-slate-400 flex items-center justify-between gap-2">
                  <span>Địa điểm</span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-accent cursor-pointer"
                    onClick={() => toggleEdit('address')}
                  >
                    {editMode.address ? 'Hủy' : 'Sửa'}
                  </button>
                </div>
                {editMode.address ? (
                  <input
                    value={formState.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                ) : (
                  <div className="mt-1 rounded-md bg-slate-50 px-3 py-2 text-sm">
                    {location}
                  </div>
                )}
              </div>

              {cv?.educations && (
                <div className="mb-3">
                  <div className="text-xs text-slate-400">Học vấn</div>
                  <div className="mt-1 rounded-md bg-slate-50 px-3 py-2 text-sm">
                    {cv.educations.map((edu, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <GraduationCap className="h-6 w-6 inline-block mr-1" />
                        <span>
                          {edu?.degree} - {edu?.university}{' '}
                          {edu?.graduation_year}
                        </span>
                      </div>
                    ))}
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

              {/* Favorites Section */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="text-xs text-slate-400 flex items-center justify-between gap-2">
                  <span>ĐÁNH DẤU</span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-accent cursor-pointer"
                    onClick={() => {
                      const nextMark = !isMark
                      setIsMark(nextMark)
                      handleChange('is_marked', nextMark)
                      setEditMode((prev) => ({
                        ...prev,
                        is_marked: true,
                      }))
                    }}
                  ></button>
                </div>
                <Button
                  variant={isMark ? 'accent' : 'ghost'}
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => {
                    const nextMark = !isMark
                    setIsMark(nextMark)
                    handleChange('is_marked', nextMark)
                    setEditMode((prev) => ({
                      ...prev,
                      is_marked: true,
                    }))
                  }}
                >
                  <Bookmark
                    className={`h-4 w-4 ${isMark ? 'fill-white text-white' : ''}`}
                  />
                  {isMark ? 'Đã đánh dấu' : 'Đánh dấu'}
                </Button>
              </div>

              {/* Notes Section */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="text-xs text-slate-400 flex items-center justify-between gap-2">
                  <span>GHI CHÚ</span>
                </div>
                <textarea
                  value={formState.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  onClick={() => {
                    if (!editMode.notes) {
                      setEditMode((prev) => ({ ...prev, notes: true }))
                    }
                  }}
                  readOnly={!editMode.notes}
                  placeholder="Nhập nhận xét, đánh giá hoặc lưu ý về ứng viên này..."
                  className={`w-full h-24 p-3 border border-slate-200 rounded-sm text-sm resize-none ${
                    editMode.notes
                      ? 'focus:outline-none focus:ring-2 focus:ring-accent bg-white'
                      : 'bg-slate-50'
                  }`}
                />
              </div>

              <div className="mt-4 flex gap-3">
                <Button
                  variant="accent"
                  className="flex-1"
                  onClick={handleSave}
                  disabled={isUpdating || !isDirty}
                >
                  {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => {
                    setFormState({
                      full_name: cv.full_name,
                      email: cv.email,
                      phone: cv.phone,
                      address: cv.address,
                      position: cv.position,
                      notes: cv.notes ?? '',
                      tag: cv.tag ?? '',
                      is_marked: cv.is_marked ?? false,
                    })
                    setEditMode({})
                  }}
                  disabled={isUpdating}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
