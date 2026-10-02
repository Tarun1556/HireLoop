// verify: field names against InterviewResponse / InterviewQuestionResponse
export const interviewCandidateName = (i) => i?.candidateName ?? i?.candidate?.name ?? 'Unknown'
export const interviewInterviewerName = (i) => i?.interviewerName ?? i?.interviewer?.name ?? 'Unknown'
export const interviewCandidateId = (i) => i?.candidateId ?? i?.candidate?.id

export const iqQuestionId = (q) => q?.questionId ?? q?.question?.id ?? q?.id
export const iqTitle = (q) => q?.title ?? q?.question?.title ?? 'Untitled'
export const iqCategory = (q) => q?.category ?? q?.question?.category
export const iqDifficulty = (q) => q?.difficulty ?? q?.question?.difficulty

export const INTERVIEW_TYPES = ['TECHNICAL', 'HR', 'MANAGERIAL', 'FINAL']
export const INTERVIEW_STATUSES = ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']

const ACTIVE_STATUSES = ['SCHEDULED', 'RESCHEDULED']

// Upcoming = active status and in the future (soonest first). Past = everything else (latest first).
export function splitInterviews(list = []) {
  const now = Date.now()
  const isUpcoming = (i) =>
    ACTIVE_STATUSES.includes(i.status) && new Date(i.scheduledAt).getTime() > now
  const byDate = (a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)

  return {
    upcoming: list.filter(isUpcoming).sort(byDate),
    past: list.filter((i) => !isUpcoming(i)).sort((a, b) => byDate(b, a)),
  }
}