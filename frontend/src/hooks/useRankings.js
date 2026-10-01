import { useQuery } from '@tanstack/react-query'
import api from '@/services/apiClient'

export function useRankings() {
  return useQuery({
    queryKey: ['rankings'],
    queryFn: async () => (await api.get('/candidates/rankings')).data,
  })
}