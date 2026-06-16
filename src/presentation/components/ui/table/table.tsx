import type { TableProps } from './table.types'

function getRowKey<T>(row: T, rowKey: keyof T | ((row: T) => string)): string {
  if (typeof rowKey === 'function') {
    return rowKey(row)
  }

  return String(row[rowKey])
}

function getAlignClass(align?: 'left' | 'center' | 'right') {
  switch (align) {
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right'
    default:
      return 'text-left'
  }
}

export default function Table<T>({
  data,
  columns,
  rowKey,
  loading,
  emptyText = 'No data',
  className,
  tableClassName,
  onRowClick,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Loading...
      </div>
    )
  }

  return (
    <div
      className={`overflow-x-hidden rounded-xl border border-slate-200 bg-white ${className ?? ''}`}
    >
      <div className="overflow-x-auto">
        <table
          className={`w-full min-w-300 border-collapse overflow-x-hidden ${tableClassName ?? ''}`}
        >
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-6 py-4
                    text-xs font-semibold uppercase tracking-wider text-slate-500
                    ${getAlignClass(column.align)}
                    ${column.width ?? ''}
                    ${column.headerClassName ?? ''}
                  `}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-sm text-slate-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={getRowKey(row, rowKey)}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    transition-colors
                    hover:bg-slate-50
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`
                        px-6 py-5 align-top
                        ${getAlignClass(column.align)}
                        ${column.cellClassName ?? ''}
                      `}
                    >
                      {column.render?.(row, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
