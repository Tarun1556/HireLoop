import { Badge } from '@/components/ui/badge'

const STYLES = {
  EASY: 'bg-green-100 text-green-700 border-green-200',
  MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
  HARD: 'bg-red-100 text-red-700 border-red-200',
}

export default function DifficultyBadge({ difficulty }) {
  return (
    <Badge variant="outline" className={STYLES[difficulty] ?? ''}>
      {difficulty}
    </Badge>
  )
}