import { cn } from '@/lib/utils'

interface BahiLogoProps {
  /** Show the wordmark next to the mark. */
  withWordmark?: boolean
  className?: string
}

export function BahiLogo({ withWordmark = true, className }: BahiLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary-dark text-title-sm font-bold text-primary-foreground shadow-card"
      >
        B
      </span>
      {withWordmark ? (
        <span className="text-title font-bold tracking-tight">Bahi</span>
      ) : (
        <span className="sr-only">Bahi</span>
      )}
    </span>
  )
}
