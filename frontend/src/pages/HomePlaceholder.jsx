import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export default function HomePlaceholder({ title }) {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">
        Signed in as {user?.name} ({user?.role})
      </p>
      <Button variant="outline" onClick={logout}>Log out</Button>
    </div>
  )
}