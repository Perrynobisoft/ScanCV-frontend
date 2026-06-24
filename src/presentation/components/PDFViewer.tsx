import { Document, Page } from 'react-pdf'
import { useEffect, useRef, useState } from 'react'
import { usePdfBlob } from '@/presentation/hooks/usePdfBlob'

interface Props {
  pdfUrl?: string
}

export default function PdfViewer({ pdfUrl }: Props) {
  const { blob, loading, error } = usePdfBlob(pdfUrl)

  const [numPages, setNumPages] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const [width, setWidth] = useState<number>()

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      setWidth(entry.contentRect.width)
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => resizeObserver.disconnect()
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
      className="h-full w-full overflow-y-auto bg-slate-100"
    >
      <Document
        file={blob}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from({ length: numPages }, (_, index) => (
          <div key={index} className="flex justify-center">
            <Page
              pageNumber={index + 1}
              width={width ? Math.min(width - 40, 1000) : undefined}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              // height={200}
            />
          </div>
        ))}
      </Document>
    </div>
  )
}
