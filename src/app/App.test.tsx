import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { Providers } from '@/app/providers'
import { AppShell } from '@/components/layout/AppShell'
import { NotFoundPage } from '@/components/shared/NotFoundPage'
import { GroupDetailPage } from '@/features/design-preview/pages/GroupDetailPage'
import { HomePage } from '@/features/design-preview/pages/HomePage'
import { SplitPage } from '@/features/design-preview/pages/SplitPage'

function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'split', element: <SplitPage /> },
          { path: 'split/groups/:groupId', element: <GroupDetailPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
    { initialEntries: [path] },
  )
  return render(
    <Providers>
      <RouterProvider router={router} />
    </Providers>,
  )
}

describe('app shell', () => {
  it('renders the design-preview home inside the shell with both navigations', () => {
    renderAt('/')
    expect(
      screen.getByRole('heading', { level: 1, name: /good evening, aarav/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('navigation', { name: 'Primary' })).toHaveLength(2)
    expect(screen.getByText(/all data on screen is fictional/i)).toBeInTheDocument()
  })

  it('renders the 404 page for unknown routes', () => {
    renderAt('/does-not-exist')
    expect(screen.getByRole('heading', { level: 1, name: /404/i })).toBeInTheDocument()
  })

  it('shows an error state for an unknown group', () => {
    renderAt('/split/groups/nope')
    expect(screen.getByRole('alert')).toHaveTextContent(/could not find that group/i)
  })

  it('lists groups on the split page', () => {
    renderAt('/split')
    expect(screen.getByRole('link', { name: /goa trip/i })).toHaveAttribute(
      'href',
      '/split/groups/goa-trip',
    )
  })
})
