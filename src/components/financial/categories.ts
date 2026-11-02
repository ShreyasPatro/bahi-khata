import {
  ArrowLeftRight,
  Bus,
  Clapperboard,
  Coins,
  HeartPulse,
  Home,
  Plane,
  ReceiptText,
  ShoppingBag,
  ShoppingBasket,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { Tone } from '@/lib/utils/tone'

export type CategoryKey =
  | 'food'
  | 'groceries'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'rent'
  | 'health'
  | 'entertainment'
  | 'travel'
  | 'salary'
  | 'investment'
  | 'transfer'
  | 'other'

export const categories: Record<CategoryKey, { label: string; icon: LucideIcon; tone: Tone }> = {
  food: { label: 'Food & dining', icon: UtensilsCrossed, tone: 'warning' },
  groceries: { label: 'Groceries', icon: ShoppingBasket, tone: 'success' },
  transport: { label: 'Transport', icon: Bus, tone: 'primary' },
  shopping: { label: 'Shopping', icon: ShoppingBag, tone: 'expense' },
  bills: { label: 'Bills & utilities', icon: ReceiptText, tone: 'neutral' },
  rent: { label: 'Rent & home', icon: Home, tone: 'primary' },
  health: { label: 'Health', icon: HeartPulse, tone: 'expense' },
  entertainment: { label: 'Entertainment', icon: Clapperboard, tone: 'warning' },
  travel: { label: 'Travel', icon: Plane, tone: 'primary' },
  salary: { label: 'Salary', icon: Wallet, tone: 'success' },
  investment: { label: 'Investments', icon: TrendingUp, tone: 'success' },
  transfer: { label: 'Transfer', icon: ArrowLeftRight, tone: 'neutral' },
  other: { label: 'Other', icon: Coins, tone: 'neutral' },
}

export function getCategory(key: CategoryKey) {
  return categories[key]
}

export const categoryKeys = Object.keys(categories) as CategoryKey[]
