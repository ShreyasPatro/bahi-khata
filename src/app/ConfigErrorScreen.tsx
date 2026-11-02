import { ShieldAlert } from 'lucide-react'
import { ENV_HELP } from '@/lib/env'

/**
 * Shown instead of the app when required configuration is missing or unsafe.
 * Deliberately dependency-free (no router, no providers, no Supabase client).
 */
export function ConfigErrorScreen({ issues }: { issues: string[] }) {
  return (
    <main
      id="main"
      className="pt-safe pb-safe flex min-h-dvh items-center justify-center bg-background px-(--page-gutter)"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-card">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-warning-soft text-warning">
          <ShieldAlert className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-title font-semibold">Bahi can&apos;t start yet</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          The app is missing configuration. Nothing was sent anywhere.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-body-sm">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
        <p className="mt-4 text-body-sm text-muted-foreground">{ENV_HELP}</p>
      </div>
    </main>
  )
}
