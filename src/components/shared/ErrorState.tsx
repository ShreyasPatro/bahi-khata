import { TriangleAlert } from 'lucide-react'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  /** Heading level; defaults to h2 (directly under the page's h1). */
  headingLevel?: 2 | 3
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this right now. Please try again.',
  onRetry,
  headingLevel = 2,
  className,
}: ErrorStateProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center px-6 py-12 text-center', className)}
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-expense-soft text-expense-ink">
        <TriangleAlert className="size-6" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <Heading className="mt-4 text-title-sm font-semibold">{title}</Heading>
      <p className="mt-1 max-w-sm text-body-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <PrimaryButton variant="outline" size="default" className="mt-5" onClick={onRetry}>
          Try again
        </PrimaryButton>
      )}
    </div>
  )
}
