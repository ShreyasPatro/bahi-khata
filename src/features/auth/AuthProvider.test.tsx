import { act, render, screen, waitFor } from '@testing-library/react'
import { AuthApiError } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

type Listener = (event: string, session: unknown) => void
const state = vi.hoisted(() => ({ listener: null as null | ((e: string, s: unknown) => void) }))
const auth = vi.hoisted(() => ({
  getSession: vi.fn(),
  signInWithPassword: vi.fn(),
  onAuthStateChange: vi.fn(),
}))
vi.mock('@/lib/supabase/client', () => ({ supabase: { auth } }))

import { AuthProvider } from './AuthProvider'
import { useAuth } from './hooks/useAuth'

function Probe() {
  const { status, user, error, signIn } = useAuth()
  return (
    <div>
      <p data-testid="status">{status}</p>
      <p data-testid="user">{user?.email ?? 'none'}</p>
      <p data-testid="error">{error?.code ?? 'none'}</p>
      <button onClick={() => void signIn({ email: 'a@b.com', password: 'pw' })}>go</button>
    </div>
  )
}

const unsubscribe = vi.fn()
beforeEach(() => {
  vi.resetAllMocks()
  auth.onAuthStateChange.mockImplementation((callback: Listener) => {
    state.listener = callback
    return { data: { subscription: { unsubscribe } } }
  })
})

function renderProvider() {
  return render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  )
}

describe('AuthProvider', () => {
  it('starts loading, then resolves to unauthenticated', async () => {
    auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    renderProvider()
    expect(screen.getByTestId('status')).toHaveTextContent('loading')
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated'))
  })

  it('restores a persisted session and follows auth events', async () => {
    auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'a@b.com' } } },
      error: null,
    })
    renderProvider()
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('authenticated'))
    expect(screen.getByTestId('user')).toHaveTextContent('a@b.com')

    act(() => state.listener?.('SIGNED_OUT', null))
    expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated')
  })

  it('exposes action errors and unsubscribes on unmount', async () => {
    auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: new AuthApiError('bad', 400, 'invalid_credentials'),
    })
    const { unmount } = renderProvider()
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated'))

    await act(async () => screen.getByText('go').click())
    await waitFor(() =>
      expect(screen.getByTestId('error')).toHaveTextContent('invalid_credentials'),
    )

    unmount()
    expect(unsubscribe).toHaveBeenCalled()
  })
})
