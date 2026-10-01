import { useState } from 'react'
import { toast } from 'sonner'
import { useEvaluation, useSaveEvaluation } from '@/hooks/useEvaluation'
import { SCORE_MAX, SCORE_MIN, WEIGHTS, formatScore } from '@/utils/evaluation'
import ErrorState from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const FIELDS = [
  { key: 'technicalScore', label: 'Technical' },
  { key: 'communicationScore', label: 'Communication' },
  { key: 'problemSolvingScore', label: 'Problem solving' },
]

function EvaluationForm({ interviewId, evaluation }) {
  const save = useSaveEvaluation(interviewId)
  const [scores, setScores] = useState(
    Object.fromEntries(FIELDS.map((f) => [f.key, evaluation?.[f.key] ?? '']))
  )
  const [feedback, setFeedback] = useState(evaluation?.feedback ?? '')

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {}
    for (const { key, label } of FIELDS) {
      const n = Number(scores[key])
      if (scores[key] === '' || Number.isNaN(n) || n < SCORE_MIN || n > SCORE_MAX) {
        toast.error(`${label} score must be between ${SCORE_MIN} and ${SCORE_MAX}`)
        return
      }
      payload[key] = n
    }
    payload.feedback = feedback.trim()

    save.mutate(payload, {
      onSuccess: () => toast.success(evaluation ? 'Evaluation updated' : 'Evaluation saved'),
      onError: (err) => toast.error(err.response?.data?.message || 'Could not save evaluation'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {FIELDS.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>
              {label} ({SCORE_MIN}-{SCORE_MAX})
            </Label>
            <Input
              id={key}
              type="number"
              min={SCORE_MIN}
              max={SCORE_MAX}
              step="1"
              value={scores[key]}
              onChange={(e) => setScores((s) => ({ ...s, [key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback">Feedback</Label>
        <Textarea
          id="feedback"
          rows={4}
          placeholder="Strengths, weaknesses, and a hiring recommendation"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={save.isPending}>
        {save.isPending ? 'Saving...' : evaluation ? 'Update evaluation' : 'Save evaluation'}
      </Button>
    </form>
  )
}

export default function EvaluationCard({ interviewId, interviewType }) {
  const { data: evaluation, isLoading, isError, refetch, isFetching } = useEvaluation(interviewId)
  const w = WEIGHTS[interviewType]

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>Evaluation</CardTitle>
          {w && (
            <CardDescription>
              {interviewType} weighting: {w.technical}% technical, {w.communication}% communication,{' '}
              {w.problemSolving}% problem solving
            </CardDescription>
          )}
        </div>
        {evaluation && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Overall</p>
            <p className="text-2xl font-semibold tracking-tight">
              {formatScore(evaluation.overallScore)}
              <span className="text-sm font-normal text-muted-foreground"> / {SCORE_MAX}</span>
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : isError ? (
          <ErrorState
            title="Couldn't load evaluation"
            onRetry={refetch}
            retrying={isFetching}
          />
        ) : (
          <EvaluationForm
            key={evaluation?.updatedAt ?? 'new'}
            interviewId={interviewId}
            evaluation={evaluation}
          />
        )}
      </CardContent>
    </Card>
  )
}