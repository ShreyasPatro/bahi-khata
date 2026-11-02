/**
 * FICTIONAL SEED DATA — design previews only.
 * Names, amounts and accounts are invented. Replaced by real data layers in later phases.
 */
import type { AccountType } from '@/components/financial/AccountCard'
import type { CategoryKey } from '@/components/financial/categories'
import type { Status } from '@/components/financial/StatusBadge'

export const currentUser = { name: 'Aarav Mehta', firstName: 'Aarav' }

export interface PreviewAccount {
  id: string
  name: string
  institution: string
  type: AccountType
  last4?: string
  balance: number
}

export const accounts: PreviewAccount[] = [
  {
    id: 'hdfc',
    name: 'Salary account',
    institution: 'HDFC Bank',
    type: 'bank',
    last4: '4821',
    balance: 248560.4,
  },
  {
    id: 'kotak',
    name: 'Emergency fund',
    institution: 'Kotak 811',
    type: 'savings',
    last4: '7733',
    balance: 125000,
  },
  {
    id: 'icici',
    name: 'Amazon Pay card',
    institution: 'ICICI Bank',
    type: 'credit',
    last4: '1190',
    balance: -18420,
  },
  { id: 'paytm', name: 'Paytm wallet', institution: 'UPI wallet', type: 'wallet', balance: 3250 },
  { id: 'cash', name: 'Cash in hand', institution: 'Cash', type: 'cash', balance: 4800 },
]

export interface PreviewTransaction {
  id: string
  title: string
  category: CategoryKey
  account: string
  amount: number
  /** Group label for grouped lists. */
  day: 'Today' | 'Yesterday' | 'Earlier this week'
  date: string
  time: string
  status?: Status
}

export const transactions: PreviewTransaction[] = [
  {
    id: 't1',
    title: 'Swiggy — dinner',
    category: 'food',
    account: 'ICICI •• 1190',
    amount: -684,
    day: 'Today',
    date: '1 Nov',
    time: '8:42 pm',
  },
  {
    id: 't2',
    title: 'Metro recharge',
    category: 'transport',
    account: 'Paytm wallet',
    amount: -500,
    day: 'Today',
    date: '1 Nov',
    time: '9:10 am',
  },
  {
    id: 't3',
    title: 'Freelance invoice — Studio Kala',
    category: 'salary',
    account: 'HDFC •• 4821',
    amount: 35000,
    day: 'Yesterday',
    date: '31 Oct',
    time: '4:30 pm',
  },
  {
    id: 't4',
    title: 'BigBasket groceries',
    category: 'groceries',
    account: 'HDFC •• 4821',
    amount: -2340.5,
    day: 'Yesterday',
    date: '31 Oct',
    time: '11:05 am',
  },
  {
    id: 't5',
    title: 'Electricity bill — BESCOM',
    category: 'bills',
    account: 'HDFC •• 4821',
    amount: -1876,
    day: 'Yesterday',
    date: '31 Oct',
    time: '10:00 am',
    status: 'pending',
  },
  {
    id: 't6',
    title: 'Monthly rent — Koramangala',
    category: 'rent',
    account: 'HDFC •• 4821',
    amount: -28000,
    day: 'Earlier this week',
    date: '29 Oct',
    time: '9:00 am',
  },
  {
    id: 't7',
    title: 'SIP — Nifty 50 Index Fund',
    category: 'investment',
    account: 'HDFC •• 4821',
    amount: -10000,
    day: 'Earlier this week',
    date: '28 Oct',
    time: '8:00 am',
  },
  {
    id: 't8',
    title: 'Apollo Pharmacy',
    category: 'health',
    account: 'Cash in hand',
    amount: -460,
    day: 'Earlier this week',
    date: '28 Oct',
    time: '6:20 pm',
  },
  {
    id: 't9',
    title: 'BookMyShow — 2 tickets',
    category: 'entertainment',
    account: 'ICICI •• 1190',
    amount: -780,
    day: 'Earlier this week',
    date: '27 Oct',
    time: '7:45 pm',
  },
  {
    id: 't10',
    title: 'Transfer to Emergency fund',
    category: 'transfer',
    account: 'HDFC •• 4821',
    amount: -15000,
    day: 'Earlier this week',
    date: '27 Oct',
    time: '12:15 pm',
  },
]

export const upcomingBills = [
  {
    id: 'b1',
    title: 'Airtel Postpaid',
    due: 'Due in 2 days',
    amount: 799,
    status: 'pending' as Status,
    category: 'bills' as CategoryKey,
  },
  {
    id: 'b2',
    title: 'Netflix',
    due: 'Due in 6 days',
    amount: 649,
    status: 'pending' as Status,
    category: 'entertainment' as CategoryKey,
  },
  {
    id: 'b3',
    title: 'Credit card — ICICI',
    due: 'Due in 9 days',
    amount: 18420,
    status: 'pending' as Status,
    category: 'bills' as CategoryKey,
  },
]

export const spendByCategory = [
  { name: 'Rent & home', value: 28000 },
  { name: 'Food & dining', value: 9420 },
  { name: 'Groceries', value: 7180 },
  { name: 'Transport', value: 3860 },
  { name: 'Other', value: 6240 },
]

export const monthlySummary = {
  income: 135000,
  spent: 54700,
  saved: 80300,
}

export interface KhataParty {
  id: string
  name: string
  note: string
  /** Positive: they owe you. Negative: you owe them. */
  balance: number
  status: Status
  lastEntry: string
  entries: { id: string; label: string; amount: number; date: string }[]
}

export const khataParties: KhataParty[] = [
  {
    id: 'k1',
    name: 'Ramesh Uncle',
    note: 'Loan for shop renovation',
    balance: 15000,
    status: 'owed',
    lastEntry: '12 days ago',
    entries: [
      { id: 'e1', label: 'Lent in cash', amount: 20000, date: '19 Oct' },
      { id: 'e2', label: 'Part payment received', amount: -5000, date: '24 Oct' },
    ],
  },
  {
    id: 'k2',
    name: 'Kabir Singh',
    note: 'Concert tickets advance',
    balance: 8000,
    status: 'overdue',
    lastEntry: '34 days ago',
    entries: [{ id: 'e3', label: 'Paid on his behalf (UPI)', amount: 8000, date: '28 Sep' }],
  },
  {
    id: 'k3',
    name: 'Sharma Kirana Store',
    note: 'Monthly grocery credit',
    balance: -1250,
    status: 'owing',
    lastEntry: '3 days ago',
    entries: [
      { id: 'e4', label: 'Groceries on credit', amount: -2100, date: '29 Oct' },
      { id: 'e5', label: 'Paid by UPI', amount: 850, date: '30 Oct' },
    ],
  },
  {
    id: 'k4',
    name: 'Priya Nair',
    note: 'Cab fare, Pune trip',
    balance: -2400,
    status: 'owing',
    lastEntry: '1 week ago',
    entries: [{ id: 'e6', label: 'Cab fare share', amount: -2400, date: '25 Oct' }],
  },
  {
    id: 'k5',
    name: 'Neha Kapoor',
    note: 'Birthday gift split',
    balance: 0,
    status: 'settled',
    lastEntry: '2 weeks ago',
    entries: [{ id: 'e7', label: 'Settled in full', amount: 0, date: '18 Oct' }],
  },
]

export interface PreviewMember {
  id: string
  name: string
  initials: string
  /** Net balance within the group. Positive: owed to them. */
  balance: number
}

export interface PreviewGroup {
  id: string
  name: string
  emoji: string
  members: PreviewMember[]
  total: number
  /** Your net position: positive = you are owed. */
  yourBalance: number
  lastActivity: string
}

const goaMembers: PreviewMember[] = [
  { id: 'm1', name: 'You (Aarav)', initials: 'AM', balance: 6350 },
  { id: 'm2', name: 'Meera Joshi', initials: 'MJ', balance: -2100 },
  { id: 'm3', name: 'Kabir Singh', initials: 'KS', balance: -3250 },
  { id: 'm4', name: 'Isha Rao', initials: 'IR', balance: 1500 },
  { id: 'm5', name: 'Dev Patel', initials: 'DP', balance: -1200 },
  { id: 'm6', name: 'Tara Menon', initials: 'TM', balance: -1300 },
]

export const groups: PreviewGroup[] = [
  {
    id: 'goa-trip',
    name: 'Goa trip',
    emoji: '🏖️',
    members: goaMembers,
    total: 84200,
    yourBalance: 6350,
    lastActivity: 'Today',
  },
  {
    id: 'flat-402',
    name: 'Flat 402',
    emoji: '🏠',
    members: [
      { id: 'f1', name: 'You (Aarav)', initials: 'AM', balance: -2150 },
      { id: 'f2', name: 'Sanjay Iyer', initials: 'SI', balance: 1400 },
      { id: 'f3', name: 'Rohan Das', initials: 'RD', balance: 750 },
    ],
    total: 41300,
    yourBalance: -2150,
    lastActivity: 'Yesterday',
  },
  {
    id: 'office-lunch',
    name: 'Office lunch gang',
    emoji: '🍛',
    members: [
      { id: 'o1', name: 'You (Aarav)', initials: 'AM', balance: 0 },
      { id: 'o2', name: 'Meera Joshi', initials: 'MJ', balance: 0 },
    ],
    total: 6120,
    yourBalance: 0,
    lastActivity: '3 days ago',
  },
]

export const goaExpenses = [
  {
    id: 'g1',
    title: 'Beach shack dinner',
    category: 'food' as CategoryKey,
    paidBy: 'You',
    total: 7200,
    yourShare: 1200,
    date: '1 Nov',
  },
  {
    id: 'g2',
    title: 'Scooter rentals (3 days)',
    category: 'transport' as CategoryKey,
    paidBy: 'Kabir',
    total: 5400,
    yourShare: 900,
    date: '31 Oct',
  },
  {
    id: 'g3',
    title: 'Villa — 3 nights',
    category: 'rent' as CategoryKey,
    paidBy: 'You',
    total: 48000,
    yourShare: 8000,
    date: '30 Oct',
  },
  {
    id: 'g4',
    title: 'Sunburn festival passes',
    category: 'entertainment' as CategoryKey,
    paidBy: 'Isha',
    total: 15600,
    yourShare: 2600,
    date: '30 Oct',
  },
  {
    id: 'g5',
    title: 'Airport cab',
    category: 'transport' as CategoryKey,
    paidBy: 'Meera',
    total: 4000,
    yourShare: 667,
    date: '29 Oct',
  },
]

export const friends = [
  { id: 'fr1', name: 'Meera Joshi', initials: 'MJ', balance: 2100 },
  { id: 'fr2', name: 'Kabir Singh', initials: 'KS', balance: 3250 },
  { id: 'fr3', name: 'Sanjay Iyer', initials: 'SI', balance: -1400 },
  { id: 'fr4', name: 'Isha Rao', initials: 'IR', balance: -1500 },
]

export const activity = [
  { id: 'a1', text: 'Isha added “Sunburn festival passes” in Goa trip', time: '2h ago' },
  { id: 'a2', text: 'You settled ₹750 with Rohan in Flat 402', time: 'Yesterday' },
  { id: 'a3', text: 'Meera added “Airport cab” in Goa trip', time: '2 days ago' },
]

export interface PreviewHolding {
  id: string
  name: string
  kind: 'Mutual fund' | 'Stock' | 'Fixed deposit' | 'Gold'
  invested: number
  current: number
}

export const holdings: PreviewHolding[] = [
  { id: 'h1', name: 'Nifty 50 Index Fund', kind: 'Mutual fund', invested: 240000, current: 291400 },
  {
    id: 'h2',
    name: 'Flexi Cap Fund — Direct',
    kind: 'Mutual fund',
    invested: 180000,
    current: 214800,
  },
  { id: 'h3', name: 'HDFC Bank', kind: 'Stock', invested: 95000, current: 88650 },
  { id: 'h4', name: 'Sovereign Gold Bond 2031', kind: 'Gold', invested: 60000, current: 78200 },
  { id: 'h5', name: 'SBI Fixed Deposit', kind: 'Fixed deposit', invested: 150000, current: 158900 },
]

export const portfolioSeries = [
  { label: 'Nov', value: 640000 },
  { label: 'Dec', value: 652000 },
  { label: 'Jan', value: 661000 },
  { label: 'Feb', value: 649000 },
  { label: 'Mar', value: 676000 },
  { label: 'Apr', value: 689000 },
  { label: 'May', value: 702000 },
  { label: 'Jun', value: 698000 },
  { label: 'Jul', value: 721000 },
  { label: 'Aug', value: 735000 },
  { label: 'Sep', value: 744000 },
  { label: 'Oct', value: 831950 },
]

export const incomeVsExpense = [
  { label: 'May', income: 128000, expense: 61200 },
  { label: 'Jun', income: 128000, expense: 58400 },
  { label: 'Jul', income: 131000, expense: 66800 },
  { label: 'Aug', income: 128000, expense: 52100 },
  { label: 'Sep', income: 128000, expense: 57300 },
  { label: 'Oct', income: 135000, expense: 54700 },
]

export const topMerchants = [
  { name: 'Rent — Koramangala flat', category: 'rent' as CategoryKey, amount: 28000, share: 51 },
  { name: 'Swiggy & Zomato', category: 'food' as CategoryKey, amount: 6120, share: 11 },
  { name: 'BigBasket & Blinkit', category: 'groceries' as CategoryKey, amount: 5480, share: 10 },
  { name: 'Uber, Ola & Metro', category: 'transport' as CategoryKey, amount: 3860, share: 7 },
]

export interface PreviewGroupExpense {
  id: string
  title: string
  category: CategoryKey
  paidBy: string
  total: number
  /** Your share of this expense. */
  yourShare: number
  date: string
}

export const groupExpenses: Record<string, PreviewGroupExpense[]> = {
  'goa-trip': goaExpenses,
  'flat-402': [
    {
      id: 'x1',
      title: 'October rent',
      category: 'rent',
      paidBy: 'You',
      total: 36000,
      yourShare: 12000,
      date: '1 Nov',
    },
    {
      id: 'x2',
      title: 'Wi-Fi — ACT Fibernet',
      category: 'bills',
      paidBy: 'Sanjay',
      total: 1180,
      yourShare: 393,
      date: '28 Oct',
    },
    {
      id: 'x3',
      title: 'Cook & maid salary',
      category: 'other',
      paidBy: 'Rohan',
      total: 4120,
      yourShare: 1373,
      date: '27 Oct',
    },
  ],
  'office-lunch': [],
}
