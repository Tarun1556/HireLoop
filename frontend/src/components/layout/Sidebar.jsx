import { NavLink } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { NAV_BY_ROLE } from './nav-config'

export default function Sidebar({ onNavigate }) {
  const { user } = useAuth()
  const items = NAV_BY_ROLE[user.role] ?? []

  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Briefcase className="size-4" />
        </div>
        <span className="text-lg font-semibold tracking-tight">HireLoop</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}