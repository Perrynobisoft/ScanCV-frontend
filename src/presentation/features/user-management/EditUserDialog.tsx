import { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/presentation/components/ui/input'
import { useUpdateUsers } from '@/presentation/hooks/users/useUpdateUsers'
import { type Users } from '@/domain/models/Users'

const ROLES = ['Admin', 'Recruiter', 'Interviewer'] as const
const STATUSES = ['Active', 'Inactive'] as const

type Role = (typeof ROLES)[number]
type Status = (typeof STATUSES)[number]

interface EditUserDialogProps {
  user: Users
  onClose: () => void
  onSuccess: () => void
}

export function EditUserDialog({
  user,
  onClose,
  onSuccess,
}: EditUserDialogProps) {
  const [fullName, setFullName] = useState(user.fullName?.trim() ?? '')
  const [role, setRole] = useState<Role>((user.role as Role) ?? 'Recruiter')
  const [status, setStatus] = useState<Status>(
    (user.status as Status) ?? 'Active',
  )

  const { update, isPending } = useUpdateUsers()

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    update({ id: user.id, email: user.email, fullname: fullName, role }, () => {
      onSuccess()
      onClose()
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2
              id="edit-dialog-title"
              className="text-lg font-bold text-slate-900"
            >
              Chỉnh sửa thành viên
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Cập nhật thông tin và phân quyền thành viên
            </p>
          </div>
          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="ml-4 mt-0.5 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          {/* Tên tài khoản */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Tên tài khoản
            </label>
            <Input
              required
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-slate-50 border-slate-200"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Email
            </label>
            <Input
              readOnly
              value={user.email}
              className="bg-slate-100 border-slate-200 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Vai trò */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Vai trò
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                    role === r
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Trạng thái
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                    status === s
                      ? s === 'Active'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-400 bg-gray-100 text-gray-700'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-slate-700'
                  }`}
                >
                  {s === 'Active' ? 'Hoạt động' : 'Vô hiệu'}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-slate-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Đang lưu…' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
