import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useCandidates } from '@/hooks/useCandidates'
import { useInterviewers } from '@/hooks/useUsers'
import { useScheduleInterview } from '@/hooks/useInterviews'
import { candidateName } from '@/utils/format'
import { INTERVIEW_TYPES } from '@/utils/interview'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const EMPTY = { candidateId: '', interviewerId: '', scheduledAt: '', interviewType: '' }

export default function ScheduleInterviewDialog() {
  const { user } = useAuth()
  const isAdmin = user.role === 'ADMIN'
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)

  const candidates = useCandidates()
  const interviewers = useInterviewers(isAdmin)
  const schedule = useScheduleInterview()

  const set = (field) => (value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const interviewerId = isAdmin ? form.interviewerId : user.id
    if (!form.candidateId || !interviewerId || !form.scheduledAt || !form.interviewType) {
      toast.error('Please fill in all fields')
      return
    }
    schedule.mutate(
      {
        candidateId: Number(form.candidateId),
        interviewerId: Number(interviewerId),
        scheduledAt: form.scheduledAt,
        interviewType: form.interviewType,
      },
      {
        onSuccess: () => {
          toast.success('Interview scheduled')
          setOpen(false)
          setForm(EMPTY)
        },
        onError: (err) =>
          toast.error(err.response?.data?.message || 'Could not schedule interview'),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" /> Schedule interview
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule interview</DialogTitle>
          <DialogDescription>Pick a candidate, a time, and the interview type.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Candidate</Label>
            <Select value={form.candidateId} onValueChange={set('candidateId')}>
              <SelectTrigger>
                <SelectValue placeholder="Select a candidate" />
              </SelectTrigger>
              <SelectContent>
                {(candidates.data ?? []).map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {candidateName(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isAdmin && (
            <div className="space-y-2">
              <Label>Interviewer</Label>
              <Select value={form.interviewerId} onValueChange={set('interviewerId')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an interviewer" />
                </SelectTrigger>
                <SelectContent>
                  {(interviewers.data ?? []).map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Date & time</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => set('scheduledAt')(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={form.interviewType} onValueChange={set('interviewType')}>
              <SelectTrigger>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {INTERVIEW_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={schedule.isPending}>
              {schedule.isPending ? 'Scheduling...' : 'Schedule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}