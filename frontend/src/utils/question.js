export const QUESTION_CATEGORIES = [
  'DSA', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'DATABASE', 'OS', 'NETWORKING', 'HR',
]
export const QUESTION_DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD']

const ACRONYMS = new Set(['DSA', 'HR', 'OS'])

// SYSTEM_DESIGN -> "System Design", DSA stays "DSA"
export const labelize = (value) => {
  if (!value) return ''
  if (ACRONYMS.has(value)) return value
  return value
    .split('_')
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(' ')
}