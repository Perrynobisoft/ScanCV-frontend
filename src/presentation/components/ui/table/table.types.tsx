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

  className?: string
  tableClassName?: string

  onRowClick?: (row: T) => void
}
