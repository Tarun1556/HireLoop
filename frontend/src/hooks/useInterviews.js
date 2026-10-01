import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/services/apiClient'

export function useCandidateInterviews(candidateId) {
  return useQuery({
    queryKey: ['interviews', 'candidate', candidateId],
    queryFn: async () => (await api.get(`/interviews/candidate/${candidateId}`)).data,
    enabled: !!candidateId,
  })
}

// ADMIN sees all interviews, INTERVIEWER sees their own
export function useInterviews(role) {
  const url = role === 'ADMIN' ? '/interviews' : '/interviews/me'
  return useQuery({
    queryKey: ['interviews', 'list', role],
    queryFn: async () => (await api.get(url)).data,
  })
}

export function useInterview(id) {
  return useQuery({
    queryKey: ['interviews', id],
    queryFn: async () => (await api.get(`/interviews/${id}`)).data,
    enabled: !!id,
  })
}

export function useScheduleInterview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => (await api.post('/interviews', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['interviews'] }),
  })
}

export function useUpdateInterview(id) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => (await api.patch(`/interviews/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['interviews'] }),
  })
}

export function useInterviewQuestions(id) {
  return useQuery({
    queryKey: ['interviews', id, 'questions'],
    queryFn: async () => (await api.get(`/interviews/${id}/questions`)).data,
    enabled: !!id,
  })
}

export function useAttachQuestion(id) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (questionId) =>
      (await api.post(`/interviews/${id}/questions`, { questionId })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['interviews', id, 'questions'] }),
  })
}

export function useDetachQuestion(id) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (questionId) => api.delete(`/interviews/${id}/questions/${questionId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['interviews', id, 'questions'] }),
  })
}