import { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/presentation/components/ui/input'
import { useCreateUsers } from '@/presentation/hooks/users/useCreateUsers'
import { m } from '@/paraglide/messages'

const ROLES = ['Recruiter', 'Interviewer'] as const

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
  const [role, setRole] = useState<string>('Interviewer')

  const { create, isPending } = useCreateUsers()

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    create({ fullname: fullName, email, role }, () => {
      onSuccess()
      onClose()
    })
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
              {m.invite_dialog_title()}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {m.invite_dialog_subtitle()}
            </p>
          </div>
          <button
            type="button"
            aria-label={m.common_close()}
            onClick={onClose}
            className="ml-4 mt-0.5 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              {m.invite_dialog_field_full_name()}
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
              {m.invite_dialog_field_email()}
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

          {/* Vai trò */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              {m.invite_dialog_field_role()}
            </label>
            <div className="grid grid-cols-2 gap-2">
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
              {m.invite_dialog_btn_cancel()}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors"
            >
              {isPending
                ? m.invite_dialog_btn_submitting()
                : m.invite_dialog_btn_submit()}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
