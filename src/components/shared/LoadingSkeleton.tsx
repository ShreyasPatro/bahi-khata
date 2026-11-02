import { Skeleton } from '@/components/ui/skeleton'
import { Surface } from '@/components/shared/Surface'
import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  variant?: 'card' | 'rows' | 'balance'
  count?: number
  className?: string
}

/** Skeleton placeholders that match the real layout to avoid shift. */
export function LoadingSkeleton({ variant = 'rows', count = 4, className }: LoadingSkeletonProps) {
  if (variant === 'balance') {
    return (
      <div
        role="status"
        aria-label="Loading"
        className={cn('rounded-3xl border bg-card p-6', className)}
      >
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-10 w-52" />
        <Skeleton className="mt-4 h-6 w-36 rounded-full" />
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div
        role="status"
        aria-label="Loading"
        className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-3', className)}
      >
        {Array.from({ length: count }, (_, i) => (
          <Surface key={i}>
            <Skeleton className="size-10 rounded-xl" />
            <Skeleton className="mt-4 h-4 w-2/3" />
            <Skeleton className="mt-2 h-3 w-1/3" />
            <Skeleton className="mt-4 h-6 w-1/2" />
          </Surface>
        ))}
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('divide-y rounded-2xl border bg-card', className)}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="size-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}
