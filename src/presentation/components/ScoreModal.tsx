import { X, Upload } from 'lucide-react'
import Modal from './ui/Modal'

interface ScoreModalProps {
  isOpen: boolean
  onClose: () => void
  score: number | undefined
  reason?: string | undefined
  fullName: string
}

export default function ScoreModal({
  isOpen,
  onClose,
  score,
  reason,
  fullName,
}: ScoreModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-md rounded-md bg-white p-6 shadow-lg"
    >
      <div className="text-center flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="text-md font-semibold text-slate-900 flex items-center gap-2">
            <Upload className="h-8 w-8 p-2 text-accent bg-emerald-100 rounded-sm" />
            Chấm điểm CV
          </div>
          <X
            className="h-5 w-5 text-slate-500 hover:text-slate-700 cursor-pointer"
            onClick={onClose}
          />
        </div>

        <div className="flex justify-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-teal-500 bg-slate-50">
            <span className="text-4xl font-bold text-teal-600">{score}</span>
          </div>
        </div>

        <div className="rounded-sm bg-slate-100 p-4 text-left">
          <h2 className="text-md font-bold text-slate-900">
            Thông tin chấm điểm
          </h2>
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{fullName}</span>{' '}
            được chấm điểm
            <span className="font-semibold text-slate-900">
              {' '}
              {score}/100.
            </span>{' '}
            {reason}
          </p>
        </div>

        <div className="rounded-sm bg-slate-100 p-4 text-left">
          <h2 className="text-md font-bold text-slate-900 mb-2">
            Yêu cầu chấm lại
          </h2>
          <textarea
            className="w-full rounded-sm border border-slate-300 p-2 text-sm text-slate-700 focus:border-accent! focus:ring-1 focus:ring-accent! focus:outline-none"
            placeholder="Nhập yêu cầu chấm lại..."
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Lưu
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
          >
            Gửi
          </button>
        </div>
      </div>
    </Modal>
  )
}
