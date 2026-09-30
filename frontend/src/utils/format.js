export const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : '—'

// verify: field names against your CandidateResponse
export const candidateName = (c) => c?.name ?? c?.user?.name ?? 'Unknown'
export const candidateEmail = (c) => c?.email ?? c?.user?.email ?? '—'

// Resume URLs are user-supplied: only allow http(s) links
export const isSafeUrl = (url) => /^https?:\/\//i.test(url ?? '')