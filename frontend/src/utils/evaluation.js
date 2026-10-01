// verify: against validation annotations in EvaluationRequest
export const SCORE_MIN = 1
export const SCORE_MAX = 10

// Display only. The server computes overallScore; these mirror its weights for the hint text.
export const WEIGHTS = {
  TECHNICAL: { technical: 50, communication: 20, problemSolving: 30 },
  HR: { technical: 20, communication: 50, problemSolving: 30 },
  MANAGERIAL: { technical: 20, communication: 40, problemSolving: 40 },
  FINAL: { technical: 34, communication: 33, problemSolving: 33 },
}

export const formatScore = (n) => (n == null ? '—' : Number(n).toFixed(1))