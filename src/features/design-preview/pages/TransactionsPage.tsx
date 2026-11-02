import { ArrowUpDown, Check, Download, ReceiptText, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { CategoryIcon } from '@/components/financial/CategoryIcon'
import { getCategory } from '@/components/financial/categories'
import { MoneyDisplay } from '@/components/financial/MoneyDisplay'
import { StatusBadge } from '@/components/financial/StatusBadge'
import { TransactionRow, TransactionTableHeader } from '@/components/financial/TransactionRow'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog'
import { SearchInput } from '@/components/shared/SearchInput'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { transactions, type PreviewTransaction } from '@/features/design-preview/data'

type Kind = 'all' | 'expense' | 'income' | 'transfer'
type Sort = 'newest' | 'amount-high' | 'amount-low'

const sortLabels: Record<Sort, string> = {
  newest: 'Newest first',
  'amount-high': 'Amount: high to low',
  'amount-low': 'Amount: low to high',
}

const dayOrder: PreviewTransaction['day'][] = ['Today', 'Yesterday', 'Earlier this week']

export function TransactionsPage() {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<Kind>('all')
  const [sort, setSort] = useState<Sort>('newest')
  const [openId, setOpenId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = transactions.filter((tx) => {
      const matchesKind =
        kind === 'all' ||
        (kind === 'income' && tx.amount > 0) ||
        (kind === 'transfer' && tx.category === 'transfer') ||
        (kind === 'expense' && tx.amount < 0 && tx.category !== 'transfer')
      return (
        matchesKind && (tx.title.toLowerCase().includes(q) || tx.account.toLowerCase().includes(q))
      )
    })
    if (sort === 'amount-high')
      return [...list].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    if (sort === 'amount-low')
      return [...list].sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount))
    return list
  }, [query, kind, sort])

  const selected = transactions.find((tx) => tx.id === openId)

  return (
    <PageContainer>
      <PageHeader
        title="Transactions"
        description="Every rupee in and out, across all accounts."
        actions={
          <Button
            variant="outline"
            size="default"
            onClick={() =>
              toast.success('Export started', {
                description: 'Design preview — no file is created.',
              })
            }
          >
            <Download aria-hidden="true" />
            <span className="max-sm:sr-only">Export</span>
          </Button>
        }
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <SearchInput
          value={query}
          onValueChange={setQuery}
          label="Search transactions"
          className="md:max-w-sm md:flex-1"
        />
        <div className="flex items-center gap-2">
          <SegmentedControl
            label="Filter transactions"
            className="min-w-0 flex-1 md:flex-none"
            value={kind}
            onValueChange={setKind}
            options={[
              { value: 'all', label: 'All' },
              { value: 'expense', label: 'Expenses' },
              { value: 'income', label: 'Income' },
              { value: 'transfer', label: 'Transfers' },
            ]}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label={`Sort: ${sortLabels[sort]}`}
                className="shrink-0"
              >
                <ArrowUpDown aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(Object.keys(sortLabels) as Sort[]).map((key) => (
                <DropdownMenuItem key={key} onSelect={() => setSort(key)}>
                  {sortLabels[key]}
                  {sort === key && <Check className="ml-auto" aria-hidden="true" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className="text-body-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'transaction' : 'transactions'}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border bg-card shadow-card">
          <EmptyState
            icon={ReceiptText}
            title="No transactions found"
            description="Try a different search or filter."
            action={
              <PrimaryButton
                variant="outline"
                size="default"
                onClick={() => {
                  setQuery('')
                  setKind('all')
                }}
              >
                Clear filters
              </PrimaryButton>
            }
          />
        </div>
      ) : sort === 'newest' ? (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <TransactionTableHeader />
          {dayOrder.map((day) => {
            const rows = filtered.filter((tx) => tx.day === day)
            if (rows.length === 0) return null
            return (
              <section key={day} aria-label={day}>
                <h2 className="sticky top-0 border-b bg-muted/70 px-4 py-1.5 text-caption font-semibold tracking-wide text-muted-foreground uppercase backdrop-blur">
                  {day}
                </h2>
                <ul className="divide-y">
                  {rows.map((tx) => (
                    <li key={tx.id}>
                      <TransactionRow
                        category={tx.category}
                        title={tx.title}
                        subtitle={`${tx.account} · ${tx.time}`}
                        account={tx.account}
                        date={tx.date}
                        amount={tx.amount}
                        status={tx.status}
                        onClick={() => setOpenId(tx.id)}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <TransactionTableHeader />
          <ul className="divide-y">
            {filtered.map((tx) => (
              <li key={tx.id}>
                <TransactionRow
                  category={tx.category}
                  title={tx.title}
                  subtitle={`${tx.account} · ${tx.date}`}
                  account={tx.account}
                  date={tx.date}
                  amount={tx.amount}
                  status={tx.status}
                  onClick={() => setOpenId(tx.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {selected && (
        <ResponsiveDialog
          open
          onOpenChange={(open) => !open && setOpenId(null)}
          title="Transaction details"
          description={`${selected.date} · ${selected.time}`}
          footer={
            <div className="grid grid-cols-2 gap-2">
              <PrimaryButton
                variant="destructive"
                icon={<Trash2 />}
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </PrimaryButton>
              <PrimaryButton
                variant="secondary"
                onClick={() => {
                  toast.info('Editing is not part of the design preview')
                }}
              >
                Edit
              </PrimaryButton>
            </div>
          }
        >
          <div className="space-y-4 pb-4">
            <div className="flex items-center gap-3">
              <CategoryIcon category={selected.category} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-title-sm font-semibold">{selected.title}</p>
                <p className="text-body-sm text-muted-foreground">
                  {getCategory(selected.category).label}
                </p>
              </div>
            </div>
            <MoneyDisplay
              amount={selected.amount}
              size="xl"
              tone={selected.amount > 0 ? 'income' : 'neutral'}
              decimals={2}
            />
            <dl className="divide-y rounded-2xl border text-body">
              <div className="flex justify-between gap-3 px-3 py-2.5">
                <dt className="text-muted-foreground">Account</dt>
                <dd className="font-medium">{selected.account}</dd>
              </div>
              <div className="flex justify-between gap-3 px-3 py-2.5">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <StatusBadge
                    status={selected.status ?? 'settled'}
                    label={selected.status ? undefined : 'Completed'}
                  />
                </dd>
              </div>
            </dl>
          </div>
        </ResponsiveDialog>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this transaction?"
        description="This cannot be undone. (Preview only — nothing is deleted.)"
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          setConfirmDelete(false)
          setOpenId(null)
          toast.success('Transaction deleted (preview)')
        }}
      />
    </PageContainer>
  )
}
