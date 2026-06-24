import { Upload, X } from 'lucide-react'
import Modal from '@/presentation/components/ui/Modal'
import type { ScoreModalBaseProps } from './types'

export default function ScoreModalBase({
  isOpen,
  onClose,
  title,
  headerMode,
  headerInitials,
  children,
  className,
}: ScoreModalBaseProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className}>
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <div className="flex items-center gap-3">
            {headerMode === 'avatar' ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                {headerInitials}
              </div>
            ) : (
              <Upload className="h-8 w-8 rounded-md bg-emerald-50 p-2 text-accent" />
            )}
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          </div>
          <button
            type="button"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </Modal>
  )
}
