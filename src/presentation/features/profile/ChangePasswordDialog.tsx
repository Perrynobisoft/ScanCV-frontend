import { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/presentation/components/ui/input'
import { useChangePassword } from '@/presentation/hooks/auth/useChangePassword'
import { type ChangePasswordRequest } from '@/domain/models/Auth'
import { m } from '@/paraglide/messages'

interface ChangePasswordDialogProps {
  onClose: () => void
}

export function ChangePasswordDialog({ onClose }: ChangePasswordDialogProps) {
  const { changePassword, isPending } = useChangePassword()

  const [form, setForm] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setError(null)

    if (form.newPassword !== form.confirmPassword) {
      setError(m.change_password_error_mismatch())
      return
    }
    if (form.newPassword.length < 6) {
      setError(m.change_password_error_min_length())
      return
    }

    changePassword(form)
  }

  const renderField = (
    key: keyof ChangePasswordRequest,
    label: string,
    showKey: keyof typeof show,
  ) => (
    <div>
      <label className="block text-sm font-semibold text-slate-800 mb-2">
        {label}
      </label>
      <div className="relative">
        <Input
          required
          type={show[showKey] ? 'text' : 'password'}
          placeholder="••••••••"
          value={form[key]}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, [key]: e.target.value }))
          }
          className="bg-slate-50 border-slate-200 pr-10"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          onClick={() =>
            setShow((prev) => ({ ...prev, [showKey]: !prev[showKey] }))
          }
          aria-label={
            show[showKey]
              ? m.change_password_hide_aria()
              : m.change_password_show_aria()
          }
        >
          {show[showKey] ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 pb-4 pt-6">
          <div>
            <h2
              id="change-password-title"
              className="text-lg font-bold text-slate-900"
            >
              {m.change_password_title()}
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {m.change_password_subtitle()}
            </p>
          </div>
          <button
            type="button"
            aria-label={m.change_password_close_aria()}
            onClick={onClose}
            className="ml-4 mt-0.5 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5">
          {renderField(
            'currentPassword',
            m.change_password_current_label(),
            'current',
          )}
          {renderField('newPassword', m.change_password_new_label(), 'next')}
          {renderField(
            'confirmPassword',
            m.change_password_confirm_label(),
            'confirm',
          )}

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-gray-50"
            >
              {m.change_password_cancel_btn()}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
            >
              {isPending
                ? m.change_password_saving_btn()
                : m.change_password_confirm_btn()}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
