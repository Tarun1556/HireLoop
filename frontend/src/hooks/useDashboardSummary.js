import { useQuery } from '@tanstack/react-query'
import api from '@/services/apiClient'

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => (await api.get('/dashboard/summary')).data,
  })
}