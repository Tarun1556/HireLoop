import { Link } from 'react-router-dom'
import { CalendarClock, CheckCircle2, ListChecks } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useInterviews } from '@/hooks/useInterviews'
import { splitInterviews } from '@/utils/interview'
import StatCard from '@/components/dashboard/StatCard'
import InterviewCard from '@/components/interviews/InterviewCard'
import ErrorState from '@/components/common/ErrorState'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function InterviewerHomePage() {
  const { user } = useAuth()
  const { data, isLoading, isError, refetch, isFetching } = useInterviews('INTERVIEWER')

  if (isError) return <ErrorState onRetry={refetch} retrying={isFetching} />

  const list = data ?? []
  const { upcoming } = splitInterviews(list)
  const completed = list.filter((i) => i.status === 'COMPLETED').length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {user.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-muted-foreground">Your interview schedule at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Upcoming" value={upcoming.length} icon={CalendarClock} loading={isLoading} />
        <StatCard title="Completed" value={completed} icon={CheckCircle2} loading={isLoading} />
        <StatCard title="Total assigned" value={list.length} icon={ListChecks} loading={isLoading} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Coming up</h2>
          <Link
            to="/interviewer/interviews"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>
        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : upcoming.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No upcoming interviews. Schedule one from the Interviews page.
            </CardContent>
          </Card>
        ) : (
          upcoming.slice(0, 5).map((i) => (
            <InterviewCard
              key={i.id}
              interview={i}
              perspective="interviewer"
              to={`/interviewer/interviews/${i.id}`}
            />
          ))
        )}
      </div>
    </div>
  )
}