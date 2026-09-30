import { Badge } from '@/components/ui/badge'

const STYLES = {
  SCHEDULED: 'bg-blue-100 text-blue-700 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
  RESCHEDULED: 'bg-amber-100 text-amber-700 border-amber-200',
}

export default function StatusBadge({ status }) {
  return (
    <Badge variant="outline" className={STYLES[status] ?? ''}>
      {status}
    </Badge>
  )
}