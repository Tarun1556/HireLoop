import { useNavigate } from 'react-router-dom'
import { CalendarClock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useInterviews } from '@/hooks/useInterviews'
import { homeForRole } from '@/utils/roles'
import { formatDateTime } from '@/utils/format'
import { interviewCandidateName, interviewInterviewerName } from '@/utils/interview'
import StatusBadge from '@/components/common/StatusBadge'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import ScheduleInterviewDialog from './ScheduleInterviewDialog'

export default function InterviewsPage() {
  const { user } = useAuth()
  const base = homeForRole(user.role)
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch, isFetching } = useInterviews(user.role)

  if (isError) return <ErrorState onRetry={refetch} retrying={isFetching} />

  const rows = [...(data ?? [])].sort(
    (a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Interviews</h1>
          <p className="mt-1 text-muted-foreground">
            {user.role === 'ADMIN' ? 'All scheduled interviews.' : 'Interviews assigned to you.'}
          </p>
        </div>
        <ScheduleInterviewDialog />
      </div>

      <Card>
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No interviews yet"
            description="Schedule your first interview to get started."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Interviewer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((i) => (
                <TableRow
                  key={i.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`${base}/interviews/${i.id}`)}
                >
                  <TableCell>{formatDateTime(i.scheduledAt)}</TableCell>
                  <TableCell className="font-medium">{interviewCandidateName(i)}</TableCell>
                  <TableCell className="text-muted-foreground">{interviewInterviewerName(i)}</TableCell>
                  <TableCell>{i.interviewType}</TableCell>
                  <TableCell><StatusBadge status={i.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}