import { useState } from 'react'
import { Users as UsersIcon, Plus } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Pagination } from '@/presentation/components/ui/pagination'
import { useGetAllUsers } from '@/presentation/hooks/users/useGetAllUsers'
import { useAuth } from '@/presentation/provider/auth/auth-provider'
import { UserTableRow } from './UserTableRow'
import { InviteMemberDialog } from './InviteMemberDialog'
import { EditUserDialog } from './EditUserDialog'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import type { User } from 'src/domain/models/Auth'

const ROLE_LEGEND = [
  {
    role: 'admin',
    color: 'text-amber-600 bg-amber-100 border border-amber-300',
    desc: 'Full access',
  },
  {
    role: 'recruiter',
    color: 'text-emerald-600 bg-emerald-100 border border-emerald-300',
    desc: 'Can manage CVs',
  },
  {
    role: 'interviewer',
    color: 'text-blue-600 bg-blue-100 border border-blue-300',
    desc: 'View & comment only',
  },
]

const LIMIT = import.meta.env.VITE_LIMIT

export default function UserManagementPage() {
  const { user: currentUser } = useAuth()
  const [page, setPage] = useState(1)
  const [showInvite, setShowInvite] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)

  const { result, isLoading, refetch } = useGetAllUsers({ page, limit: LIMIT })

  const users: User[] = result?.data?.items ?? []
  const totalPages = result?.data?.meta?.totalPages ?? 1
  const totalItems = result?.data?.meta?.total ?? 0

  const handleSuccess = () => refetch()

  return (
    <main>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý tài khoản và phân quyền thành viên
        </p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-gray-500" />
            <span className="font-semibold text-xl text-slate-800">
              Team Members
            </span>
            <span className="ml-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-green-100 px-1.5 text-xs font-semibold text-gray-600">
              {totalItems}
            </span>
          </div>
          <Button variant="accent" onClick={() => setShowInvite(true)}>
            <Plus className="h-4 w-4" />
            Invite Member
          </Button>
        </div>

        {/* Role legend */}
        <div className="flex flex-wrap items-center gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/50">
          {ROLE_LEGEND.map(({ role, color, desc }) => (
            <div key={role} className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-base font-semibold ${color}`}
              >
                {role}
              </span>
              <span className="text-sm text-gray-500">{desc}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-base font-medium font-semibold uppercase tracking-wider text-gray-500">
                  Member
                </th>
                <th className="px-4 py-3 text-left text-base font-medium font-semibold uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-base font-medium font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-base font-medium font-semibold uppercase tracking-wider text-gray-500">
                  Last Active
                </th>
                <th className="px-4 py-3 text-left text-base font-medium font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  isCurrentUser={user.id === currentUser?.id}
                  onEdit={setEditUser}
                  onDelete={setDeleteUser}
                />
              ))}
            </tbody>
          </table>

          {isLoading && (
            <div className="py-12 text-center text-sm text-gray-400">
              Loading members…
            </div>
          )}

          {!isLoading && users.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">
              No members found.
            </div>
          )}
        </div>

        {/* Footer / Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <p className="text-sm text-gray-500">
              Showing {users.length} of {totalItems} members
            </p>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </section>

      {/* Dialogs */}
      {showInvite && (
        <InviteMemberDialog
          onClose={() => setShowInvite(false)}
          onSuccess={handleSuccess}
        />
      )}
      {editUser && (
        <EditUserDialog
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={handleSuccess}
        />
      )}
      {deleteUser && (
        <DeleteConfirmDialog
          user={deleteUser}
          onClose={() => setDeleteUser(null)}
          onSuccess={handleSuccess}
        />
      )}
    </main>
  )
}
