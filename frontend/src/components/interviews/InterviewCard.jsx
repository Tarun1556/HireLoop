import { Link } from 'react-router-dom'
import { formatDateTime } from '@/utils/format'
import { interviewCandidateName, interviewInterviewerName } from '@/utils/interview'
import StatusBadge from '@/components/common/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'

// perspective: whose view this is. A candidate sees the interviewer; an interviewer sees the candidate.
export default function InterviewCard({ interview, perspective = 'candidate', to }) {
  const who =
    perspective === 'interviewer'
      ? `For ${interviewCandidateName(interview)}`
      : `With ${interviewInterviewerName(interview)}`

  const card = (
    <Card className={to ? 'transition-colors hover:bg-muted/50' : ''}>
      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="space-y-1">
          <p className="font-medium">{interview.interviewType} interview</p>
          <p className="text-sm text-muted-foreground">{who}</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm">{formatDateTime(interview.scheduledAt)}</p>
          <StatusBadge status={interview.status} />
        </div>
      </CardContent>
    </Card>
  )

  return to ? <Link to={to} className="block">{card}</Link> : card
}