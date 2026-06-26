import Avatar from '@/presentation/components/ui/avatar'
import { Button } from '@/presentation/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'
import { Download, X, FileText, GraduationCap, Bookmark } from 'lucide-react'
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
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({})
  const [shouldClose, setShouldClose] = useState(false)
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

  // Close modal only when mutation is truly complete
  useEffect(() => {
    if (shouldClose && !isUpdating) {
      onClose?.()
      setShouldClose(false)
    }
  }, [shouldClose, isUpdating, onClose])

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
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTagChange = (newTag: string) => {
    const payload = {
      id: cv.cv_infos_id,
      full_name: formState.full_name,
      email: formState.email,
      phone: formState.phone,
      address: formState.address,
      position: formState.position,
      note: formState.note,
      is_marked: formState.is_marked,
      tag: newTag,
      date_of_birth: formState.date_of_birth,
      work_type: formState.work_type,
      total_experience_years:
        formState.total_experience_years === ''
          ? undefined
          : Number(formState.total_experience_years),
      summary: formState.summary,
    }

    updateCv(
      payload,
      (response) => {
        if (response?.data) {
          onUpdated?.(response.data)
        }
      },
      () => {
        setFormState((prev) => ({
          ...prev,
          tag: cv.tag ?? '',
        }))
      },
    )
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
      note: formState.note,
      is_marked: formState.is_marked,
      tag: formState.tag,
      date_of_birth: formState.date_of_birth,
      work_type: formState.work_type,
      total_experience_years:
        formState.total_experience_years === ''
          ? undefined
          : Number(formState.total_experience_years),
      summary: formState.summary,
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
  const title = formState.position || 'Candidate'
  const skills: string[] = (cv?.skills as string[]) || []
  const certifications: string[] = cv?.certifications || []

  const renderEditableField = (
    label: string,
    field: keyof typeof formState,
    type: 'text' | 'number' | 'email' | 'textarea' = 'text',
    placeholder: string = 'Chưa có thông tin',
  ) => {
    const isEditing = !!editMode[field]
    const rawValue = formState[field]

    const onFieldClick = () => {
      setEditMode((prev) => ({ ...prev, [field]: true }))
    }

    const onFieldBlur = () => {
      setEditMode((prev) => ({ ...prev, [field]: false }))
    }

    return (
      <div className="mb-3">
        <div className="text-xs text-slate-400 mb-1">{label}</div>
        {isEditing ? (
          type === 'textarea' ? (
            <textarea
              autoFocus
              value={rawValue as string}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={onFieldBlur}
              placeholder={placeholder}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              rows={3}
            />
          ) : (
            <input
              autoFocus
              type={type}
              value={rawValue as string}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={onFieldBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur()
                }
              }}
              placeholder={placeholder}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          )
        ) : (
          <div
            onClick={onFieldClick}
            className={`cursor-pointer rounded-md bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100 transition-colors duration-150 border border-transparent hover:border-slate-200 min-h-[38px] flex items-center ${
              !rawValue ? 'text-slate-400 italic' : 'text-slate-800'
            }`}
          >
            {rawValue ? (rawValue as string) : placeholder}
          </div>
        )}
      </div>
    )
  }

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

          <div className="flex shrink-0 items-center gap-2">
            <Select
              value={formState.tag || 'new'}
              onValueChange={(newTag) => {
                handleChange('tag', newTag)
                handleTagChange(newTag)
              }}
              disabled={isUpdating}
            >
              <SelectTrigger
                className={`h-8 min-w-[110px] border-none text-xs font-semibold text-white shadow-none focus:ring-2 focus:ring-white/30 text-${
                  CV_STATUS_LABELS[
                    (formState.tag || 'new') as keyof typeof CV_STATUS_LABELS
                  ]?.color || 'slate-500'
                } [&>svg]:text-slate-500`}
              >
                <SelectValue />
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
              {renderEditableField('Họ và tên', 'full_name')}
              {renderEditableField('Vị trí', 'position')}
              {renderEditableField('Email', 'email', 'email')}
              {renderEditableField('Số điện thoại', 'phone')}
              {renderEditableField('Ngày sinh', 'date_of_birth')}
              {renderEditableField('Địa điểm', 'address')}
              {renderEditableField('Hình thức làm việc', 'work_type')}
              {renderEditableField(
                'Số năm kinh nghiệm',
                'total_experience_years',
                'number',
              )}
              {renderEditableField(
                'Giới thiệu / Tóm tắt',
                'summary',
                'textarea',
              )}

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
                <Button
                  variant={isMark ? 'accent' : 'default'}
                  className="w-full flex items-center justify-center gap-2 mt-2 !rounded-2xl"
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
                        // revert on error
                        setIsMark(!nextMark)
                        handleChange('is_marked', !nextMark)
                      },
                    )
                  }}
                >
                  <Bookmark
                    className={`h-4 w-4 ${isMark ? 'fill-white text-white' : ''}`}
                  />
                  {isMarkingTalent
                    ? 'Đang lưu…'
                    : isMark
                      ? 'Đã đánh dấu Talent'
                      : 'Đánh dấu là Talent'}
                </Button>
              </div>

              {/* note Section */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="text-xs text-slate-400 flex items-center justify-between gap-2">
                  <span>GHI CHÚ</span>
                </div>
                {editMode.note ? (
                  <textarea
                    autoFocus
                    value={formState.note}
                    onChange={(e) => handleChange('note', e.target.value)}
                    onBlur={() =>
                      setEditMode((prev) => ({ ...prev, note: false }))
                    }
                    placeholder="Nhập nhận xét, đánh giá hoặc lưu ý về ứng viên này..."
                    className="w-full h-24 p-3 border border-slate-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent bg-white mt-1"
                  />
                ) : (
                  <div
                    onClick={() =>
                      setEditMode((prev) => ({ ...prev, note: true }))
                    }
                    className={`cursor-pointer rounded-md bg-slate-50 p-3 text-sm min-h-24 hover:bg-slate-100 transition-colors duration-150 border border-transparent hover:border-slate-200 whitespace-pre-wrap mt-1 ${
                      !formState.note
                        ? 'text-slate-400 italic'
                        : 'text-slate-800'
                    }`}
                  >
                    {formState.note ||
                      'Nhập nhận xét, đánh giá hoặc lưu ý về ứng viên này...'}
                  </div>
                )}
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
