import { useCallback, useEffect, useRef, useState } from 'react'

export type UseModalReturn = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export default function useModal(): UseModalReturn {
  const [isOpen, setIsOpen] = useState(false)
  const previousOverflow = useRef<string>('')

  useEffect(() => {
    if (!isOpen) return

    previousOverflow.current = window.document.body.style.overflow
    window.document.body.style.overflow = 'hidden'

    return () => {
      window.document.body.style.overflow = previousOverflow.current || ''
    }
  }, [isOpen])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((value) => !value), [])

  return { isOpen, open, close, toggle }
}
