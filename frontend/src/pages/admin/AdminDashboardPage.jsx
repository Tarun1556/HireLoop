import { Users, UserCheck, CalendarClock, HelpCircle, ClipboardCheck, Star } from 'lucide-react'
import { useDashboardSummary } from '@/hooks/useDashboardSummary'
import StatCard from '@/components/dashboard/StatCard'
import InterviewStatusChart from '@/components/dashboard/InterviewStatusChart'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch, isFetching } = useDashboardSummary()

  if (isError) {
    return (
      <Card className="mx-auto mt-10 max-w-md text-center">
        <CardHeader>
          <CardTitle>Couldn't load dashboard</CardTitle>
          <CardDescription>Something went wrong while fetching the summary.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Retrying...' : 'Try again'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const avg =
    data?.averageOverallScore == null ? '—' : Number(data.averageOverallScore).toFixed(1)

  const stats = [
    { title: 'Candidates', value: data?.totalCandidates, icon: Users },
    { title: 'Interviewers', value: data?.totalInterviewers, icon: UserCheck },
    { title: 'Interviews', value: data?.totalInterviews, icon: CalendarClock },
    { title: 'Questions', value: data?.totalQuestions, icon: HelpCircle },
    { title: 'Evaluations', value: data?.totalEvaluations, icon: ClipboardCheck },
    { title: 'Avg. Score', value: avg, icon: Star },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Overview of your hiring pipeline.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} loading={isLoading} />
        ))}
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Interviews by status</CardTitle>
          <CardDescription>Current distribution across all interviews.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <InterviewStatusChart
              scheduled={data.scheduledInterviews}
              completed={data.completedInterviews}
              cancelled={data.cancelledInterviews}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}