import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { HomePlaceholder } from '@/components/shared/HomePlaceholder'
import { NotFoundPage } from '@/components/shared/NotFoundPage'

function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePlaceholder /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
    { initialEntries: [path] },
  )
  return render(<RouterProvider router={router} />)
}

describe('app shell', () => {
  it('renders the Bahi logo and home placeholder', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Bahi' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /welcome to bahi/i })).toBeInTheDocument()
  })

  it('renders the 404 page for unknown routes', () => {
    renderAt('/does-not-exist')
    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument()
  })
})
