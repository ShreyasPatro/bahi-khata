import {
  Banknote,
  CreditCard,
  Landmark,
  PiggyBank,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'
import { MoneyDisplay } from '@/components/financial/MoneyDisplay'
import { Surface } from '@/components/shared/Surface'
import { cn } from '@/lib/utils'
import { toneStyles, type Tone } from '@/lib/utils/tone'

export type AccountType = 'bank' | 'savings' | 'credit' | 'wallet' | 'cash'

const accountTypes: Record<AccountType, { label: string; icon: LucideIcon; tone: Tone }> = {
  bank: { label: 'Bank account', icon: Landmark, tone: 'primary' },
  savings: { label: 'Savings', icon: PiggyBank, tone: 'success' },
  credit: { label: 'Credit card', icon: CreditCard, tone: 'expense' },
  wallet: { label: 'UPI wallet', icon: Smartphone, tone: 'warning' },
  cash: { label: 'Cash', icon: Banknote, tone: 'neutral' },
}

export interface AccountCardProps {
  name: string
  type: AccountType
  /** Last four digits; never the full number. */
  last4?: string
  balance: number
  institution?: string
  onClick?: () => void
  className?: string
}

export function AccountCard({
  name,
  type,
  last4,
  balance,
  institution,
  onClick,
  className,
}: AccountCardProps) {
  const { label, icon: Icon, tone } = accountTypes[type]
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex size-10 items-center justify-center rounded-xl',
            toneStyles[tone].soft,
          )}
        >
          <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        {last4 && (
          <span
            className="text-body-sm tracking-widest text-muted-foreground tabular-nums"
            aria-label={`ending ${last4}`}
          >
            •••• {last4}
          </span>
        )}
      </div>
      <div className="mt-4 min-w-0">
        <p className="truncate text-body font-semibold">{name}</p>
        <p className="truncate text-body-sm text-muted-foreground">{institution ?? label}</p>
      </div>
      <div className="mt-3">
        <MoneyDisplay
          amount={balance}
          size="lg"
          decimals="auto"
          tone={balance < 0 ? 'expense' : 'neutral'}
        />
        <p className="text-caption text-muted-foreground">
          {type === 'credit' ? 'Outstanding' : 'Available balance'}
        </p>
      </div>
    </>
  )

  if (!onClick) {
    return <Surface className={cn('min-w-0', className)}>{body}</Surface>
  }
  return (
    <Surface interactive className={cn('min-w-0 p-0 md:p-0', className)}>
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-2xl p-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:p-5"
      >
        {body}
      </button>
    </Surface>
  )
}
