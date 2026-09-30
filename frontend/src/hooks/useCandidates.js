import { useQuery } from '@tanstack/react-query'
import api from '@/services/apiClient'

export function useCandidates() {
  return useQuery({
    queryKey: ['candidates'],
    queryFn: async () => (await api.get('/candidates')).data,
  })
}

export function useCandidate(id) {
  return useQuery({
    queryKey: ['candidates', id],
    queryFn: async () => (await api.get(`/candidates/${id}`)).data,
    enabled: !!id,
  })
}