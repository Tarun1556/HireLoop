import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { NAV_BY_ROLE } from '@/components/layout/nav-config'
import ErrorBoundary from '@/components/common/ErrorBoundary'

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { user } = useAuth()

  // Tab title from the nav item whose path best matches the current route
  useEffect(() => {
    const items = NAV_BY_ROLE[user.role] ?? []
    const match = items
      .filter((i) => pathname === i.to || pathname.startsWith(i.to + '/'))
      .sort((a, b) => b.to.length - a.to.length)[0]
    document.title = match ? `${match.label} · HireLoop` : 'HireLoop'
  }, [pathname, user.role])

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 md:block">
        <Sidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64">
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="md:pl-64">
        <Topbar onMenuClick={() => setOpen(true)} />
        <main className="p-4 md:p-8">
          {/* key resets the boundary when the user navigates away from a crashed page */}
          <ErrorBoundary key={pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}