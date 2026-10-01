import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, HelpCircle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import {
  useInterview, useUpdateInterview, useInterviewQuestions, useAttachQuestion, useDetachQuestion,
} from '@/hooks/useInterviews'
import { useQuestions } from '@/hooks/useQuestions'
import { homeForRole } from '@/utils/roles'
import { formatDateTime } from '@/utils/format'
import {
  INTERVIEW_STATUSES, interviewCandidateId, interviewCandidateName, interviewInterviewerName,
  iqQuestionId, iqTitle, iqCategory, iqDifficulty,
} from '@/utils/interview'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const apiError = (err, fallback) => err.response?.data?.message || fallback

export default function InterviewDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const base = homeForRole(user.role)

  const interview = useInterview(id)
  const update = useUpdateInterview(id)
  const attached = useInterviewQuestions(id)
  const bank = useQuestions()
  const attach = useAttachQuestion(id)
  const detach = useDetachQuestion(id)
  const [pick, setPick] = useState('')

  if (interview.isError) {
    return (
      <ErrorState
        title="Interview not found"
        description="It doesn't exist, or you don't have access to it."
        onRetry={interview.refetch}
        retrying={interview.isFetching}
      />
    )
  }

  const i = interview.data
  const attachedIds = new Set((attached.data ?? []).map(iqQuestionId))
  const available = (bank.data ?? []).filter((q) => !attachedIds.has(q.id))

  const changeStatus = (status) =>
    update.mutate(
      { status },
      {
        onSuccess: () => toast.success('Status updated'),
        onError: (err) => toast.error(apiError(err, 'Could not update status')),
      }
    )

  const handleAttach = () => {
    if (!pick) return
    attach.mutate(Number(pick), {
      onSuccess: () => {
        toast.success('Question attached')
        setPick('')
      },
      onError: (err) => toast.error(apiError(err, 'Could not attach question')),
    })
  }

  return (
    <div className="space-y-6">
      <Link
        to={`${base}/interviews`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to interviews
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {interview.isLoading ? <Skeleton className="h-7 w-56" /> : `${i.interviewType} interview`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {interview.isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-sm text-muted-foreground">Candidate</dt>
                <dd className="mt-1 font-medium">
                  <Link
                    to={`${base}/candidates/${interviewCandidateId(i)}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {interviewCandidateName(i)}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Interviewer</dt>
                <dd className="mt-1 font-medium">{interviewInterviewerName(i)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Scheduled</dt>
                <dd className="mt-1 font-medium">{formatDateTime(i.scheduledAt)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Status</dt>
                <dd className="mt-1">
                  <Select value={i.status} onValueChange={changeStatus} disabled={update.isPending}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVIEW_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Select value={pick} onValueChange={setPick}>
              <SelectTrigger className="w-full sm:w-80">
                <SelectValue
                  placeholder={available.length ? 'Select a question to attach' : 'No more questions available'}
                />
              </SelectTrigger>
              <SelectContent>
                {available.map((q) => (
                  <SelectItem key={q.id} value={String(q.id)}>{q.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAttach} disabled={!pick || attach.isPending}>
              {attach.isPending ? 'Attaching...' : 'Attach'}
            </Button>
          </div>

          {attached.isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : attached.isError ? (
            <ErrorState
              title="Couldn't load questions"
              onRetry={attached.refetch}
              retrying={attached.isFetching}
            />
          ) : (attached.data ?? []).length === 0 ? (
            <EmptyState
              icon={HelpCircle}
              title="No questions attached"
              description="Attach questions from the question bank to prepare this interview."
            />
          ) : (
            <ul className="divide-y rounded-md border">
              {attached.data.map((q) => {
                const qid = iqQuestionId(q)
                return (
                  <li key={qid} className="flex items-center justify-between gap-4 p-4">
                    <div className="space-y-1">
                      <p className="font-medium">{iqTitle(q)}</p>
                      <div className="flex gap-2">
                        {iqCategory(q) && <Badge variant="secondary">{iqCategory(q)}</Badge>}
                        {iqDifficulty(q) && <Badge variant="outline">{iqDifficulty(q)}</Badge>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Detach"
                      disabled={detach.isPending}
                      onClick={() =>
                        detach.mutate(qid, {
                          onSuccess: () => toast.success('Question detached'),
                          onError: (err) => toast.error(apiError(err, 'Could not detach question')),
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}