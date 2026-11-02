import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { getMoneyParts, spokenMoney, type FormatMoneyOptions } from '@/lib/utils/money'

const moneyVariants = cva(
  'relative inline-flex items-baseline whitespace-nowrap tabular-nums tracking-tight',
  {
    variants: {
      size: {
        sm: 'text-body-sm font-medium',
        md: 'text-body font-semibold',
        lg: 'text-title font-semibold',
        xl: 'text-display-sm font-bold',
        display: 'text-display font-bold',
      },
      tone: {
        neutral: 'text-foreground',
        muted: 'text-muted-foreground',
        income: 'text-success-ink',
        expense: 'text-expense-ink',
        inverse: 'text-primary-foreground',
        /** Green for positive, red for negative, neutral for zero. */
        auto: '',
      },
    },
    defaultVariants: { size: 'md', tone: 'neutral' },
  },
)

export interface MoneyDisplayProps extends VariantProps<typeof moneyVariants>, FormatMoneyOptions {
  amount: number
  className?: string
}

export function MoneyDisplay({
  amount,
  size,
  tone,
  decimals,
  compact,
  showSign,
  className,
}: MoneyDisplayProps) {
  const parts = getMoneyParts(amount, { decimals, compact, showSign })
  const resolvedTone =
    tone === 'auto' ? (amount > 0 ? 'income' : amount < 0 ? 'expense' : 'neutral') : tone
  const small = size === 'xl' || size === 'display'

  return (
    <span className={cn(moneyVariants({ size, tone: resolvedTone }), className)}>
      <span className="sr-only">{spokenMoney(amount, { decimals, compact, showSign })}</span>
      <span aria-hidden="true">{parts.sign}</span>
      <span
        aria-hidden="true"
        className={cn('mr-px', small ? 'text-[0.6em] font-semibold opacity-80' : '')}
      >
        {parts.symbol}
      </span>
      <span aria-hidden="true">{parts.whole}</span>
      {parts.fraction && (
        <span aria-hidden="true" className={cn(small && 'text-[0.6em] opacity-80')}>
          .{parts.fraction}
        </span>
      )}
      {parts.suffix && (
        <span aria-hidden="true" className="ml-px text-[0.6em] font-semibold opacity-80">
          {parts.suffix}
        </span>
      )}
    </span>
  )
}
