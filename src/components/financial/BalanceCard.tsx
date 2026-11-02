import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { MoneyDisplay } from '@/components/financial/MoneyDisplay'
import { cn } from '@/lib/utils'
import { formatMoney } from '@/lib/utils/money'

interface BalanceCardProps {
  label: string
  amount: number
  /** Change over the stated period; positive renders green-on-dark. */
  change?: { amount: number; period: string }
  /** Quick actions rendered along the bottom (Revolut-style). */
  actions?: ReactNode
  className?: string
}

/** Hero balance card — the single high-emphasis surface on a screen. */
export function BalanceCard({ label, amount, change, actions, className }: BalanceCardProps) {
  const up = (change?.amount ?? 0) >= 0
  const Arrow = up ? ArrowUpRight : ArrowDownRight

  return (
    <section
      aria-label={label}
      className={cn(
        'relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-primary-dark p-5 text-primary-foreground shadow-raised md:p-6',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-10 size-52 rounded-full bg-primary-foreground/10 blur-2xl"
      />
      <p className="text-body-sm font-medium text-primary-foreground/80">{label}</p>
      <div className="mt-1">
        <MoneyDisplay amount={amount} size="display" tone="inverse" decimals={2} />
      </div>
      {change && (
        <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary-foreground/15 py-1 pr-3 pl-2 text-caption font-medium">
          <Arrow className="size-3.5" aria-hidden="true" />
          <span className="tabular-nums">
            {formatMoney(Math.abs(change.amount), { compact: true })}
          </span>
          <span className="text-primary-foreground/80">
            {up ? 'up' : 'down'} {change.period}
          </span>
        </p>
      )}
      {actions && <div className="mt-5 grid grid-cols-4 gap-2">{actions}</div>}
    </section>
  )
}

interface BalanceActionProps {
  icon: ReactNode
  label: string
  onClick?: () => void
}

/** Circular quick-action used inside BalanceCard. */
export function BalanceAction({ icon, label, onClick }: BalanceActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-(--h-control-lg) flex-col items-center gap-1.5 rounded-xl py-1 text-caption font-medium outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground/60"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-primary-foreground/15 transition-colors duration-(--duration-fast) group-hover:bg-primary-foreground/25 group-active:scale-95 [&_svg]:size-5">
        {icon}
      </span>
      {label}
    </button>
  )
}
