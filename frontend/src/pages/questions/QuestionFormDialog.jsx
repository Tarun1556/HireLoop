import { useState } from 'react'
import { toast } from 'sonner'
import { useCreateQuestion, useUpdateQuestion } from '@/hooks/useQuestions'
import { QUESTION_CATEGORIES, QUESTION_DIFFICULTIES, labelize } from '@/utils/question'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function QuestionForm({ question, onDone }) {
  const isEdit = !!question
  const create = useCreateQuestion()
  const update = useUpdateQuestion()
  const mutation = isEdit ? update : create

  const [form, setForm] = useState({
    title: question?.title ?? '',
    category: question?.category ?? '',
    difficulty: question?.difficulty ?? '',
    description: question?.description ?? '',
  })
  const set = (field) => (value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.category || !form.difficulty) {
      toast.error('Title, category and difficulty are required')
      return
    }
    const payload = { ...form, title: form.title.trim() }
    mutation.mutate(isEdit ? { id: question.id, ...payload } : payload, {
      onSuccess: () => {
        toast.success(isEdit ? 'Question updated' : 'Question added')
        onDone()
      },
      onError: (err) => toast.error(err.response?.data?.message || 'Could not save question'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={form.title} onChange={(e) => set('title')(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={form.category} onValueChange={set('category')}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {QUESTION_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{labelize(c)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select value={form.difficulty} onValueChange={set('difficulty')}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {QUESTION_DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>{labelize(d)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={5}
          value={form.description}
          onChange={(e) => set('description')(e.target.value)}
        />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : isEdit ? 'Save changes' : 'Add question'}
        </Button>
      </DialogFooter>
    </form>
  )
}

// question = null -> create mode, question = {...} -> edit mode
export default function QuestionFormDialog({ open, question, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{question ? 'Edit question' : 'Add question'}</DialogTitle>
          <DialogDescription>
            {question ? 'Update the question details.' : 'Add a new question to the bank.'}
          </DialogDescription>
        </DialogHeader>
        <QuestionForm question={question} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}