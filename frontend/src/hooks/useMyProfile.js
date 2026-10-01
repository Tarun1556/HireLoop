import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/services/apiClient'

// "No profile yet" is a normal state for a new candidate, not an error
export function useMyProfile() {
  return useQuery({
    queryKey: ['candidates', 'me'],
    retry: false,
    queryFn: async () => {
      try {
        return (await api.get('/candidates/me')).data
      } catch (err) {
        if ([400, 404].includes(err.response?.status)) return null // verify: status when no profile
        throw err
      }
    },
  })
}

// POST creates the profile, PUT replaces it (full replace: send both fields)
export function useSaveMyProfile(exists) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload) =>
      (exists ? await api.put('/candidates/me', payload) : await api.post('/candidates/me', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['candidates'] }),
  })
}