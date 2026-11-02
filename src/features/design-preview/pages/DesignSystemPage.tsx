import { Bell, CheckCircle2, Inbox, Plus, Settings, Trash2, Wallet } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { AccountCard } from '@/components/financial/AccountCard'
import { CategoryIcon } from '@/components/financial/CategoryIcon'
import { categoryKeys, getCategory } from '@/components/financial/categories'
import { MoneyDisplay } from '@/components/financial/MoneyDisplay'
import { StatusBadge, type Status } from '@/components/financial/StatusBadge'
import { SummaryCard } from '@/components/financial/SummaryCard'
import { TransactionRow } from '@/components/financial/TransactionRow'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { BottomSheet } from '@/components/shared/BottomSheet'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { DatePicker } from '@/components/shared/DatePicker'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { FormField } from '@/components/shared/FormField'
import { IconButton } from '@/components/shared/IconButton'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { Modal } from '@/components/shared/Modal'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { SearchInput } from '@/components/shared/SearchInput'
import { SectionCard } from '@/components/shared/SectionCard'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

const swatches = [
  { name: 'Background', token: '--background', className: 'bg-background' },
  { name: 'Surface', token: '--card', className: 'bg-card' },
  { name: 'Primary', token: '--primary', className: 'bg-primary' },
  { name: 'Primary dark', token: '--primary-dark', className: 'bg-primary-dark' },
  { name: 'Primary soft', token: '--primary-soft', className: 'bg-primary-soft' },
  { name: 'Text', token: '--foreground', className: 'bg-foreground' },
  { name: 'Text muted', token: '--muted-foreground', className: 'bg-muted-foreground' },
  { name: 'Text secondary', token: '--subtle-foreground', className: 'bg-subtle-foreground' },
  { name: 'Success', token: '--success', className: 'bg-success' },
  { name: 'Expense', token: '--expense', className: 'bg-expense' },
  { name: 'Warning', token: '--warning', className: 'bg-warning' },
  { name: 'Border', token: '--border', className: 'bg-border' },
]

const typeScale = [
  { name: 'Display', className: 'text-display font-bold', sample: '₹3,63,190' },
  { name: 'Display small', className: 'text-display-sm font-bold', sample: '₹3,63,190' },
  { name: 'Headline', className: 'text-headline font-bold', sample: 'Every rupee, accounted for.' },
  { name: 'Title', className: 'text-title font-semibold', sample: 'Spending by category' },
  { name: 'Title small', className: 'text-title-sm font-semibold', sample: 'Recent transactions' },
  { name: 'Body', className: 'text-body', sample: 'Rent was paid from your HDFC account.' },
  {
    name: 'Body small',
    className: 'text-body-sm text-muted-foreground',
    sample: 'HDFC •• 4821 · 8:42 pm',
  },
  { name: 'Caption', className: 'text-caption text-muted-foreground', sample: 'Updated just now' },
]

const statuses: Status[] = ['settled', 'pending', 'overdue', 'owed', 'owing', 'paused', 'active']

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <SectionCard title={title}>
      <div className="space-y-4">{children}</div>
    </SectionCard>
  )
}

export function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <PageContainer>
      <PageHeader
        title="Design system"
        description="Tokens, components and states that make up Bahi."
      />

      <Group title="Colour tokens">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {swatches.map((swatch) => (
            <li key={swatch.token}>
              <div className={`h-14 rounded-xl border ${swatch.className}`} />
              <p className="mt-1.5 text-body-sm font-medium">{swatch.name}</p>
              <p className="text-caption text-muted-foreground">{swatch.token}</p>
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Typography">
        <ul className="divide-y">
          {typeScale.map((item) => (
            <li
              key={item.name}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="w-28 shrink-0 text-caption text-muted-foreground">{item.name}</span>
              <span className={`min-w-0 truncate tabular-nums ${item.className}`}>
                {item.sample}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 rounded-2xl bg-muted p-4">
          <MoneyDisplay amount={1234567.5} size="display" decimals={2} />
          <MoneyDisplay amount={-4820} size="xl" tone="expense" />
          <MoneyDisplay amount={35000} size="lg" tone="income" showSign />
          <MoneyDisplay amount={2500000} size="md" compact />
          <MoneyDisplay amount={640} size="sm" tone="muted" />
        </div>
      </Group>

      <Group title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <PrimaryButton icon={<Plus />}>Primary</PrimaryButton>
          <PrimaryButton variant="secondary">Secondary</PrimaryButton>
          <PrimaryButton variant="outline">Outline</PrimaryButton>
          <PrimaryButton variant="ghost">Ghost</PrimaryButton>
          <PrimaryButton variant="destructive" icon={<Trash2 />}>
            Destructive
          </PrimaryButton>
          <PrimaryButton disabled>Disabled</PrimaryButton>
          <PrimaryButton
            loading={loading}
            loadingText="Saving…"
            onClick={() => {
              setLoading(true)
              setTimeout(() => setLoading(false), 1500)
            }}
          >
            Click for loading
          </PrimaryButton>
        </div>
        <div className="flex items-center gap-2">
          <IconButton label="Notifications" icon={<Bell />} variant="outline" />
          <IconButton label="Settings" icon={<Settings />} variant="secondary" />
          <IconButton label="Delete" icon={<Trash2 />} variant="destructive" />
          <Button variant="link">Link button</Button>
        </div>
      </Group>

      <Group title="Form states">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Default" hint="Helper text sits below the field.">
            {(aria) => <Input {...aria} placeholder="Placeholder" />}
          </FormField>
          <FormField label="Filled">
            {(aria) => <Input {...aria} defaultValue="Salary account" />}
          </FormField>
          <FormField label="Error" error="Enter a valid amount" required>
            {(aria) => <Input {...aria} defaultValue="abc" />}
          </FormField>
          <FormField label="Disabled">
            {(aria) => <Input {...aria} disabled defaultValue="Locked" />}
          </FormField>
          <FormField label="Success" hint="Looks good">
            {(aria) => (
              <div className="relative">
                <Input
                  {...aria}
                  defaultValue="aarav@example.com"
                  className="border-success pr-10 focus-visible:ring-success/30"
                />
                <CheckCircle2
                  className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-success-ink"
                  aria-hidden="true"
                />
              </div>
            )}
          </FormField>
          <FormField label="Select">
            {({ id, ...aria }) => (
              <Select>
                <SelectTrigger id={id} className="w-full" {...aria}>
                  <SelectValue placeholder="Choose one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">HDFC Savings</SelectItem>
                  <SelectItem value="b">ICICI Credit</SelectItem>
                </SelectContent>
              </Select>
            )}
          </FormField>
          <FormField label="Date">
            {({ id }) => <DatePicker id={id} value={date} onChange={setDate} />}
          </FormField>
          <FormField label="Search">
            {() => <SearchInput value={search} onValueChange={setSearch} />}
          </FormField>
          <FormField label="Notes" className="md:col-span-2">
            {(aria) => <Textarea {...aria} placeholder="Add a note" />}
          </FormField>
        </div>
        <p className="text-body-sm text-muted-foreground">
          Tab into any field to see the focus ring.
        </p>
      </Group>

      <Group title="Badges & category icons">
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {categoryKeys.map((key) => (
            <li key={key} className="flex items-center gap-2">
              <CategoryIcon category={key} size="sm" />
              <span className="truncate text-caption text-muted-foreground">
                {getCategory(key).label}
              </span>
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Financial components">
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          <SummaryCard
            label="Income"
            amount={135000}
            icon={Wallet}
            tone="success"
            delta={{ percent: 5.5 }}
          />
          <AccountCard
            name="Salary account"
            institution="HDFC Bank"
            type="bank"
            last4="4821"
            balance={248560.4}
          />
          <AccountCard
            name="Amazon Pay card"
            institution="ICICI Bank"
            type="credit"
            last4="1190"
            balance={-18420}
          />
        </div>
        <div className="divide-y overflow-hidden rounded-2xl border">
          <TransactionRow
            category="food"
            title="Swiggy — dinner"
            subtitle="ICICI •• 1190 · 8:42 pm"
            account="ICICI •• 1190"
            date="1 Nov"
            amount={-684}
            onClick={() => toast('Row clicked')}
          />
          <TransactionRow
            category="salary"
            title="Freelance invoice"
            subtitle="HDFC •• 4821 · 4:30 pm"
            account="HDFC •• 4821"
            date="31 Oct"
            amount={35000}
          />
        </div>
      </Group>

      <Group title="Overlays & feedback">
        <div className="flex flex-wrap gap-3">
          <PrimaryButton variant="outline" onClick={() => setModalOpen(true)}>
            Open modal
          </PrimaryButton>
          <PrimaryButton variant="outline" onClick={() => setSheetOpen(true)}>
            Open bottom sheet
          </PrimaryButton>
          <PrimaryButton variant="outline" onClick={() => setConfirmOpen(true)}>
            Confirm dialog
          </PrimaryButton>
          <PrimaryButton
            variant="outline"
            onClick={() => toast.success('Saved', { description: 'A success toast.' })}
          >
            Success toast
          </PrimaryButton>
          <PrimaryButton
            variant="outline"
            onClick={() => toast.error('Could not save', { description: 'An error toast.' })}
          >
            Error toast
          </PrimaryButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <PrimaryButton variant="outline">Dropdown menu</PrimaryButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => toast('Edit')}>Edit</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast('Duplicate')}>Duplicate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">Overview</TabsTrigger>
            <TabsTrigger value="two">Activity</TabsTrigger>
            <TabsTrigger value="three">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="one" className="pt-3 text-body text-muted-foreground">
            Overview content.
          </TabsContent>
          <TabsContent value="two" className="pt-3 text-body text-muted-foreground">
            Activity content.
          </TabsContent>
          <TabsContent value="three" className="pt-3 text-body text-muted-foreground">
            Settings content.
          </TabsContent>
        </Tabs>
      </Group>

      <Group title="Empty, loading and error states">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border">
            <EmptyState
              icon={Inbox}
              title="Nothing here yet"
              description="When you add transactions, they will show up here."
              action={
                <PrimaryButton size="default" icon={<Plus />}>
                  Add one
                </PrimaryButton>
              }
            />
          </div>
          <div className="rounded-2xl border">
            <ErrorState headingLevel={3} onRetry={() => toast.info('Retrying…')} />
          </div>
        </div>
        <LoadingSkeleton variant="rows" count={3} />
        <LoadingSkeleton variant="card" count={3} />
      </Group>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Modal"
        description="Centered dialog with focus trap."
        footer={<PrimaryButton onClick={() => setModalOpen(false)}>Done</PrimaryButton>}
      >
        <p className="pb-4 text-body text-muted-foreground">
          Press Esc or click outside to dismiss.
        </p>
      </Modal>
      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Bottom sheet"
        description="Anchored to the thumb zone on phones."
        footer={
          <PrimaryButton fullWidth onClick={() => setSheetOpen(false)}>
            Done
          </PrimaryButton>
        }
      >
        <p className="pb-4 text-body text-muted-foreground">
          Drag handle, safe-area padding and a sticky footer action.
        </p>
      </BottomSheet>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete account?"
        description="This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          setConfirmOpen(false)
          toast.success('Deleted (preview)')
        }}
      />
    </PageContainer>
  )
}
