import { AuthApiError, AuthRetryableFetchError } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
  getUser: vi.fn(),
  resetPasswordForEmail: vi.fn(),
}))
vi.mock('@/lib/supabase/client', () => ({ supabase: { auth } }))

import {
  AuthServiceError,
  getCurrentUser,
  getSession,
  resetPassword,
  signIn,
  signOut,
  signUp,
  toAuthServiceError,
} from './auth.service'

const apiError = (message: string, status: number, code: string) =>
  new AuthApiError(message, status, code)

beforeEach(() => vi.resetAllMocks())

describe('toAuthServiceError', () => {
  it.each([
    [apiError('x', 400, 'invalid_credentials'), 'invalid_credentials'],
    [apiError('x', 400, 'email_not_confirmed'), 'email_not_confirmed'],
    [apiError('x', 422, 'user_already_exists'), 'user_already_exists'],
    [apiError('x', 422, 'weak_password'), 'weak_password'],
    [apiError('x', 429, 'over_request_rate_limit'), 'rate_limited'],
    [apiError('x', 429, 'something_else'), 'rate_limited'],
    [new AuthRetryableFetchError('x', 0), 'network'],
    [new TypeError('Failed to fetch'), 'network'],
    [new Error('boom'), 'unknown'],
  ])('maps case %# to %s', (input, code) => {
    expect(toAuthServiceError(input).code).toBe(code)
  })

  it('never surfaces the provider message', () => {
    const error = toAuthServiceError(apiError('leaked-detail', 400, 'invalid_credentials'))
    expect(error.message).not.toContain('leaked-detail')
  })
})

describe('auth service', () => {
  it('signUp normalises email and flags email confirmation', async () => {
    auth.signUp.mockResolvedValue({ data: { user: { id: 'u1' }, session: null }, error: null })
    const result = await signUp({ email: '  A@B.com ', password: 'password1', fullName: ' Asha ' })
    expect(auth.signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'a@b.com',
        options: expect.objectContaining({ data: { full_name: 'Asha' } }),
      }),
    )
    expect(result.needsEmailConfirmation).toBe(true)
  })

  it('signIn returns the session and throws a typed error on bad credentials', async () => {
    auth.signInWithPassword.mockResolvedValueOnce({
      data: { session: { access_token: 't' } },
      error: null,
    })
    await expect(signIn({ email: 'a@b.com', password: 'pw' })).resolves.toEqual({
      access_token: 't',
    })

    auth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: apiError('Invalid login credentials', 400, 'invalid_credentials'),
    })
    await expect(signIn({ email: 'a@b.com', password: 'pw' })).rejects.toMatchObject({
      name: 'AuthServiceError',
      code: 'invalid_credentials',
    })
  })

  it('turns a thrown network failure into a typed error', async () => {
    auth.signInWithPassword.mockRejectedValue(new TypeError('Failed to fetch'))
    const failure = await signIn({ email: 'a@b.com', password: 'pw' }).catch((e: unknown) => e)
    expect(failure).toBeInstanceOf(AuthServiceError)
    expect(failure).toMatchObject({ code: 'network' })
  })

  it('getSession returns null when signed out', async () => {
    auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    await expect(getSession()).resolves.toBeNull()
  })

  it('getCurrentUser treats a missing session as signed out, not an error', async () => {
    auth.getUser.mockResolvedValue({
      data: { user: null },
      error: apiError('no session', 401, 'session_not_found'),
    })
    await expect(getCurrentUser()).resolves.toBeNull()
  })

  it('signOut and resetPassword behave on success and failure', async () => {
    auth.signOut.mockResolvedValue({ error: null })
    await expect(signOut()).resolves.toBeUndefined()

    auth.resetPasswordForEmail.mockResolvedValue({
      data: null,
      error: apiError('x', 429, 'over_email_send_rate_limit'),
    })
    await expect(resetPassword('a@b.com')).rejects.toMatchObject({ code: 'rate_limited' })
  })
})
