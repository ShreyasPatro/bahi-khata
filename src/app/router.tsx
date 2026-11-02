import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { CenteredLayout } from '@/components/layout/CenteredLayout'
import { NotFoundPage } from '@/components/shared/NotFoundPage'
import { LoginPlaceholder } from '@/features/auth/components/LoginPlaceholder'
import { AccountsPage } from '@/features/design-preview/pages/AccountsPage'
import { DesignSystemPage } from '@/features/design-preview/pages/DesignSystemPage'
import { GroupDetailPage } from '@/features/design-preview/pages/GroupDetailPage'
import { HomePage } from '@/features/design-preview/pages/HomePage'
import { InvestmentsPage } from '@/features/design-preview/pages/InvestmentsPage'
import { KhataPage } from '@/features/design-preview/pages/KhataPage'
import { ModulesPage } from '@/features/design-preview/pages/ModulesPage'
import { ReportsPage } from '@/features/design-preview/pages/ReportsPage'
import { SplitPage } from '@/features/design-preview/pages/SplitPage'
import { TransactionsPage } from '@/features/design-preview/pages/TransactionsPage'
import { WelcomePage } from '@/features/design-preview/pages/WelcomePage'
import { OnboardingPlaceholder } from '@/features/onboarding/components/OnboardingPlaceholder'

export const router = createBrowserRouter([
  { path: '/welcome', element: <WelcomePage /> },
  { path: '/modules', element: <ModulesPage /> },
  {
    element: <CenteredLayout />,
    children: [
      { path: '/login', element: <LoginPlaceholder /> },
      { path: '/onboarding', element: <OnboardingPlaceholder /> },
    ],
  },
  {
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'khata', element: <KhataPage /> },
      { path: 'split', element: <SplitPage /> },
      { path: 'split/groups/:groupId', element: <GroupDetailPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'accounts', element: <AccountsPage /> },
      { path: 'investments', element: <InvestmentsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'design', element: <DesignSystemPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
