import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { donutPalette } from '@/components/charts/palette'
import { chartColors } from '@/constants/design-tokens'
import { formatMoney } from '@/lib/utils/money'

const axisProps = {
  tick: { fill: chartColors.axis, fontSize: 12 },
  tickLine: false,
  axisLine: false,
} as const

const tooltipStyle = {
  contentStyle: {
    background: 'var(--popover)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    boxShadow: 'var(--shadow-raised)',
    fontSize: 13,
    color: 'var(--popover-foreground)',
  },
  itemStyle: { color: 'var(--popover-foreground)' },
  labelStyle: { color: 'var(--muted-foreground)', marginBottom: 4 },
} as const

const money = (value: unknown) => formatMoney(Number(value ?? 0))

interface ChartFrameProps {
  /** Text alternative describing what the chart shows. */
  summary: string
  height?: number
  children: React.ReactElement
}

function ChartFrame({ summary, height = 240, children }: ChartFrameProps) {
  return (
    <div role="img" aria-label={summary} style={{ height }} className="w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}

interface TrendAreaChartProps {
  data: { label: string; value: number }[]
  summary: string
  height?: number
}

export function TrendAreaChart({ data, summary, height }: TrendAreaChartProps) {
  return (
    <ChartFrame summary={summary} height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.25} />
            <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={chartColors.grid} />
        <XAxis dataKey="label" {...axisProps} interval="preserveStartEnd" />
        <YAxis hide domain={['dataMin - 10000', 'dataMax + 10000']} />
        <Tooltip {...tooltipStyle} formatter={(value) => [money(value), 'Value']} />
        <Area
          isAnimationActive={false}
          type="monotone"
          dataKey="value"
          stroke={chartColors.primary}
          strokeWidth={2.5}
          fill="url(#trend-fill)"
        />
      </AreaChart>
    </ChartFrame>
  )
}

interface DonutDatum {
  name: string
  value: number
}

export function DonutChart({
  data,
  summary,
  height,
}: {
  data: DonutDatum[]
  summary: string
  height?: number
}) {
  return (
    <ChartFrame summary={summary} height={height ?? 200}>
      <PieChart>
        <Tooltip {...tooltipStyle} formatter={(value, name) => [money(value), String(name)]} />
        <Pie
          isAnimationActive={false}
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="62%"
          outerRadius="92%"
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={donutPalette[index % donutPalette.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartFrame>
  )
}

interface IncomeExpenseChartProps {
  data: { label: string; income: number; expense: number }[]
  summary: string
  height?: number
}

export function IncomeExpenseChart({ data, summary, height }: IncomeExpenseChartProps) {
  return (
    <ChartFrame summary={summary} height={height}>
      <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 4 }} barGap={4}>
        <CartesianGrid vertical={false} stroke={chartColors.grid} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis hide />
        <Tooltip
          {...tooltipStyle}
          cursor={{ fill: 'var(--muted)' }}
          formatter={(value, name) => [money(value), String(name)]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: 'var(--muted-foreground)' }}
        />
        <Bar
          isAnimationActive={false}
          dataKey="income"
          name="Income"
          fill={chartColors.success}
          radius={[6, 6, 0, 0]}
          maxBarSize={22}
        />
        <Bar
          isAnimationActive={false}
          dataKey="expense"
          name="Expense"
          fill={chartColors.expense}
          radius={[6, 6, 0, 0]}
          maxBarSize={22}
        />
      </BarChart>
    </ChartFrame>
  )
}
