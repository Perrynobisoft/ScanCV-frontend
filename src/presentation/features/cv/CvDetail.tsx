import Avatar from '@/presentation/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'
import { Button } from '@/presentation/components/ui/button'
import {
  Download,
  X,
  FileText,
  GraduationCap,
  Bookmark,
  Pencil,
  User,
  Check,
} from 'lucide-react'
import PdfViewer from '@/presentation/components/PDFViewer'
import { useState, useEffect } from 'react'
import { useCvEdit } from '@/presentation/hooks/cv/useCvEdit'
import { useMarkAsTalent } from '@/presentation/hooks/cv/useMarkAsTalent'
import { type CvItem } from '@/domain/models/Cv'
import { CV_STATUS_LABELS } from '@/shared/constants'

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
  const { markAsTalent, isPending: isMarkingTalent } = useMarkAsTalent()
  const [isMark, setIsMark] = useState(!!cv.is_marked)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formState, setFormState] = useState<{
    full_name: string
    email: string
    phone: string
    address: string
    position: string
    note: string
    tag: string
    is_marked: boolean
    date_of_birth: string
    work_type: string
    total_experience_years: string | number
    summary: string
  }>({
    full_name: cv.full_name || '',
    email: cv.email || '',
    phone: cv.phone || '',
    address: cv.address || '',
    position: cv.position || '',
    note: cv.note ?? '',
    tag: cv.tag ?? '',
    is_marked: cv.is_marked ?? false,
    date_of_birth: cv.date_of_birth ?? '',
    work_type: cv.work_type ?? '',
    total_experience_years: cv.total_experience_years ?? '',
    summary: cv.summary ?? '',
  })

  useEffect(() => {
    setFormState({
      full_name: cv.full_name || '',
      email: cv.email || '',
      phone: cv.phone || '',
      address: cv.address || '',
      position: cv.position || '',
      note: cv.note ?? '',
      tag: cv.tag ?? '',
      is_marked: cv.is_marked ?? false,
      date_of_birth: cv.date_of_birth ?? '',
      work_type: cv.work_type ?? '',
      total_experience_years: cv.total_experience_years ?? '',
      summary: cv.summary ?? '',
    })
    setIsMark(!!cv.is_marked)
  }, [cv])

  const handleChange = (
    field: keyof typeof formState,
    value: string | boolean,
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancelEdit = () => {
    setFormState({
      full_name: cv.full_name || '',
      email: cv.email || '',
      phone: cv.phone || '',
      address: cv.address || '',
      position: cv.position || '',
      note: cv.note ?? '',
      tag: cv.tag ?? '',
      is_marked: cv.is_marked ?? false,
      date_of_birth: cv.date_of_birth ?? '',
      work_type: cv.work_type ?? '',
      total_experience_years: cv.total_experience_years ?? '',
      summary: cv.summary ?? '',
    })
    setIsEditMode(false)
  }

  const buildPayload = (overrides?: Partial<typeof formState>) => {
    const state = { ...formState, ...overrides }
    return {
      id: cv.cv_infos_id,
      full_name: state.full_name,
      email: state.email,
      phone: state.phone,
      address: state.address,
      position: state.position,
      note: state.note,
      is_marked: state.is_marked,
      tag: state.tag,
      date_of_birth: state.date_of_birth,
      work_type: state.work_type,
      total_experience_years:
        state.total_experience_years === ''
          ? undefined
          : Number(state.total_experience_years),
      summary: state.summary,
    }
  }

  // Inline tag change — saves immediately without entering edit mode
  const handleTagChange = (newTag: string) => {
    handleChange('tag', newTag)
    updateCv(
      buildPayload({ tag: newTag }),
      (response) => {
        if (response?.data) onUpdated?.(response.data)
      },
      () => {
        setFormState((prev) => ({ ...prev, tag: cv.tag ?? '' }))
      },
    )
  }

  const handleSave = () => {
    if (!isDirty) {
      setIsEditMode(false)
      return
    }
    updateCv(
      buildPayload(),
      (response) => {
        if (response?.data) onUpdated?.(response.data)
        setIsEditMode(false)
      },
      () => {},
    )
  }

  const isDirty =
    formState.full_name !== (cv.full_name || '') ||
    formState.email !== (cv.email || '') ||
    formState.phone !== (cv.phone || '') ||
    formState.address !== (cv.address || '') ||
    formState.position !== (cv.position || '') ||
    formState.note !== (cv.note ?? '') ||
    formState.tag !== (cv.tag ?? '') ||
    formState.is_marked !== (cv.is_marked ?? false) ||
    formState.date_of_birth !== (cv.date_of_birth ?? '') ||
    formState.work_type !== (cv.work_type ?? '') ||
    formState.total_experience_years !== (cv.total_experience_years ?? '') ||
    formState.summary !== (cv.summary ?? '')

  const name = formState.full_name || 'Unknown'
  const skills: string[] = (cv?.skills as string[]) || []
  const certifications: string[] = cv?.certifications || []

  const inputClass =
    'w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent'
  const readonlyClass =
    'text-sm font-medium text-slate-800 py-1.5 px-0.5 truncate'

  type FieldConfig = {
    label: string
    field: keyof typeof formState
    colSpan: 'full' | 'half'
    type?: 'text' | 'email' | 'number'
  }

  const fields: FieldConfig[] = [
    { label: 'Vị trí ứng tuyển', field: 'position', colSpan: 'full' },
    { label: 'Họ và tên', field: 'full_name', colSpan: 'full' },
    { label: 'Email', field: 'email', colSpan: 'full', type: 'email' },
    { label: 'Số điện thoại', field: 'phone', colSpan: 'half' },
    { label: 'Địa điểm', field: 'address', colSpan: 'half' },
    { label: 'Ngày sinh', field: 'date_of_birth', colSpan: 'half' },
    { label: 'Hình thức', field: 'work_type', colSpan: 'half' },
    {
      label: 'Số năm kinh nghiệm',
      field: 'total_experience_years',
      colSpan: 'half',
      type: 'number',
    },
  ]

  return (
    <div className="h-full fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 flex flex-col h-[90vh] w-[90vw] overflow-hidden rounded-md bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <Avatar name={name} />
            <div>
              <div className="text-base font-bold leading-tight text-slate-900">
                {name}
              </div>
              <div className="text-sm text-slate-500">
                {formState.position || 'Candidate'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant={isMark ? 'accent' : 'default'}
              className="!py-1.5 !px-4 !text-xs !rounded-sm whitespace-nowrap"
              disabled={isMarkingTalent}
              onClick={() => {
                const nextMark = !isMark
                setIsMark(nextMark)
                handleChange('is_marked', nextMark)
                markAsTalent(
                  cv.cv_infos_id,
                  nextMark,
                  (response) => {
                    if (response?.data) onUpdated?.(response.data)
                  },
                  () => {
                    setIsMark(!nextMark)
                    handleChange('is_marked', !nextMark)
                  },
                )
              }}
            >
              <Bookmark
                className={`h-3.5 w-3.5 ${isMark ? 'fill-white' : ''}`}
              />
              {isMarkingTalent ? 'Đang lưu…' : 'Talent'}
            </Button>

            <Select
              value={formState.tag || 'new'}
              onValueChange={(newTag) => {
                handleChange('tag', newTag)
                handleTagChange(newTag)
              }}
              disabled={isUpdating}
            >
              <SelectTrigger className="h-8 min-w-[120px] justify-center text-xs font-semibold border-slate-200 [&>span]:flex [&>span]:items-center [&>span]:gap-2">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full bg-${
                        CV_STATUS_LABELS[
                          (formState.tag ||
                            'new') as keyof typeof CV_STATUS_LABELS
                        ]?.color || 'slate-400'
                      }`}
                    />
                    {CV_STATUS_LABELS[
                      (formState.tag || 'new') as keyof typeof CV_STATUS_LABELS
                    ]?.label || 'New'}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="min-w-[130px]">
                {Object.entries(CV_STATUS_LABELS).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2 w-2 rounded-full bg-${config.color}`}
                      />
                      {config.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="ghost" className="!p-1.5" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-3 min-h-0 flex-1">
          {/* PDF Panel */}
          <div className="col-span-2 flex min-h-0 flex-1 flex-col">
            <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex gap-2 items-center text-sm font-semibold text-slate-600">
                <FileText className="h-4 w-4 text-accent" />
                <span>CV Preview — {name}</span>
              </div>
              <a
                href={pdfUrl}
                download
                className="flex items-center gap-1.5 py-1 px-2.5 text-sm text-accent rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition"
              >
                <Download className="h-3.5 w-3.5" />
                Tải xuống
              </a>
            </div>
            <div className="min-h-0 flex-1">
              <PdfViewer pdfUrl={pdfUrl} />
            </div>
          </div>

          {/* Information Panel */}
          <div className="col-span-1 border-l border-slate-200 min-h-0 flex flex-col bg-[#F1F5F9]">
            {/* Panel Header */}
            <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <User className="h-4 w-4 text-accent" />
                Thông tin ứng viên
              </div>

              {!isEditMode ? (
                <Button
                  variant="outline-accent"
                  className="!py-1 !px-2.5 !text-xs !gap-1 !rounded-sm"
                  onClick={() => setIsEditMode(true)}
                >
                  <Pencil className="h-3 w-3" />
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="subtle"
                    className="!py-1 !px-2.5 !text-xs"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="accent"
                    className="!py-1 !px-2.5 !text-xs !gap-1 relative"
                    onClick={handleSave}
                    disabled={isUpdating}
                  >
                    <Check className="h-3 w-3" />
                    {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                    {isDirty && !isUpdating && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Panel Content */}
            <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-4">
              {/* Fields — 2-col grid */}
              <div className="bg-white rounded-lg border border-slate-200 px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-3">
                {fields.map(({ label, field, colSpan, type }) => {
                  const rawValue = formState[field]
                  const displayValue =
                    rawValue !== '' && rawValue !== undefined
                      ? String(rawValue)
                      : '—'
                  return (
                    <div
                      key={field}
                      className={
                        colSpan === 'full' ? 'col-span-2' : 'col-span-1'
                      }
                    >
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {label}
                      </div>
                      {isEditMode ? (
                        <input
                          type={type ?? 'text'}
                          value={rawValue as string}
                          onChange={(e) => handleChange(field, e.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        <div className={readonlyClass} title={displayValue}>
                          {displayValue}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Giới thiệu / Tóm tắt */}
              {(isEditMode || formState.summary) && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Summary
                  </div>
                  {isEditMode ? (
                    <textarea
                      value={formState.summary}
                      onChange={(e) => handleChange('summary', e.target.value)}
                      rows={4}
                      placeholder="Nhập giới thiệu hoặc tóm tắt..."
                      className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    />
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <div className="rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {formState.summary}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Học vấn */}
              {cv?.educations && cv.educations.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Học vấn
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {cv.educations.map((edu, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                      >
                        <GraduationCap className="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
                        <span>
                          {edu?.degree} — {edu?.university}{' '}
                          {edu?.graduation_year}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kỹ năng */}
              {skills.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Kỹ năng
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Chứng chỉ */}
              {certifications.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Chứng chỉ
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {certifications.map((c: string) => (
                      <div
                        key={c}
                        className="rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ghi chú */}
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Ghi chú
                </div>
                <textarea
                  value={formState.note}
                  onChange={(e) => handleChange('note', e.target.value)}
                  readOnly={!isEditMode}
                  placeholder={
                    isEditMode
                      ? 'Nhập nhận xét, đánh giá hoặc lưu ý...'
                      : 'Chưa có ghi chú'
                  }
                  className={`w-full h-24 p-3 rounded-lg text-sm resize-none transition-colors ${
                    isEditMode
                      ? 'border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent'
                      : 'border border-slate-200 bg-white text-slate-700 cursor-default'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
