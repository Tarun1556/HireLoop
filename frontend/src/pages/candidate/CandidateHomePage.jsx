import { Link } from 'react-router-dom'
import { CalendarClock, CheckCircle2, ListChecks, UserCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useMyProfile } from '@/hooks/useMyProfile'
import { useMyInterviews } from '@/hooks/useInterviews'
import StatCard from '@/components/dashboard/StatCard'
import InterviewCard from '@/components/interviews/InterviewCard'
import ErrorState from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const ACTIVE = ['SCHEDULED', 'RESCHEDULED']

export default function CandidateHomePage() {
  const { user } = useAuth()
  const profile = useMyProfile()
  const hasProfile = !!profile.data
  const interviews = useMyInterviews(hasProfile)

  if (profile.isError || interviews.isError) {
    return (
      <ErrorState
        onRetry={() => { profile.refetch(); interviews.refetch() }}
        retrying={profile.isFetching || interviews.isFetching}
      />
    )
  }

  const loading = profile.isLoading || interviews.isLoading
  const list = interviews.data ?? []
  const now = Date.now()
  const upcoming = list
    .filter((i) => ACTIVE.includes(i.status) && new Date(i.scheduledAt) > now)
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
  const completed = list.filter((i) => i.status === 'COMPLETED').length
  const next = upcoming[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {user.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-muted-foreground">Here's where things stand.</p>
      </div>

      {profile.data === null && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="size-5" /> Complete your profile
            </CardTitle>
            <CardDescription>
              Add your resume and experience so interviewers can review you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/candidate/profile">Create profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Upcoming" value={upcoming.length} icon={CalendarClock} loading={loading} />
        <StatCard title="Completed" value={completed} icon={CheckCircle2} loading={loading} />
        <StatCard title="Total interviews" value={list.length} icon={ListChecks} loading={loading} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Next interview</h2>
          <Link
            to="/candidate/interviews"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>
        {loading ? (
          <Skeleton className="h-20 w-full" />
        ) : next ? (
          <InterviewCard interview={next} />
        ) : (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No upcoming interviews. You'll see them here once one is scheduled.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}