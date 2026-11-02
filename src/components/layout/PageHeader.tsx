import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  back?: { to: string; label: string }
  actions?: ReactNode
  className?: string
}

/**
 * Compact sticky top bar on phones; a larger title with description from the tablet breakpoint.
 * Place it as the first child of PageContainer.
 */
export function PageHeader({ title, description, back, actions, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'pt-safe -mx-(--page-gutter) px-(--page-gutter) max-md:sticky max-md:top-0 max-md:z-20 max-md:border-b max-md:bg-background/90 max-md:backdrop-blur',
        className,
      )}
    >
      <div className="flex min-h-(--h-header) items-center gap-2 md:min-h-0 md:items-end md:gap-4">
        {back && (
          <Link
            to={back.to}
            aria-label={`Back to ${back.label}`}
            className="-ml-2 flex size-(--h-control-lg) shrink-0 items-center justify-center rounded-xl text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            <ChevronLeft className="size-6" aria-hidden="true" />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          {back && (
            <Link
              to={back.to}
              className="mb-1 hidden min-h-8 items-center gap-1 text-body-sm text-muted-foreground outline-none hover:text-foreground focus-visible:underline md:inline-flex"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              {back.label}
            </Link>
          )}
          <h1 className="truncate text-title font-semibold tracking-tight md:text-headline md:font-bold">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 hidden text-body text-muted-foreground md:block">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
