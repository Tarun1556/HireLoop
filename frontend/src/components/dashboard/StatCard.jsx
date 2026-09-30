import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function StatCard({ title, value, icon: Icon, loading }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="text-3xl font-semibold tracking-tight">{value}</p>
          )}
        </div>
        <div className="flex size-11 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}