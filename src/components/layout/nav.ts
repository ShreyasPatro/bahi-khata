import {
  ArrowLeftRight,
  BookOpen,
  Home,
  LayoutGrid,
  Palette,
  PieChart,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export const mainNav: NavItem[] = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/khata', label: 'Khata', icon: BookOpen },
  { to: '/split', label: 'Split', icon: Users },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/accounts', label: 'Accounts', icon: Wallet },
  { to: '/investments', label: 'Investments', icon: TrendingUp },
  { to: '/reports', label: 'Reports', icon: PieChart },
]

/** Design-preview links that live outside the product navigation. */
export const previewNav: NavItem[] = [
  { to: '/welcome', label: 'Welcome screen', icon: Sparkles },
  { to: '/modules', label: 'Module selection', icon: LayoutGrid },
  { to: '/design', label: 'Design system', icon: Palette },
]

/** Bottom navigation: three tabs flank a centre "Add" action, the rest live in "More". */
export const bottomNavLeft = mainNav.slice(0, 2)
export const bottomNavRight = mainNav.slice(2, 3)
export const moreNav = mainNav.slice(3)
