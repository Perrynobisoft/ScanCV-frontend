import { Pencil, Trash2 } from 'lucide-react'
import Avatar from '@/presentation/components/ui/avatar'
import { formatLastActive } from './utils'
import type { User } from 'src/domain/models/Auth'
import { m } from '@/paraglide/messages'

const roleStyles: Record<string, string> = {
  Admin:
    'bg-amber-100 text-amber-700 border border-amber-300 font-semibold rounded-full px-3 py-1 text-sm',
  Recruiter:
    'bg-emerald-100 text-emerald-700 border border-emerald-300 font-semibold rounded-full px-3 py-1 text-sm',
  Interviewer:
    'bg-blue-100 text-blue-700 border border-blue-300 font-semibold rounded-full px-3 py-1 text-sm',
}

interface UserTableRowProps {
  user: User
  isCurrentUser: boolean
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UserTableRow({
  user,
  isCurrentUser,
  onEdit,
  onDelete,
}: UserTableRowProps) {
  const fullName = user.fullName ?? ''
  const roleName = user.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
    : ''
  const statusName = user.status
    ? user.status.charAt(0).toUpperCase() + user.status.slice(1).toLowerCase()
    : ''
  const isActive = statusName === 'Active'

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Member */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={fullName} />
          <div>
            <div className="font-semibold text-slate-900 text-sm">
              {fullName}
            </div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>

      {/* Role — display only */}
      <td className="px-4 py-3">
        <span className={roleStyles[roleName] ?? roleStyles['Interviewer']}>
          {roleName}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}
          />
          <span
            className={`text-sm font-medium ${isActive ? 'text-emerald-600' : 'text-gray-500'}`}
          >
            {statusName}
          </span>
        </div>
      </td>

      {/* Last Active */}
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatLastActive(user.lastActive)}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`${m.common_edit()} ${fullName}`}
            onClick={() => onEdit(user)}
            className="p-1.5 rounded-md text-gray-400 hover:text-slate-700 hover:bg-gray-100 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          {!isCurrentUser && (
            <button
              type="button"
              aria-label={`${m.common_delete()} ${fullName}`}
              onClick={() => onDelete(user)}
              className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}
