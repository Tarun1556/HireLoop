import { Menu, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user.name
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-8">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="size-5" />
      </Button>
      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-none">{user.name}</p>
          <p className="mt-1 text-xs capitalize text-muted-foreground">
            {user.role.toLowerCase()}
          </p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
          {initials}
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  )
}