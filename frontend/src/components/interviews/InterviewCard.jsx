import { formatDateTime } from '@/utils/format'
import { interviewInterviewerName } from '@/utils/interview'
import StatusBadge from '@/components/common/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'

export default function InterviewCard({ interview }) {
  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="space-y-1">
          <p className="font-medium">{interview.interviewType} interview</p>
          <p className="text-sm text-muted-foreground">
            With {interviewInterviewerName(interview)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm">{formatDateTime(interview.scheduledAt)}</p>
          <StatusBadge status={interview.status} />
        </div>
      </CardContent>
    </Card>
  )
}