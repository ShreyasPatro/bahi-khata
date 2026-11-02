import { CategoryIcon } from '@/components/financial/CategoryIcon'
import type { CategoryKey } from '@/components/financial/categories'
import { MoneyDisplay } from '@/components/financial/MoneyDisplay'
import { StatusBadge, type Status } from '@/components/financial/StatusBadge'
import { cn } from '@/lib/utils'

export interface TransactionRowProps {
  category: CategoryKey
  title: string
  /** Mobile secondary line, e.g. "HDFC •• 4821 · 2:15 pm". */
  subtitle?: string
  /** Desktop table columns. */
  account?: string
  date?: string
  /** Signed: negative = money out, positive = money in. */
  amount: number
  status?: Status
  onClick?: () => void
  className?: string
}

/**
 * One transaction. A compact two-line row on phones, a table row (Linear-style)
 * with account and date columns from the tablet breakpoint up.
 */
export function TransactionRow({
  category,
  title,
  subtitle,
  account,
  date,
  amount,
  status,
  onClick,
  className,
}: TransactionRowProps) {
  const Comp = onClick ? 'button' : 'div'
  const table = Boolean(account || date)

  return (
    <Comp
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      className={cn(
        'grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 px-4 py-3 text-left',
        table && 'md:grid-cols-[auto_minmax(0,1fr)_10rem_6rem_7.5rem] md:gap-x-4',
        onClick &&
          'cursor-pointer transition-colors duration-(--duration-fast) outline-none hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
        className,
      )}
    >
      <CategoryIcon category={category} />
      <div className="min-w-0">
        <p className="truncate text-body font-medium">{title}</p>
        <p className={cn('truncate text-body-sm text-muted-foreground', table && 'md:hidden')}>
          {subtitle}
        </p>
        {status && (
          <div className={cn('mt-1', table ? 'hidden md:block' : 'hidden')}>
            <StatusBadge status={status} />
          </div>
        )}
      </div>
      {table && (
        <p className="hidden truncate text-body-sm text-muted-foreground md:block">{account}</p>
      )}
      {table && (
        <p className="hidden truncate text-body-sm text-muted-foreground md:block">{date}</p>
      )}
      <div className="flex flex-col items-end gap-1">
        <MoneyDisplay
          amount={amount}
          tone={amount > 0 ? 'income' : 'neutral'}
          showSign={amount > 0}
          decimals="auto"
        />
        {status && (
          <span className={cn(table && 'md:hidden')}>
            <StatusBadge status={status} />
          </span>
        )}
      </div>
    </Comp>
  )
}

/** Column header row matching TransactionRow's desktop grid. */
export function TransactionTableHeader() {
  return (
    <div
      aria-hidden="true"
      className="hidden grid-cols-[auto_minmax(0,1fr)_10rem_6rem_7.5rem] gap-x-4 border-b px-4 py-2 text-caption font-medium tracking-wide text-muted-foreground uppercase md:grid"
    >
      <span className="w-10" />
      <span>Description</span>
      <span>Account</span>
      <span>Date</span>
      <span className="text-right">Amount</span>
    </div>
  )
}
