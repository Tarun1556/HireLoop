import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { HelpCircle, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useQuestions, useDeleteQuestion } from '@/hooks/useQuestions'
import { QUESTION_CATEGORIES, QUESTION_DIFFICULTIES, labelize } from '@/utils/question'
import DifficultyBadge from '@/components/common/DifficultyBadge'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import QuestionFormDialog from './QuestionFormDialog'

export default function QuestionBankPage() {
  const { user } = useAuth()
  const isAdmin = user.role === 'ADMIN'
  const { data, isLoading, isError, refetch, isFetching } = useQuestions()
  const remove = useDeleteQuestion()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('ALL')
  const [difficulty, setDifficulty] = useState('ALL')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (data ?? []).filter(
      (item) =>
        (category === 'ALL' || item.category === category) &&
        (difficulty === 'ALL' || item.difficulty === difficulty) &&
        item.title.toLowerCase().includes(q)
    )
  }, [data, query, category, difficulty])

  const hasFilters = query || category !== 'ALL' || difficulty !== 'ALL'

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (item) => { setEditing(item); setFormOpen(true) }

  const confirmDelete = () => {
    const target = deleting
    remove.mutate(target.id, {
      onSuccess: () => toast.success('Question deleted'),
      onError: (err) =>
        toast.error(
          err.response?.data?.message ||
            'Could not delete. It may be attached to an interview.'
        ),
    })
    setDeleting(null)
  }

  if (isError) return <ErrorState onRetry={refetch} retrying={isFetching} />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Question Bank</h1>
          <p className="mt-1 text-muted-foreground">
            {isAdmin ? 'Manage interview questions.' : 'Browse interview questions.'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={openCreate}>
            <Plus className="size-4" /> Add question
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All categories</SelectItem>
            {QUESTION_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{labelize(c)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All difficulties</SelectItem>
            {QUESTION_DIFFICULTIES.map((d) => (
              <SelectItem key={d} value={d}>{labelize(d)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={HelpCircle}
            title={hasFilters ? 'No matching questions' : 'No questions yet'}
            description={
              hasFilters
                ? 'Try changing your search or filters.'
                : isAdmin
                  ? 'Add your first question to build the bank.'
                  : 'An admin needs to add questions first.'
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                {isAdmin && <TableHead className="w-24 text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-md">
                    <p className="font-medium">{item.title}</p>
                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell><Badge variant="secondary">{labelize(item.category)}</Badge></TableCell>
                  <TableCell><DifficultyBadge difficulty={item.difficulty} /></TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => openEdit(item)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete" onClick={() => setDeleting(item)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <QuestionFormDialog open={formOpen} question={editing} onOpenChange={setFormOpen} />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this question?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleting?.title}" will be permanently removed from the bank. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}