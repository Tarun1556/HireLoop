import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/services/apiClient'

export function useQuestions() {
  return useQuery({
    queryKey: ['questions'],
    queryFn: async () => (await api.get('/questions')).data,
  })
}

export function useCreateQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => (await api.post('/questions', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['questions'] }),
  })
}

// PUT is a full replace on the backend: always send all four fields
export function useUpdateQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }) => (await api.put(`/questions/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['questions'] }),
  })
}

export function useDeleteQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => api.delete(`/questions/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['questions'] }),
  })
}