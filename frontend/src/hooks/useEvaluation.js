import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/services/apiClient'

// "No evaluation yet" is a normal state, not an error
export function useEvaluation(interviewId) {
  return useQuery({
    queryKey: ['evaluations', interviewId],
    enabled: !!interviewId,
    retry: false,
    queryFn: async () => {
      try {
        return (await api.get(`/interviews/${interviewId}/evaluation`)).data
      } catch (err) {
        if ([400, 404].includes(err.response?.status)) return null // verify: status when none exists
        throw err
      }
    },
  })
}

export function useSaveEvaluation(interviewId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload) =>
      (await api.put(`/interviews/${interviewId}/evaluation`, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['evaluations'] })
      qc.invalidateQueries({ queryKey: ['rankings'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}