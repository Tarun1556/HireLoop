import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useMyProfile, useSaveMyProfile } from '@/hooks/useMyProfile'
import { isSafeUrl } from '@/utils/format'
import ErrorState from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function ProfileForm({ profile }) {
  const exists = !!profile
  const save = useSaveMyProfile(exists)
  const [form, setForm] = useState({
    resumeUrl: profile?.resumeUrl ?? '',
    experience: profile?.experience ?? '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const resumeUrl = form.resumeUrl.trim()
    if (resumeUrl && !isSafeUrl(resumeUrl)) {
      toast.error('Resume link must start with http:// or https://')
      return
    }
    save.mutate(
      { resumeUrl, experience: form.experience.trim() },
      {
        onSuccess: () => toast.success(exists ? 'Profile updated' : 'Profile created'),
        onError: (err) => toast.error(err.response?.data?.message || 'Could not save profile'),
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="experience">Experience</Label>
        <Input
          id="experience"
          placeholder="e.g. Fresher, 2 years in backend development"
          value={form.experience}
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resumeUrl">Resume link</Label>
        <Input
          id="resumeUrl"
          type="url"
          placeholder="https://drive.google.com/..."
          value={form.resumeUrl}
          onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
        />
        {isSafeUrl(profile?.resumeUrl) && (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Open current resume
          </a>
        )}
      </div>
      <Button type="submit" disabled={save.isPending}>
        {save.isPending ? 'Saving...' : exists ? 'Save changes' : 'Create profile'}
      </Button>
    </form>
  )
}

export default function MyProfilePage() {
  const { user } = useAuth()
  const { data: profile, isLoading, isError, refetch, isFetching } = useMyProfile()

  if (isError) return <ErrorState onRetry={refetch} retrying={isFetching} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
        <p className="mt-1 text-muted-foreground">
          {profile ? 'Keep your details up to date.' : 'Create your candidate profile to get started.'}
        </p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <ProfileForm key={profile?.id ?? 'new'} profile={profile} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}