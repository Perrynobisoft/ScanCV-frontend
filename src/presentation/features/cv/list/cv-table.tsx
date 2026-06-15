import Table from '@/presentation/components/ui/table/table'
import type { CvItem } from './cv-table.types'
import { cvColumns } from './cv-table.columns'

type Props = {
  data: CvItem[]
  loading?: boolean
  onRowClick?: (cv: CvItem) => void
}

export default function CvTable({ data, loading, onRowClick }: Props) {
  return (
    <Table<CvItem>
      data={data}
      columns={cvColumns}
      rowKey="id"
      loading={loading}
      emptyText="No CV found"
      tableClassName="min-w-[1400px]"
      onRowClick={onRowClick}
    />
  )
}
