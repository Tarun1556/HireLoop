import { useQuery } from '@tanstack/react-query'
import api from '@/services/apiClient'

export function useCandidateInterviews(candidateId) {
  return useQuery({
    queryKey: ['interviews', 'candidate', candidateId],
    queryFn: async () => (await api.get(`/interviews/candidate/${candidateId}`)).data,
    enabled: !!candidateId,
  })
}