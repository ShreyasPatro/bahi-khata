import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  /** Heading level; defaults to h2 (directly under the page's h1). */
  headingLevel?: 2 | 3
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  headingLevel = 2,
  className,
}: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <div className={cn('flex flex-col items-center px-6 py-12 text-center', className)}>
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary-dark">
        <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <Heading className="mt-4 text-title-sm font-semibold">{title}</Heading>
      <p className="mt-1 max-w-sm text-body-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
