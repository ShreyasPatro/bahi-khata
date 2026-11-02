import {
  ArrowDownToLine,
  Bell,
  BookOpen,
  PiggyBank,
  Plus,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { DonutChart } from '@/components/charts/charts'
import { donutColor } from '@/components/charts/palette'
import { AccountCard } from '@/components/financial/AccountCard'
import { BalanceAction, BalanceCard } from '@/components/financial/BalanceCard'
import { CategoryIcon } from '@/components/financial/CategoryIcon'
import { MoneyDisplay } from '@/components/financial/MoneyDisplay'
import { StatusBadge } from '@/components/financial/StatusBadge'
import { SummaryCard } from '@/components/financial/SummaryCard'
import { TransactionRow } from '@/components/financial/TransactionRow'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { useShell } from '@/components/layout/useShell'
import { IconButton } from '@/components/shared/IconButton'
import { SectionCard } from '@/components/shared/SectionCard'
import {
  accounts,
  currentUser,
  monthlySummary,
  spendByCategory,
  transactions,
  upcomingBills,
} from '@/features/design-preview/data'

const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
const spendTotal = spendByCategory.reduce((sum, item) => sum + item.value, 0)

function UpcomingBills() {
  return (
    <SectionCard title="Upcoming bills" description="Next 10 days" flush>
      <ul className="divide-y">
        {upcomingBills.map((bill) => (
          <li key={bill.id} className="flex items-center gap-3 px-4 py-3 md:px-5">
            <CategoryIcon category={bill.category} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-body font-medium">{bill.title}</p>
              <p className="text-body-sm text-muted-foreground">{bill.due}</p>
            </div>
            <MoneyDisplay amount={bill.amount} />
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

export function HomePage() {
  const { openQuickAdd } = useShell()

  return (
    <PageContainer
      aside={
        <>
          <UpcomingBills />
          <SectionCard title="Insight">
            <p className="text-body-sm text-muted-foreground">
              You have spent <strong className="font-semibold text-foreground">12% less</strong> on
              food & dining than last month. Keep it up — that is about{' '}
              <strong className="font-semibold text-success-ink">₹1,300</strong> saved.
            </p>
            <StatusBadge status="active" label="Fictional insight" className="mt-3" />
          </SectionCard>
        </>
      }
    >
      <PageHeader
        title={`Good evening, ${currentUser.firstName}`}
        description="Here is where your money stands today."
        actions={
          <IconButton
            label="Notifications"
            icon={<Bell />}
            variant="outline"
            onClick={() => toast.info('No new notifications', { description: 'Design preview.' })}
          />
        }
      />

      <BalanceCard
        label="Total balance"
        amount={totalBalance}
        change={{ amount: 24300, period: 'this month' }}
        actions={
          <>
            <BalanceAction icon={<Plus />} label="Add" onClick={openQuickAdd} />
            <BalanceAction
              icon={<Users />}
              label="Split"
              onClick={() => toast('Split a bill', { description: 'Opens in the Split module.' })}
            />
            <BalanceAction
              icon={<BookOpen />}
              label="Khata"
              onClick={() =>
                toast('New khata entry', { description: 'Opens in the Khata module.' })
              }
            />
            <BalanceAction
              icon={<TrendingUp />}
              label="Invest"
              onClick={() => toast('Invest', { description: 'Opens in the Portfolio module.' })}
            />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
        <SummaryCard
          label="Income"
          amount={monthlySummary.income}
          icon={ArrowDownToLine}
          tone="success"
          delta={{ percent: 5.5 }}
        />
        <SummaryCard
          label="Spent"
          amount={monthlySummary.spent}
          icon={Wallet}
          tone="expense"
          delta={{ percent: -4.5, goodDirection: 'down' }}
        />
        <SummaryCard
          label="Saved"
          amount={monthlySummary.saved}
          icon={PiggyBank}
          tone="primary"
          delta={{ percent: 8.2 }}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-5 md:gap-6">
        <SectionCard title="Spending by category" description="October" className="lg:col-span-2">
          <DonutChart
            data={spendByCategory}
            summary={`Spending by category for October, total ₹${spendTotal.toLocaleString('en-IN')}. Largest: Rent and home.`}
            height={180}
          />
          <ul className="mt-2 space-y-2">
            {spendByCategory.map((item, index) => (
              <li key={item.name} className="flex items-center gap-2 text-body-sm">
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full"
                  style={{ background: donutColor(index) }}
                />
                <span className="flex-1 truncate text-muted-foreground">{item.name}</span>
                <MoneyDisplay amount={item.value} size="sm" />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Recent transactions"
          className="lg:col-span-3"
          flush
          action={
            <Link
              to="/transactions"
              className="inline-flex min-h-(--h-control-md) items-center px-1 text-body-sm font-medium text-primary hover:underline"
            >
              See all
            </Link>
          }
        >
          <ul className="divide-y">
            {transactions.slice(0, 5).map((tx) => (
              <li key={tx.id}>
                <TransactionRow
                  category={tx.category}
                  title={tx.title}
                  subtitle={`${tx.account} · ${tx.time}`}
                  amount={tx.amount}
                  status={tx.status}
                />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="xl:hidden">
        <UpcomingBills />
      </div>

      <section aria-labelledby="accounts-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="accounts-heading" className="text-title-sm font-semibold">
            Accounts
          </h2>
          <Link
            to="/accounts"
            className="inline-flex min-h-(--h-control-md) items-center px-1 text-body-sm font-medium text-primary hover:underline"
          >
            Manage
          </Link>
        </div>
        <ul
          tabIndex={0}
          aria-label="Accounts, scrollable"
          className="relative -mx-(--page-gutter) rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring flex snap-x snap-mandatory gap-3 overflow-x-auto px-(--page-gutter) pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 xl:grid-cols-4"
        >
          {accounts.slice(0, 4).map((account) => (
            <li key={account.id} className="w-64 shrink-0 snap-start md:w-auto">
              <AccountCard {...account} />
            </li>
          ))}
        </ul>
      </section>
    </PageContainer>
  )
}
