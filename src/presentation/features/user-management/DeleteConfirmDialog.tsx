import { Trash2 } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { useDeleteUsers } from '@/presentation/hooks/users/useDeleteUsers'
import { type Users } from '@/domain/models/Users'

interface DeleteConfirmDialogProps {
  user: Users
  onClose: () => void
  onSuccess: () => void
}

export function DeleteConfirmDialog({
  user,
  onClose,
  onSuccess,
}: DeleteConfirmDialogProps) {
  const { remove, isPending } = useDeleteUsers()
  const fullName = `${user.firstName} ${user.lastName}`.trim()

  const handleDelete = () => {
    remove({ id: user.id }, () => {
      onSuccess()
      onClose()
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <Trash2 className="h-6 w-6 text-red-600" />
        </div>

        <h2
          id="delete-dialog-title"
          className="mb-2 text-lg font-semibold text-slate-900"
        >
          Remove member
        </h2>
        <p className="mb-6 text-sm text-gray-500">
          Are you sure you want to remove{' '}
          <span className="font-semibold text-slate-800">{fullName}</span>? This
          action cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={isPending}
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700 border-0"
          >
            {isPending ? 'Removing…' : 'Remove'}
          </Button>
        </div>
      </div>
    </div>
  )
}
