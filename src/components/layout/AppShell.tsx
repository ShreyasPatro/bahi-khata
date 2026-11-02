import { useState } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import type { ShellContext } from '@/components/layout/useShell'
import { DesktopSidebar } from '@/components/layout/DesktopSidebar'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { QuickAdd } from '@/components/shared/QuickAdd'

/**
 * Application frame.
 * - Phones (<768px): content + bottom navigation + bottom sheets.
 * - Tablet (768px+): icon rail sidebar.
 * - Laptop (1024px+): full sidebar.
 * Pages choose whether to show a contextual right panel via PageContainer's `aside`.
 */
export function AppShell() {
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>

      <DesktopSidebar onAdd={() => setAddOpen(true)} />

      <div className="md:pl-[4.5rem] lg:pl-(--w-sidebar)">
        <aside
          aria-label="Design preview notice"
          className="pt-safe bg-primary-soft px-4 py-1.5 text-center text-caption font-medium text-primary-dark"
        >
          Design preview · all data on screen is fictional
        </aside>
        <main
          id="main"
          tabIndex={-1}
          className="px-safe pb-[calc(var(--h-bottom-nav)+env(safe-area-inset-bottom)+1.5rem)] outline-none md:pb-8"
        >
          <Outlet context={{ openQuickAdd: () => setAddOpen(true) } satisfies ShellContext} />
        </main>
      </div>

      <MobileBottomNav onAdd={() => setAddOpen(true)} />
      <QuickAdd open={addOpen} onOpenChange={setAddOpen} />
      <ScrollRestoration />
    </div>
  )
}
