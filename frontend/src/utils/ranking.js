// verify: field names against CandidateRanking
export const rankingCandidateId = (r) => r?.candidateId ?? r?.id
export const rankingName = (r) => r?.candidateName ?? r?.name ?? r?.candidate?.name ?? 'Unknown'
export const rankingScore = (r) => r?.averageScore ?? r?.averageOverallScore ?? r?.avgScore ?? 0
export const rankingCount = (r) => r?.evaluationCount ?? r?.totalEvaluations ?? null