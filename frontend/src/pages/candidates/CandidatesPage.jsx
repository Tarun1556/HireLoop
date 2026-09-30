import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Users } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCandidates } from '@/hooks/useCandidates'
import { homeForRole } from '@/utils/roles'
import { candidateName, candidateEmail, isSafeUrl } from '@/utils/format'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function CandidatesPage() {
  const { user } = useAuth()
  const base = homeForRole(user.role)
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch, isFetching } = useCandidates()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (data ?? []).filter((c) =>
      `${candidateName(c)} ${candidateEmail(c)}`.toLowerCase().includes(q)
    )
  }, [data, query])

  if (isError) return <ErrorState onRetry={refetch} retrying={isFetching} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Candidates</h1>
        <p className="mt-1 text-muted-foreground">Everyone with a candidate profile.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email"
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Card>
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={query ? 'No matches' : 'No candidates yet'}
            description={
              query
                ? 'Try a different name or email.'
                : 'Candidates appear here once they create their profile.'
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Resume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow
                  key={c.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`${base}/candidates/${c.id}`)}
                >
                  <TableCell className="font-medium">{candidateName(c)}</TableCell>
                  <TableCell className="text-muted-foreground">{candidateEmail(c)}</TableCell>
                  <TableCell>{c.experience ?? '—'}</TableCell>
                  <TableCell>
                    {isSafeUrl(c.resumeUrl) ? (
                      <a
                        href={c.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline-offset-4 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View
                      </a>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}