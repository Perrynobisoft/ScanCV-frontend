import { useState } from 'react'
import toast from 'react-hot-toast'
import ReactCountryFlag from 'react-country-flag'
import {
  Mail,
  Shield,
  Activity,
  KeyRound,
  Pencil,
  Check,
  X,
  Languages,
} from 'lucide-react'
import { useAuth } from '@/presentation/provider/auth/auth-provider'
import { useUpdateMe } from '@/presentation/hooks/auth/useUpdateMe'
import { Input } from '@/presentation/components/ui/input'
import { Button } from '@/presentation/components/ui/button'
import Avatar from '@/presentation/components/ui/avatar'
import { ChangePasswordDialog } from './ChangePasswordDialog'
import { m } from '@/paraglide/messages'
import { useLocale } from '@/presentation/provider/locale/locale-provider'

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
}

const LOCALE_COUNTRY_CODES: Record<string, string> = {
  en: 'GB',
  vi: 'VN',
}

export default function ProfilePage() {
  const { user, setAuthenticated } = useAuth()
  const { updateMe, isPending: isUpdating } = useUpdateMe()
  const { locale, setLocale, locales } = useLocale()

  const [showChangePassword, setShowChangePassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleEdit = () => {
    setFullName(user?.fullName ?? '')
    setSaveError(null)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSaveError(null)
  }

  const handleSave = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSaveError(null)

    updateMe({ fullName }, (data) => {
      if (data?.data) setAuthenticated(data.data)
      toast.success(m.profile_update_success())
      setIsEditing(false)
    })
  }

  return (
    <main className="">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {m.profile_page_title()}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {m.profile_page_subtitle()}
        </p>
      </div>

      {/* Profile card — banner + info/edit merged */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm mb-5 overflow-hidden">
        {/* Dark banner */}
        <div className="px-8 py-8">
          <div className="flex items-center gap-5">
            <Avatar name={user?.fullName} />
            <div className="min-w-0">
              <p className="text-lg font-semibold text-black leading-tight truncate">
                {user?.fullName || user?.email || 'User'}
              </p>
              <p className="text-sm text-slate-400 mt-0.5 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Info + editable fields */}
        <form onSubmit={handleSave}>
          <div className="grid gap-px bg-gray-100 sm:grid-cols-2">
            {/* Full name — editable */}
            <div className="bg-white px-6 py-5">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {m.profile_field_full_name()}
                </p>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex items-center gap-1 text-xs text-black hover:text-accent transition-colors cursor-pointer"
                    aria-label={m.profile_edit_aria()}
                  >
                    <Pencil className="h-3 w-3" />
                    {m.profile_edit_btn()}
                  </button>
                )}
              </div>
              {isEditing ? (
                <Input
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-slate-50 border-slate-200 h-8 text-sm"
                  placeholder="Nguyễn Văn A"
                />
              ) : (
                <p className="text-base font-semibold text-slate-900">
                  {user?.fullName || '—'}
                </p>
              )}
            </div>

            {/* Email — read-only */}
            <div className="bg-white px-6 py-5">
              <div className="flex items-center gap-2 mb-1.5">
                <Mail className="h-4 w-4 text-slate-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {m.profile_field_email()}
                </p>
              </div>
              <p className="text-base font-semibold text-slate-900">
                {user?.email || '—'}
              </p>
            </div>

            {/* Role — read-only */}
            <div className="bg-white px-6 py-5">
              <div className="flex items-center gap-2 mb-1.5">
                <Shield className="h-4 w-4 text-slate-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {m.profile_field_role()}
                </p>
              </div>
              <p className="text-base font-semibold capitalize text-slate-900">
                {user?.role || '—'}
              </p>
            </div>

            {/* Status — read-only */}
            <div className="bg-white px-6 py-5">
              <div className="flex items-center gap-2 mb-1.5">
                <Activity className="h-4 w-4 text-slate-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {m.profile_field_status()}
                </p>
              </div>
              <p
                className={`text-base font-semibold capitalize ${
                  user?.status?.toLowerCase() === 'active'
                    ? 'text-emerald-600'
                    : 'text-slate-900'
                }`}
              >
                {user?.status || '—'}
              </p>
            </div>
          </div>

          {/* Edit action bar — only visible while editing */}
          {isEditing && (
            <div className="border-t border-gray-100 px-6 py-4 flex flex-col gap-3">
              {saveError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                  {saveError}
                </p>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-gray-50"
                >
                  <X className="h-4 w-4" />
                  {m.profile_cancel_btn()}
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {isUpdating ? m.profile_saving_btn() : m.profile_save_btn()}
                </button>
              </div>
            </div>
          )}
        </form>
      </section>

      {/* Change password */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <KeyRound className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                {m.profile_password_label()}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {m.profile_password_desc()}
              </p>
            </div>
          </div>
          <Button
            variant="default"
            className="text-sm"
            onClick={() => setShowChangePassword(true)}
          >
            {m.profile_change_password_btn()}
          </Button>
        </div>
      </section>

      {showChangePassword && (
        <ChangePasswordDialog onClose={() => setShowChangePassword(false)} />
      )}

      {/* Language preference */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm mt-5">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <Languages className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                {m.profile_language_label()}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {m.profile_language_desc()}
              </p>
            </div>
          </div>

          {/* Language buttons */}
          <div className="flex items-center gap-2">
            {locales.map((loc) => (
              <Button
                key={loc}
                variant={loc === locale ? 'lang-active' : 'lang'}
                onClick={() => setLocale(loc)}
                aria-pressed={loc === locale}
              >
                {LOCALE_COUNTRY_CODES[loc] && (
                  <ReactCountryFlag
                    countryCode={LOCALE_COUNTRY_CODES[loc]}
                    svg
                    style={{ width: '1.5em', height: '1.5em' }}
                  />
                )}
                {LOCALE_NAMES[loc] ?? loc}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
