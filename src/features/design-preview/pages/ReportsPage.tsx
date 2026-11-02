import {
  ArrowDownToLine,
  Download,
  FileSpreadsheet,
  FileText,
  PiggyBank,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { DonutChart, IncomeExpenseChart } from '@/components/charts/charts'
import { donutColor } from '@/components/charts/palette'
import { CategoryIcon } from '@/components/financial/CategoryIcon'
import { MoneyDisplay } from '@/components/financial/MoneyDisplay'
import { SummaryCard } from '@/components/financial/SummaryCard'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionCard } from '@/components/shared/SectionCard'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  incomeVsExpense,
  monthlySummary,
  spendByCategory,
  topMerchants,
} from '@/features/design-preview/data'

const spendTotal = spendByCategory.reduce((sum, item) => sum + item.value, 0)
const savingsRate = Math.round((monthlySummary.saved / monthlySummary.income) * 100)

export function ReportsPage() {
  const [period, setPeriod] = useState('6m')

  return (
    <PageContainer>
      <PageHeader
        title="Reports"
        description="Understand where your money goes and how it grows."
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default">
                <Download aria-hidden="true" />
                <span className="max-sm:sr-only">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => toast.success('PDF report prepared (preview)')}>
                <FileText aria-hidden="true" /> Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast.success('CSV exported (preview)')}>
                <FileSpreadsheet aria-hidden="true" /> Download CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="max-w-xs">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger aria-label="Report period" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">This month</SelectItem>
            <SelectItem value="3m">Last 3 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="fy">Financial year 2025–26</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
          label="Savings rate"
          amount={monthlySummary.saved}
          icon={PiggyBank}
          tone="primary"
          delta={{ percent: savingsRate, caption: 'of income saved' }}
        />
      </div>

      <SectionCard title="Income vs expense" description="Last 6 months">
        <IncomeExpenseChart
          data={incomeVsExpense}
          summary="Bar chart of monthly income and expense from May to October. Income is steady near ₹1.3 lakh; expense ranges from ₹52,100 to ₹66,800."
          height={240}
        />
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-2 md:gap-6">
        <SectionCard title="Spending by category" description="October">
          <div className="grid items-center gap-4 sm:grid-cols-2">
            <DonutChart
              data={spendByCategory}
              summary="Spending by category for October."
              height={180}
            />
            <ul className="space-y-2.5">
              {spendByCategory.map((item, index) => (
                <li key={item.name}>
                  <div className="flex items-center gap-2 text-body-sm">
                    <span
                      aria-hidden="true"
                      className="size-2.5 rounded-full"
                      style={{ background: donutColor(index) }}
                    />
                    <span className="flex-1 truncate text-muted-foreground">{item.name}</span>
                    <span className="tabular-nums font-medium">
                      {Math.round((item.value / spendTotal) * 100)}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>

        <SectionCard title="Top spending" description="Biggest merchants this month" flush>
          <ul className="divide-y">
            {topMerchants.map((merchant) => (
              <li key={merchant.name} className="flex items-center gap-3 px-4 py-3 md:px-5">
                <CategoryIcon category={merchant.category} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body font-medium">{merchant.name}</p>
                  <div
                    className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"
                    role="presentation"
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${merchant.share}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <MoneyDisplay amount={merchant.amount} />
                  <p className="text-caption text-muted-foreground">{merchant.share}% of spend</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </PageContainer>
  )
}
