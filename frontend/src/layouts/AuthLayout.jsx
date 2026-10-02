import { Briefcase } from 'lucide-react'

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground text-primary">
            <Briefcase className="size-4" />
          </div>
          HireLoop
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            Hire with structure, not guesswork.
          </h2>
          <p className="max-w-md text-primary-foreground/70">
            Schedule interviews, build a question bank, score candidates consistently,
            and see who rises to the top.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/60">Interview management platform</p>
      </div>
      <div className="flex items-center justify-center bg-muted/40 p-4">{children}</div>
    </div>
  )
}