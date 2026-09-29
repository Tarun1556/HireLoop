import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { homeForRole } from '@/utils/roles'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import NotFoundPage from '@/pages/NotFoundPage'
import HomePlaceholder from '@/pages/HomePlaceholder'

function RootRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  return <Navigate to={user ? homeForRole(user.role) : '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<HomePlaceholder title="Admin Dashboard" />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['INTERVIEWER']} />}>
        <Route path="/interviewer" element={<HomePlaceholder title="Interviewer Home" />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
        <Route path="/candidate" element={<HomePlaceholder title="Candidate Home" />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}