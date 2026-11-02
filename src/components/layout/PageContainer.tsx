import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: ReactNode
  /** Optional contextual right panel. Shown from 1440px; below that the page should stand alone. */
  aside?: ReactNode
  className?: string
}

/** Consistent page gutters and max width, with an optional sticky right panel on wide screens. */
export function PageContainer({ children, aside, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-(--page-max) px-(--page-gutter) pb-6 md:pt-6',
        aside && 'xl:grid xl:grid-cols-[minmax(0,1fr)_var(--w-right-panel)] xl:gap-8',
        className,
      )}
    >
      <div className="min-w-0 space-y-5 md:space-y-6">{children}</div>
      {aside && (
        <aside aria-label="Details" className="sticky top-6 hidden space-y-4 self-start xl:block">
          {aside}
        </aside>
      )}
    </div>
  )
}
