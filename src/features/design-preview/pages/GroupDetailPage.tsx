import { Plus, Receipt, Scale } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { CategoryIcon } from '@/components/financial/CategoryIcon'
import { MoneyDisplay } from '@/components/financial/MoneyDisplay'
import { StatusBadge } from '@/components/financial/StatusBadge'
import { SummaryCard } from '@/components/financial/SummaryCard'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { useShell } from '@/components/layout/useShell'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { PersonAvatar } from '@/components/shared/PersonAvatar'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { groupExpenses, groups } from '@/features/design-preview/data'

export function GroupDetailPage() {
  const { groupId } = useParams()
  const { openQuickAdd } = useShell()
  const [settleOpen, setSettleOpen] = useState(false)
  const group = groups.find((g) => g.id === groupId)

  if (!group) {
    return (
      <PageContainer>
        <PageHeader title="Group not found" back={{ to: '/split', label: 'Split' }} />
        <ErrorState
          title="We could not find that group"
          message="It may have been deleted or the link is incorrect."
        />
      </PageContainer>
    )
  }

  const expenses = groupExpenses[group.id] ?? []
  const yourShareTotal = expenses.reduce((sum, e) => sum + e.yourShare, 0)

  return (
    <PageContainer>
      <PageHeader
        title={`${group.emoji} ${group.name}`}
        description={`${group.members.length} members`}
        back={{ to: '/split', label: 'Split' }}
        actions={
          <>
            <PrimaryButton
              variant="outline"
              size="default"
              icon={<Scale />}
              onClick={() => setSettleOpen(true)}
              disabled={group.yourBalance === 0}
            >
              <span className="max-sm:sr-only">Settle up</span>
            </PrimaryButton>
            <PrimaryButton size="default" icon={<Plus />} onClick={openQuickAdd}>
              <span className="max-sm:sr-only">Add expense</span>
            </PrimaryButton>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
        <SummaryCard label="Group total" amount={group.total} icon={Receipt} tone="primary" />
        <SummaryCard label="Your share" amount={yourShareTotal} icon={Receipt} tone="neutral" />
        <SummaryCard
          label={group.yourBalance >= 0 ? 'You are owed' : 'You owe'}
          amount={Math.abs(group.yourBalance)}
          icon={Scale}
          tone={group.yourBalance >= 0 ? 'success' : 'expense'}
        />
      </div>

      <Tabs defaultValue="expenses" className="gap-4">
        <TabsList className="w-full md:w-fit">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          {expenses.length === 0 ? (
            <div className="rounded-2xl border bg-card shadow-card">
              <EmptyState
                icon={Receipt}
                title="No expenses yet"
                description="Add the first expense and Bahi will work out who owes whom."
                action={
                  <PrimaryButton icon={<Plus />} onClick={openQuickAdd}>
                    Add expense
                  </PrimaryButton>
                }
              />
            </div>
          ) : (
            <ul className="divide-y overflow-hidden rounded-2xl border bg-card shadow-card">
              {expenses.map((expense) => {
                const paidByYou = expense.paidBy === 'You'
                return (
                  <li key={expense.id} className="flex items-center gap-3 px-4 py-3">
                    <CategoryIcon category={expense.category} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-body font-medium">{expense.title}</p>
                      <p className="truncate text-body-sm text-muted-foreground">
                        {expense.paidBy} paid{' '}
                        <MoneyDisplay amount={expense.total} size="sm" tone="muted" /> ·{' '}
                        {expense.date}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end">
                      <MoneyDisplay
                        amount={paidByYou ? expense.total - expense.yourShare : -expense.yourShare}
                        tone="auto"
                        showSign
                      />
                      <span className="text-caption text-muted-foreground">
                        {paidByYou ? 'you lent' : 'you borrowed'}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="balances">
          <ul className="divide-y overflow-hidden rounded-2xl border bg-card shadow-card">
            {group.members.map((member) => (
              <li key={member.id} className="flex items-center gap-3 px-4 py-3">
                <PersonAvatar name={member.name} />
                <p className="min-w-0 flex-1 truncate text-body font-medium">{member.name}</p>
                <div className="flex flex-col items-end gap-1">
                  {member.balance === 0 ? (
                    <StatusBadge status="settled" />
                  ) : (
                    <>
                      <MoneyDisplay
                        amount={Math.abs(member.balance)}
                        tone={member.balance > 0 ? 'income' : 'expense'}
                      />
                      <span className="text-caption text-muted-foreground">
                        {member.balance > 0 ? 'gets back' : 'owes'}
                      </span>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="members">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.members.map((member) => (
              <li
                key={member.id}
                className="flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-card"
              >
                <PersonAvatar name={member.name} size="lg" />
                <div className="min-w-0">
                  <p className="truncate text-body font-semibold">{member.name}</p>
                  <p className="text-body-sm text-muted-foreground">
                    {member.name.startsWith('You') ? 'Admin' : 'Member'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={settleOpen}
        onOpenChange={setSettleOpen}
        title="Settle up this group?"
        description="Bahi will record payments that clear every balance in the group. (Preview only.)"
        confirmLabel="Settle all balances"
        onConfirm={() => {
          setSettleOpen(false)
          toast.success('Group settled', { description: 'Design preview — nothing was saved.' })
        }}
      />
    </PageContainer>
  )
}
