import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import { MoneyDisplay } from '@/components/financial/MoneyDisplay'
import { Surface } from '@/components/shared/Surface'
import { cn } from '@/lib/utils'
import { toneStyles, type Tone } from '@/lib/utils/tone'

interface SummaryCardProps {
  label: string
  amount: number
  icon?: LucideIcon
  tone?: Tone
  /** Percentage change vs previous period. `goodDirection` decides whether up is green or red. */
  delta?: { percent: number; goodDirection?: 'up' | 'down'; caption?: string }
  className?: string
}

export function SummaryCard({
  label,
  amount,
  icon: Icon,
  tone = 'primary',
  delta,
  className,
}: SummaryCardProps) {
  let deltaTone = 'text-muted-foreground'
  if (delta) {
    const good = (delta.goodDirection ?? 'up') === 'up' ? delta.percent >= 0 : delta.percent <= 0
    deltaTone = good ? 'text-success-ink' : 'text-expense-ink'
  }
  const Trend = delta && delta.percent < 0 ? TrendingDown : TrendingUp

  return (
    <Surface padding="md" className={cn('min-w-0', className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-body-sm font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <span
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-lg',
              toneStyles[tone].soft,
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="mt-2">
        <MoneyDisplay amount={amount} size="lg" decimals={0} />
      </div>
      {delta && (
        <p className={cn('mt-1.5 flex items-center gap-1 text-caption font-medium', deltaTone)}>
          <Trend className="size-3.5" aria-hidden="true" />
          <span className="tabular-nums">{Math.abs(delta.percent)}%</span>
          <span className="font-normal text-muted-foreground">
            {delta.caption ?? 'vs last month'}
          </span>
        </p>
      )}
    </Surface>
  )
}
