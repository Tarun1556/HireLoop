import { CalendarClock } from 'lucide-react'
import { useMyInterviews } from '@/hooks/useInterviews'
import { useMyProfile } from '@/hooks/useMyProfile'
import InterviewCard from '@/components/interviews/InterviewCard'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const ACTIVE = ['SCHEDULED', 'RESCHEDULED']

function Section({ title, items }) {
  if (items.length === 0) return null
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {items.map((i) => (
        <InterviewCard key={i.id} interview={i} />
      ))}
    </div>
  )
}

export default function MyInterviewsPage() {
  const profile = useMyProfile()
  const hasProfile = !!profile.data
  const {
    data,
    isLoading: interviewsLoading,
    isError,
    refetch,
    isFetching,
  } = useMyInterviews(hasProfile)
  const isLoading = profile.isLoading || interviewsLoading

  if (profile.isError || isError) {
    return (
      <ErrorState
        onRetry={() => {
          profile.refetch()
          refetch()
        }}
        retrying={isFetching || profile.isFetching}
      />
    )
  }

  const list = data ?? []
  const now = Date.now()
  const isUpcoming = (i) => ACTIVE.includes(i.status) && new Date(i.scheduledAt) > now
  const upcoming = list
    .filter(isUpcoming)
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
  const past = list
    .filter((i) => !isUpcoming(i))
    .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Interviews</h1>
        <p className="mt-1 text-muted-foreground">Your scheduled and past interviews.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <Card>
          <EmptyState
            icon={CalendarClock}
            title={hasProfile ? 'No interviews yet' : 'Create your profile first'}
            description={
              hasProfile
                ? 'When an interviewer schedules one for you, it will show up here.'
                : 'Interviews are linked to your candidate profile. Create it from My Profile.'
            }
          />
        </Card>
      ) : (
        <>
          <Section title="Upcoming" items={upcoming} />
          <Section title="Past" items={past} />
        </>
      )}
    </div>
  )
}