import { TrendingDown, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { DonutChart, TrendAreaChart } from '@/components/charts/charts'
import { donutColor } from '@/components/charts/palette'
import { BalanceCard } from '@/components/financial/BalanceCard'
import { MoneyDisplay } from '@/components/financial/MoneyDisplay'
import { SummaryCard } from '@/components/financial/SummaryCard'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionCard } from '@/components/shared/SectionCard'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import { holdings, portfolioSeries } from '@/features/design-preview/data'
import { cn } from '@/lib/utils'

const ranges = { '1M': 2, '6M': 6, '1Y': 12 } as const
type Range = keyof typeof ranges

const invested = holdings.reduce((sum, h) => sum + h.invested, 0)
const current = holdings.reduce((sum, h) => sum + h.current, 0)
const gain = current - invested
const gainPercent = Math.round((gain / invested) * 1000) / 10

const allocation = Object.entries(
  holdings.reduce<Record<string, number>>((acc, h) => {
    acc[h.kind] = (acc[h.kind] ?? 0) + h.current
    return acc
  }, {}),
).map(([name, value]) => ({ name, value }))

export function InvestmentsPage() {
  const [range, setRange] = useState<Range>('1Y')
  const series = portfolioSeries.slice(-ranges[range])

  return (
    <PageContainer>
      <PageHeader
        title="Investments"
        description="Mutual funds, stocks, gold and deposits in one view."
      />

      <BalanceCard
        label="Portfolio value"
        amount={current}
        change={{ amount: gain, period: 'since you invested' }}
      />

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <SummaryCard label="Invested" amount={invested} tone="primary" />
        <SummaryCard
          label="Total returns"
          amount={gain}
          tone="success"
          delta={{ percent: gainPercent, caption: 'overall' }}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-5 md:gap-6">
        <SectionCard
          title="Performance"
          className="lg:col-span-3"
          action={
            <SegmentedControl
              label="Chart range"
              value={range}
              onValueChange={setRange}
              options={(Object.keys(ranges) as Range[]).map((key) => ({ value: key, label: key }))}
            />
          }
        >
          <TrendAreaChart
            data={series}
            summary={`Portfolio value over the last ${range}, ending at ₹${current.toLocaleString('en-IN')}.`}
            height={220}
          />
        </SectionCard>

        <SectionCard title="Allocation" className="lg:col-span-2">
          <DonutChart
            data={allocation}
            summary="Portfolio allocation by asset type."
            height={170}
          />
          <ul className="mt-2 space-y-2">
            {allocation.map((item, index) => (
              <li key={item.name} className="flex items-center gap-2 text-body-sm">
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full"
                  style={{ background: donutColor(index) }}
                />
                <span className="flex-1 text-muted-foreground">{item.name}</span>
                <span className="tabular-nums font-medium">
                  {Math.round((item.value / current) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Holdings" description={`${holdings.length} investments`} flush>
        <ul className="divide-y">
          {holdings.map((h) => {
            const returns = h.current - h.invested
            const percent = Math.round((returns / h.invested) * 1000) / 10
            const up = returns >= 0
            const Trend = up ? TrendingUp : TrendingDown
            return (
              <li
                key={h.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-4 py-3 md:grid-cols-[minmax(0,1fr)_8rem_8rem_7rem] md:px-5"
              >
                <div className="min-w-0">
                  <p className="truncate text-body font-medium">{h.name}</p>
                  <p className="text-body-sm text-muted-foreground">{h.kind}</p>
                </div>
                <div className="hidden text-right md:block">
                  <MoneyDisplay amount={h.invested} size="sm" tone="muted" />
                  <p className="text-caption text-muted-foreground">Invested</p>
                </div>
                <div className="flex flex-col items-end md:items-end">
                  <MoneyDisplay amount={h.current} />
                  <p className="text-caption text-muted-foreground md:hidden">Current</p>
                </div>
                <p
                  className={cn(
                    'col-span-2 flex items-center gap-1 text-body-sm font-medium tabular-nums md:col-span-1 md:justify-end',
                    up ? 'text-success-ink' : 'text-expense-ink',
                  )}
                >
                  <Trend className="size-3.5" aria-hidden="true" />
                  {up ? '+' : '−'}
                  {Math.abs(percent)}%
                  <span className="font-normal text-muted-foreground md:hidden">
                    ({up ? '+' : '−'}₹{Math.abs(returns).toLocaleString('en-IN')})
                  </span>
                </p>
              </li>
            )
          })}
        </ul>
      </SectionCard>
    </PageContainer>
  )
}
