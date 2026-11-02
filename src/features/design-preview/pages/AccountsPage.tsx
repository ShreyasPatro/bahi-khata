import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { AccountCard } from '@/components/financial/AccountCard'
import { BalanceCard } from '@/components/financial/BalanceCard'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { FormField } from '@/components/shared/FormField'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { accounts, type PreviewAccount } from '@/features/design-preview/data'

const assets = accounts.filter((a) => a.balance >= 0)
const liabilities = accounts.filter((a) => a.balance < 0)
const netWorth = accounts.reduce((sum, a) => sum + a.balance, 0)

function AccountGrid({
  items,
  onSelect,
}: {
  items: PreviewAccount[]
  onSelect: (account: PreviewAccount) => void
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
      {items.map((account) => (
        <li key={account.id}>
          <AccountCard {...account} onClick={() => onSelect(account)} />
        </li>
      ))}
    </ul>
  )
}

export function AccountsPage() {
  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <PageContainer>
      <PageHeader
        title="Accounts"
        description="Bank accounts, cards, wallets and cash in one place."
        actions={
          <PrimaryButton size="default" icon={<Plus />} onClick={() => setAddOpen(true)}>
            <span className="max-sm:sr-only">Add account</span>
          </PrimaryButton>
        }
      />

      <BalanceCard
        label="Net worth in accounts"
        amount={netWorth}
        change={{ amount: 24300, period: 'this month' }}
      />

      <section aria-labelledby="assets-heading" className="space-y-3">
        <h2 id="assets-heading" className="text-title-sm font-semibold">
          Assets
        </h2>
        <AccountGrid
          items={assets}
          onSelect={(a) =>
            toast(a.name, { description: 'Account detail is outside this design pass.' })
          }
        />
      </section>

      <section aria-labelledby="liabilities-heading" className="space-y-3">
        <h2 id="liabilities-heading" className="text-title-sm font-semibold">
          Credit & liabilities
        </h2>
        <AccountGrid
          items={liabilities}
          onSelect={(a) =>
            toast(a.name, { description: 'Account detail is outside this design pass.' })
          }
        />
      </section>

      <ResponsiveDialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open)
          if (!open) {
            setName('')
            setType('')
            setSubmitted(false)
          }
        }}
        title="Add account"
        description="Link a bank account, card, wallet or cash pot."
      >
        <form
          noValidate
          className="space-y-4 pb-2"
          onSubmit={(event) => {
            event.preventDefault()
            setSubmitted(true)
            if (!name.trim() || !type) return
            toast.success(`${name.trim()} added`, {
              description: 'Design preview — nothing was saved.',
            })
            setAddOpen(false)
          }}
        >
          <FormField
            label="Account name"
            required
            error={submitted && !name.trim() ? 'Enter a name for this account' : undefined}
          >
            {(aria) => (
              <Input
                {...aria}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Salary account"
                autoComplete="off"
              />
            )}
          </FormField>
          <FormField
            label="Type"
            required
            error={submitted && !type ? 'Choose an account type' : undefined}
          >
            {({ id, ...aria }) => (
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id={id} className="w-full" {...aria}>
                  <SelectValue placeholder="Choose type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank account</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="credit">Credit card</SelectItem>
                  <SelectItem value="wallet">UPI wallet</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            )}
          </FormField>
          <PrimaryButton type="submit" fullWidth>
            Add account
          </PrimaryButton>
        </form>
      </ResponsiveDialog>
    </PageContainer>
  )
}
