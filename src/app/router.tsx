import { createBrowserRouter } from 'react-router-dom'
import { LoginPlaceholder } from '@/features/auth/components/LoginPlaceholder'
import { OnboardingPlaceholder } from '@/features/onboarding/components/OnboardingPlaceholder'
import { AppLayout } from '@/components/layout/AppLayout'
import { HomePlaceholder } from '@/components/shared/HomePlaceholder'
import { NotFoundPage } from '@/components/shared/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePlaceholder /> },
      { path: 'login', element: <LoginPlaceholder /> },
      { path: 'onboarding', element: <OnboardingPlaceholder /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
