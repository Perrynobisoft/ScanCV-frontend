import { Document, Page } from 'react-pdf'
import { useRef, useState, useCallback } from 'react'
import { usePdfBlob } from '@/presentation/hooks/usePdfBlob'

interface Props {
  pdfUrl?: string
  scale?: number
}

export default function PdfViewer({ pdfUrl, scale = 1.0 }: Props) {
  const { blob, loading, error } = usePdfBlob(pdfUrl)

  const containerRef = useRef<HTMLDivElement>(null)
  const [numPages, setNumPages] = useState(0)

  // Drag-to-scroll state
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Left button only (button === 0)
    if (e.button !== 0) return
    const el = containerRef.current
    if (!el) return

    isDragging.current = true
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
    }
    el.style.cursor = 'grabbing'
    el.style.userSelect = 'none'
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    const el = containerRef.current
    if (!el) return

    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    el.scrollLeft = dragStart.current.scrollLeft - dx
    el.scrollTop = dragStart.current.scrollTop - dy
  }, [])

  const stopDrag = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    const el = containerRef.current
    if (!el) return
    el.style.cursor = 'grab'
    el.style.userSelect = ''
  }, [])

  if (!pdfUrl) {
    return <div className="flex h-full items-center justify-center">No PDF</div>
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">Loading...</div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  if (!blob) return null

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-auto bg-slate-100"
      style={{ cursor: 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      {/* min-w-fit ensures the inner content expands the scroll area symmetrically,
          preventing the left side from being clipped when zoomed */}
      <div className="min-w-fit">
        <Document
          file={blob}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <div key={index} className="flex justify-center py-2">
              <Page
                pageNumber={index + 1}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  )
}
