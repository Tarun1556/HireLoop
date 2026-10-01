import { useNavigate } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/hooks/useAuth'
import { useRankings } from '@/hooks/useRankings'
import { homeForRole } from '@/utils/roles'
import { SCORE_MAX, formatScore } from '@/utils/evaluation'
import { rankingCandidateId, rankingCount, rankingName, rankingScore } from '@/utils/ranking'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const MEDALS = { 1: 'text-yellow-500', 2: 'text-slate-400', 3: 'text-amber-700' }

export default function RankingsPage() {
  const { user } = useAuth()
  const base = homeForRole(user.role)
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch, isFetching } = useRankings()

  if (isError) return <ErrorState onRetry={refetch} retrying={isFetching} />

  // Equal scores share a rank (backend has no tiebreaker)
  const rows = (data ?? []).map((r, idx, arr) => {
    let rank = idx + 1
    if (idx > 0 && rankingScore(arr[idx - 1]) === rankingScore(r)) {
      rank = arr[idx - 1]._rank
    }
    r._rank = rank
    return r
  })

  const chartData = rows.slice(0, 10).map((r) => ({
    name: rankingName(r),
    score: Number(Number(rankingScore(r)).toFixed(1)),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Rankings</h1>
        <p className="mt-1 text-muted-foreground">
          Candidates ranked by average overall score across their evaluations.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : rows.length === 0 ? (
        <Card>
          <EmptyState
            icon={Trophy}
            title="No rankings yet"
            description="Candidates appear here once at least one of their interviews is evaluated."
          />
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Top candidates</CardTitle>
              <CardDescription>Average overall score, top 10.</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: Math.max(160, chartData.length * 44) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, SCORE_MAX]} />
                    <YAxis type="category" dataKey="name" width={130} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Rank</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Average score</TableHead>
                  {rankingCount(rows[0]) != null && <TableHead>Evaluations</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow
                    key={rankingCandidateId(r)}
                    className="cursor-pointer"
                    onClick={() => navigate(`${base}/candidates/${rankingCandidateId(r)}`)}
                  >
                    <TableCell>
                      <span className="inline-flex items-center gap-2 font-medium">
                        {MEDALS[r._rank] ? (
                          <Trophy className={`size-4 ${MEDALS[r._rank]}`} />
                        ) : (
                          <span className="inline-block w-4" />
                        )}
                        {r._rank}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{rankingName(r)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${(rankingScore(r) / SCORE_MAX) * 100}%` }}
                          />
                        </div>
                        <span className="font-medium">{formatScore(rankingScore(r))}</span>
                      </div>
                    </TableCell>
                    {rankingCount(r) != null && <TableCell>{rankingCount(r)}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  )
}