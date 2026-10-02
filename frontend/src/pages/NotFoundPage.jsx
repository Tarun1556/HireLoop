import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { homeForRole } from '@/utils/roles'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  const { user } = useAuth()
  const home = user ? homeForRole(user.role) : '/login'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-6xl font-semibold tracking-tight text-muted-foreground/50">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Button asChild className="mt-2">
        <Link to={home}>{user ? 'Back to home' : 'Go to sign in'}</Link>
      </Button>
    </div>
  )
}