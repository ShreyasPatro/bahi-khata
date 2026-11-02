import { Bell, HandCoins, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { MoneyDisplay } from '@/components/financial/MoneyDisplay'
import { StatusBadge } from '@/components/financial/StatusBadge'
import { SummaryCard } from '@/components/financial/SummaryCard'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { useShell } from '@/components/layout/useShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { PersonAvatar } from '@/components/shared/PersonAvatar'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog'
import { SearchInput } from '@/components/shared/SearchInput'
import { SectionCard } from '@/components/shared/SectionCard'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import { mediaQueries } from '@/constants/design-tokens'
import { khataParties, type KhataParty } from '@/features/design-preview/data'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'receive' | 'pay' | 'settled'

const toReceive = khataParties.filter((p) => p.balance > 0).reduce((sum, p) => sum + p.balance, 0)
const toPay = khataParties
  .filter((p) => p.balance < 0)
  .reduce((sum, p) => sum + Math.abs(p.balance), 0)

function PartyDetail({ party }: { party: KhataParty }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <PersonAvatar name={party.name} size="lg" />
        <div className="min-w-0">
          <p className="truncate text-title-sm font-semibold">{party.name}</p>
          <p className="truncate text-body-sm text-muted-foreground">{party.note}</p>
        </div>
      </div>
      <div className="rounded-2xl bg-muted p-4">
        <p className="text-body-sm text-muted-foreground">
          {party.balance > 0
            ? `${party.name.split(' ')[0]} owes you`
            : party.balance < 0
              ? 'You owe'
              : 'All settled'}
        </p>
        <MoneyDisplay
          amount={Math.abs(party.balance)}
          size="xl"
          tone={party.balance > 0 ? 'income' : party.balance < 0 ? 'expense' : 'neutral'}
        />
      </div>
      <div>
        <h3 className="mb-2 text-body-sm font-semibold text-muted-foreground">Entries</h3>
        <ul className="divide-y rounded-2xl border">
          {party.entries.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-body font-medium">{entry.label}</p>
                <p className="text-body-sm text-muted-foreground">{entry.date}</p>
              </div>
              <MoneyDisplay amount={entry.amount} tone="auto" showSign />
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <PrimaryButton
          variant="secondary"
          icon={<Bell />}
          onClick={() =>
            toast.success(`Reminder sent to ${party.name.split(' ')[0]}`, {
              description: 'Design preview — nothing was sent.',
            })
          }
        >
          Remind
        </PrimaryButton>
        <PrimaryButton
          icon={<HandCoins />}
          onClick={() => toast.success('Payment recorded (preview)')}
        >
          Record
        </PrimaryButton>
      </div>
    </div>
  )
}

export function KhataPage() {
  const { openQuickAdd } = useShell()
  const isXl = useMediaQuery(mediaQueries.xl)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string>(khataParties[0]?.id ?? '')
  const [dialogOpen, setDialogOpen] = useState(false)

  const visible = useMemo(
    () =>
      khataParties.filter((party) => {
        const matchesFilter =
          filter === 'all' ||
          (filter === 'receive' && party.balance > 0) ||
          (filter === 'pay' && party.balance < 0) ||
          (filter === 'settled' && party.balance === 0)
        return matchesFilter && party.name.toLowerCase().includes(query.trim().toLowerCase())
      }),
    [filter, query],
  )
  const selected = khataParties.find((party) => party.id === selectedId) ?? khataParties[0]

  return (
    <PageContainer
      aside={
        selected && (
          <SectionCard title="Party details">
            <PartyDetail party={selected} />
          </SectionCard>
        )
      }
    >
      <PageHeader
        title="Khata"
        description="Money lent, borrowed and kept on credit."
        actions={
          <PrimaryButton size="default" icon={<Plus />} onClick={openQuickAdd}>
            <span className="max-sm:sr-only">New entry</span>
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <SummaryCard label="You will receive" amount={toReceive} icon={HandCoins} tone="success" />
        <SummaryCard label="You will pay" amount={toPay} icon={HandCoins} tone="expense" />
      </div>

      <div className="space-y-3">
        <SearchInput
          value={query}
          onValueChange={setQuery}
          label="Search people"
          placeholder="Search people or shops"
        />
        <SegmentedControl
          label="Filter people"
          value={filter}
          onValueChange={setFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'receive', label: 'To receive' },
            { value: 'pay', label: 'To pay' },
            { value: 'settled', label: 'Settled' },
          ]}
        />
      </div>

      {visible.length === 0 ? (
        <SectionCard title="People" flush>
          <EmptyState
            icon={HandCoins}
            title="No one here"
            description="Nothing matches this filter. Try a different tab or search."
            action={
              <PrimaryButton
                variant="outline"
                size="default"
                onClick={() => {
                  setFilter('all')
                  setQuery('')
                }}
              >
                Clear filters
              </PrimaryButton>
            }
          />
        </SectionCard>
      ) : (
        <ul className="divide-y overflow-hidden rounded-2xl border bg-card shadow-card">
          {visible.map((party) => (
            <li key={party.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(party.id)
                  if (!isXl) setDialogOpen(true)
                }}
                aria-current={isXl && party.id === selectedId ? 'true' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-3 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                  isXl && party.id === selectedId && 'bg-primary-soft/60',
                )}
              >
                <PersonAvatar name={party.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body font-medium">{party.name}</p>
                  <p className="truncate text-body-sm text-muted-foreground">
                    {party.note} · {party.lastEntry}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <MoneyDisplay
                    amount={Math.abs(party.balance)}
                    tone={party.balance > 0 ? 'income' : party.balance < 0 ? 'expense' : 'muted'}
                  />
                  <StatusBadge status={party.status} />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && !isXl && (
        <ResponsiveDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={selected.name}
          description="Khata details"
        >
          <div className="pb-4">
            <PartyDetail party={selected} />
          </div>
        </ResponsiveDialog>
      )}
    </PageContainer>
  )
}
