import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarClock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCandidate } from '@/hooks/useCandidates'
import { useCandidateInterviews } from '@/hooks/useInterviews'
import { homeForRole } from '@/utils/roles'
import { candidateName, candidateEmail, formatDateTime, isSafeUrl } from '@/utils/format'
import StatusBadge from '@/components/common/StatusBadge'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function CandidateDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const base = homeForRole(user.role)

  const candidate = useCandidate(id)
  const interviews = useCandidateInterviews(id)

  if (candidate.isError) {
    return (
      <ErrorState
        title="Candidate not found"
        description="This candidate doesn't exist or couldn't be loaded."
        onRetry={candidate.refetch}
        retrying={candidate.isFetching}
      />
    )
  }

  const c = candidate.data

  return (
    <div className="space-y-6">
      <Link
        to={`${base}/candidates`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to candidates
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {candidate.isLoading ? <Skeleton className="h-7 w-48" /> : candidateName(c)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {candidate.isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <dl className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd className="mt-1 font-medium">{candidateEmail(c)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Experience</dt>
                <dd className="mt-1 font-medium">{c.experience ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Resume</dt>
                <dd className="mt-1 font-medium">
                  {isSafeUrl(c.resumeUrl) ? (
                    <a
                      href={c.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Open resume
                    </a>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interviews</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {interviews.isLoading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : interviews.isError ? (
            <ErrorState
              title="Couldn't load interviews"
              onRetry={interviews.refetch}
              retrying={interviews.isFetching}
            />
          ) : (interviews.data ?? []).length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="No interviews yet"
              description="Interviews scheduled for this candidate will show up here."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviews.data.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell>{formatDateTime(i.scheduledAt)}</TableCell>
                    <TableCell>{i.interviewType}</TableCell>
                    <TableCell>
                      <StatusBadge status={i.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}