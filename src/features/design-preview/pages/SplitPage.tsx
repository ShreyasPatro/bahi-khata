import { ChevronRight, Plus, ReceiptText } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { MoneyDisplay } from '@/components/financial/MoneyDisplay'
import { StatusBadge } from '@/components/financial/StatusBadge'
import { SummaryCard } from '@/components/financial/SummaryCard'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { FormField } from '@/components/shared/FormField'
import { PersonAvatar } from '@/components/shared/PersonAvatar'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog'
import { SectionCard } from '@/components/shared/SectionCard'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { activity, friends, groups } from '@/features/design-preview/data'

const owed = groups.filter((g) => g.yourBalance > 0).reduce((sum, g) => sum + g.yourBalance, 0)
const owe = groups
  .filter((g) => g.yourBalance < 0)
  .reduce((sum, g) => sum + Math.abs(g.yourBalance), 0)

function NewGroupForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('')
  const [touched, setTouched] = useState(false)
  const error =
    touched && name.trim().length < 2 ? 'Give the group a name (2+ characters)' : undefined

  return (
    <form
      noValidate
      className="space-y-4 pb-2"
      onSubmit={(event) => {
        event.preventDefault()
        setTouched(true)
        if (name.trim().length < 2) return
        toast.success(`“${name.trim()}” created`, {
          description: 'Design preview — nothing was saved.',
        })
        onDone()
      }}
    >
      <FormField label="Group name" required error={error} hint="For example: Weekend trip">
        {(aria) => (
          <Input
            {...aria}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Group name"
            autoComplete="off"
          />
        )}
      </FormField>
      <PrimaryButton type="submit" fullWidth>
        Create group
      </PrimaryButton>
    </form>
  )
}

export function SplitPage() {
  const [newGroupOpen, setNewGroupOpen] = useState(false)
  const [settleWith, setSettleWith] = useState<string | null>(null)
  const friend = friends.find((f) => f.id === settleWith)

  return (
    <PageContainer>
      <PageHeader
        title="Split"
        description="Share expenses with friends, flatmates and trips."
        actions={
          <PrimaryButton size="default" icon={<Plus />} onClick={() => setNewGroupOpen(true)}>
            <span className="max-sm:sr-only">New group</span>
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <SummaryCard label="You are owed" amount={owed} icon={ReceiptText} tone="success" />
        <SummaryCard label="You owe" amount={owe} icon={ReceiptText} tone="expense" />
      </div>

      <Tabs defaultValue="groups" className="gap-4">
        <TabsList className="w-full md:w-fit">
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          <ul className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
            {groups.map((group) => (
              <li key={group.id}>
                <Link
                  to={`/split/groups/${group.id}`}
                  className="block rounded-2xl border bg-card p-4 shadow-card outline-none transition-shadow duration-(--duration-base) hover:shadow-raised focus-visible:ring-3 focus-visible:ring-ring/50 md:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-2xl"
                    >
                      {group.emoji}
                    </span>
                    <ChevronRight className="size-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <p className="mt-3 truncate text-title-sm font-semibold">{group.name}</p>
                  <p className="text-body-sm text-muted-foreground">
                    {group.members.length} members · active {group.lastActivity.toLowerCase()}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3">
                    {group.yourBalance === 0 ? (
                      <StatusBadge status="settled" />
                    ) : (
                      <StatusBadge status={group.yourBalance > 0 ? 'owed' : 'owing'} />
                    )}
                    {group.yourBalance !== 0 && (
                      <MoneyDisplay
                        amount={Math.abs(group.yourBalance)}
                        tone={group.yourBalance > 0 ? 'income' : 'expense'}
                      />
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="friends">
          <ul className="divide-y overflow-hidden rounded-2xl border bg-card shadow-card">
            {friends.map((f) => (
              <li key={f.id} className="flex items-center gap-3 px-4 py-3">
                <PersonAvatar name={f.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body font-medium">{f.name}</p>
                  <p
                    className={
                      f.balance > 0
                        ? 'text-body-sm text-success-ink'
                        : 'text-body-sm text-expense-ink'
                    }
                  >
                    {f.balance > 0 ? 'owes you' : 'you owe'}{' '}
                    <MoneyDisplay
                      amount={Math.abs(f.balance)}
                      size="sm"
                      tone={f.balance > 0 ? 'income' : 'expense'}
                    />
                  </p>
                </div>
                <PrimaryButton variant="outline" size="default" onClick={() => setSettleWith(f.id)}>
                  Settle up
                </PrimaryButton>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="activity">
          <SectionCard title="Recent activity" flush>
            <ul className="divide-y">
              {activity.map((item) => (
                <li key={item.id} className="px-4 py-3 md:px-5">
                  <p className="text-body">{item.text}</p>
                  <p className="text-body-sm text-muted-foreground">{item.time}</p>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <ResponsiveDialog
        open={newGroupOpen}
        onOpenChange={setNewGroupOpen}
        title="New group"
        description="Name it and add people later."
      >
        <NewGroupForm onDone={() => setNewGroupOpen(false)} />
      </ResponsiveDialog>

      <ConfirmDialog
        open={settleWith !== null}
        onOpenChange={(open) => !open && setSettleWith(null)}
        title={friend ? `Settle up with ${friend.name.split(' ')[0]}?` : 'Settle up?'}
        description="This records a cash or UPI payment and clears the balance between you. (Preview only.)"
        confirmLabel="Mark as settled"
        onConfirm={() => {
          toast.success('Settled up', { description: 'Design preview — nothing was saved.' })
          setSettleWith(null)
        }}
      />
    </PageContainer>
  )
}
