import type { ReactNode } from 'react'
import { Surface } from '@/components/shared/Surface'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  title: string
  description?: string
  action?: ReactNode
  /** Remove body padding for edge-to-edge lists and tables. */
  flush?: boolean
  children: ReactNode
  className?: string
}

/** Titled card section used for lists, charts and panels. */
export function SectionCard({
  title,
  description,
  action,
  flush,
  children,
  className,
}: SectionCardProps) {
  return (
    <Surface padding="none" className={cn('min-w-0 overflow-hidden', className)}>
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3 md:px-5">
        <div className="min-w-0">
          <h2 className="truncate text-title-sm font-semibold">{title}</h2>
          {description && (
            <p className="truncate text-body-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className={cn(!flush && 'px-4 pb-4 md:px-5 md:pb-5')}>{children}</div>
    </Surface>
  )
}
