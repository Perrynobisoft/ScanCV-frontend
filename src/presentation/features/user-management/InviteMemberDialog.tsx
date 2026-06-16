import { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/presentation/components/ui/input'
import { useCreateUsers } from '@/presentation/hooks/users/useCreateUsers'

const ROLES = ['Admin', 'Recruiter', 'Interviewer'] as const
type Role = (typeof ROLES)[number]

interface InviteMemberDialogProps {
  onClose: () => void
  onSuccess: () => void
}

export function InviteMemberDialog({
  onClose,
  onSuccess,
}: InviteMemberDialogProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<Role>('Recruiter')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { create, isPending } = useCreateUsers()

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) return

    create(
      { fullname: fullName, email, password, confirmPassword, role },
      () => {
        onSuccess()
        onClose()
      },
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 id="invite-title" className="text-lg font-bold text-slate-900">
              Mời thành viên mới
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Tạo tài khoản và phân quyền cho thành viên
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

        {/* Form */}
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

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Email
            </label>
            <Input
              required
              type="email"
              placeholder="example@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-50 border-slate-200"
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Input
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="Tối thiểu 6 ký tự"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-50 border-slate-200 pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <Input
                required
                type={showConfirm ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`bg-slate-50 border-slate-200 pr-10 ${
                  confirmPassword && confirmPassword !== password
                    ? 'border-red-400 focus:ring-red-200'
                    : ''
                }`}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600"
                aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {confirmPassword && confirmPassword !== password && (
              <p className="mt-1 text-xs text-red-500">Mật khẩu không khớp</p>
            )}
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
              disabled={
                isPending || (!!confirmPassword && confirmPassword !== password)
              }
              className="flex-1 rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Đang xử lý…' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
