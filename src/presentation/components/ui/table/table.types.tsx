import type { ReactNode } from 'react'

export type TableColumn<T> = {
  key: string
  title: ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
  className?: string
  headerClassName?: string
  cellClassName?: string

  render?: (row: T, index: number) => ReactNode
}

export type TableProps<T> = {
  data: T[]
  columns: TableColumn<T>[]

  rowKey: keyof T | ((row: T) => string)

  loading?: boolean
  emptyText?: ReactNode

  /** Pad with empty rows to always show at least this many rows, keeping table height stable */
  minRows?: number

  className?: string
  tableClassName?: string
  height?: string

  onRowClick?: (row: T) => void
}
