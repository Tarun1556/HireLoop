import { useQuery } from '@tanstack/react-query'
import api from '@/services/apiClient'

export function useQuestions() {
  return useQuery({
    queryKey: ['questions'],
    queryFn: async () => (await api.get('/questions')).data,
  })
}