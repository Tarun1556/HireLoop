import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { homeForRole } from '@/utils/roles'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import NotFoundPage from '@/pages/NotFoundPage'
import AppLayout from '@/layouts/AppLayout'
import PagePlaceholder from '@/pages/PagePlaceholder'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import CandidatesPage from '@/pages/candidates/CandidatesPage'
import CandidateDetailPage from '@/pages/candidates/CandidateDetailPage'

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
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/candidates" element={<CandidatesPage />} />
          <Route path="/admin/candidates/:id" element={<CandidateDetailPage />} />
          <Route path="/admin/interviews" element={<PagePlaceholder title="Interviews" />} />
          <Route path="/admin/questions" element={<PagePlaceholder title="Question Bank" />} />
          <Route path="/admin/rankings" element={<PagePlaceholder title="Rankings" />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['INTERVIEWER']} />}>
        <Route element={<AppLayout />}>
          <Route path="/interviewer" element={<PagePlaceholder title="Interviewer Home" />} />
          <Route path="/interviewer/interviews" element={<PagePlaceholder title="My Interviews" />} />
          <Route path="/interviewer/candidates" element={<CandidatesPage />} />
          <Route path="/interviewer/candidates/:id" element={<CandidateDetailPage />} />
          <Route path="/interviewer/questions" element={<PagePlaceholder title="Question Bank" />} />
          <Route path="/interviewer/rankings" element={<PagePlaceholder title="Rankings" />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
        <Route element={<AppLayout />}>
          <Route path="/candidate" element={<PagePlaceholder title="Candidate Home" />} />
          <Route path="/candidate/profile" element={<PagePlaceholder title="My Profile" />} />
          <Route path="/candidate/interviews" element={<PagePlaceholder title="My Interviews" />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}