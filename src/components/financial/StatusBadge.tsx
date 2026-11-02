import { AlertCircle, CheckCircle2, Clock, PauseCircle, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toneStyles, type Tone } from '@/lib/utils/tone'

export type Status = 'settled' | 'pending' | 'overdue' | 'owed' | 'owing' | 'paused' | 'active'

const statuses: Record<Status, { label: string; tone: Tone; icon: LucideIcon | null }> = {
  settled: { label: 'Settled', tone: 'success', icon: CheckCircle2 },
  pending: { label: 'Pending', tone: 'warning', icon: Clock },
  overdue: { label: 'Overdue', tone: 'expense', icon: AlertCircle },
  owed: { label: 'You are owed', tone: 'success', icon: null },
  owing: { label: 'You owe', tone: 'expense', icon: null },
  paused: { label: 'Paused', tone: 'neutral', icon: PauseCircle },
  active: { label: 'Active', tone: 'primary', icon: null },
}

interface StatusBadgeProps {
  status: Status
  /** Override the default label. */
  label?: string
  className?: string
}

/** Status is always conveyed by text as well as colour. */
export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const { label: defaultLabel, tone, icon: Icon } = statuses[status]
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-caption font-medium whitespace-nowrap',
        toneStyles[tone].soft,
        className,
      )}
    >
      {Icon && <Icon className="size-3.5" aria-hidden="true" />}
      {label ?? defaultLabel}
    </span>
  )
}
