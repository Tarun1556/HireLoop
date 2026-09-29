import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status
    const isAuthCall = error.config?.url?.startsWith('/auth/')
    // Backend returns 403 (not 401) for missing/expired JWT (known deferred item),
    // so treat 401 as logout; 403 handled per-page for now.
    if (status === 401 && !isAuthCall) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api