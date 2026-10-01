import { useQuery } from '@tanstack/react-query'
import api from '@/services/apiClient'

// ADMIN only: /users is admin-restricted on the backend
export function useInterviewers(enabled) {
  return useQuery({
    queryKey: ['users', 'interviewers'],
    enabled,
    queryFn: async () =>
      (await api.get('/users')).data.filter((u) => u.role === 'INTERVIEWER'),
  })
}