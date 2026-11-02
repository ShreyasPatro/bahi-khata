import { Link, Outlet } from 'react-router-dom'
import { BahiLogo } from '@/components/layout/BahiLogo'

/** Minimal frame for pre-login screens (login, onboarding). */
export function CenteredLayout() {
  return (
    <div className="pt-safe pb-safe px-safe flex min-h-dvh flex-col bg-background">
      <header className="mx-auto w-full max-w-md px-(--page-gutter) py-5">
        <Link
          to="/welcome"
          className="inline-flex rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BahiLogo />
        </Link>
      </header>
      <main id="main" className="mx-auto w-full max-w-md flex-1 px-(--page-gutter) py-6">
        <Outlet />
      </main>
    </div>
  )
}
