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