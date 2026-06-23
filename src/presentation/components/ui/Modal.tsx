import { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  keepMounted?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  children,
  className = '',
  keepMounted = false,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = window.document.body.style.overflow
    window.document.body.style.overflow = 'hidden'

    return () => {
      window.document.body.style.overflow = previousOverflow || ''
    }
  }, [isOpen])

  if (typeof document === 'undefined' || (!isOpen && !keepMounted)) {
    return null
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 py-6 ${!isOpen ? 'pointer-events-none' : ''}`}
    >
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm ${isOpen ? '' : 'hidden'}`}
        onClick={onClose}
      />
      <div
        className={`relative z-60 ${className} ${!isOpen ? 'invisible opacity-0' : ''}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
