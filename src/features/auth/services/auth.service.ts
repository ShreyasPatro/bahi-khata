import { AuthError, isAuthApiError, isAuthRetryableFetchError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import type { AuthErrorCode, Session, SignInInput, SignUpInput, SignUpResult, User } from '../types'

const MESSAGES: Record<AuthErrorCode, string> = {
  invalid_credentials: 'That email and password do not match.',
  email_not_confirmed: 'Confirm your email address first — check your inbox for the link.',
  user_already_exists: 'An account with this email already exists. Try signing in instead.',
  weak_password: 'Choose a stronger password (at least 8 characters).',
  rate_limited: 'Too many attempts. Please wait a minute and try again.',
  signup_disabled: 'New sign-ups are currently turned off.',
  network: 'Cannot reach the server. Check your connection and try again.',
  unknown: 'Something went wrong. Please try again.',
}

/** Error thrown by every auth service function. Carries a stable code and a safe message. */
export class AuthServiceError extends Error {
  readonly code: AuthErrorCode

  constructor(code: AuthErrorCode, options?: { cause?: unknown }) {
    super(MESSAGES[code], options)
    this.name = 'AuthServiceError'
    this.code = code
  }
}

/**
 * Maps any thrown value to an AuthServiceError. The provider's raw message is kept
 * only as `cause` for debugging and is never surfaced; credentials are never logged.
 */
export function toAuthServiceError(error: unknown): AuthServiceError {
  if (error instanceof AuthServiceError) return error

  if (isAuthRetryableFetchError(error) || error instanceof TypeError) {
    return new AuthServiceError('network', { cause: error })
  }

  if (isAuthApiError(error)) {
    switch (error.code) {
      case 'invalid_credentials':
        return new AuthServiceError('invalid_credentials', { cause: error })
      case 'email_not_confirmed':
        return new AuthServiceError('email_not_confirmed', { cause: error })
      case 'user_already_exists':
      case 'email_exists':
        return new AuthServiceError('user_already_exists', { cause: error })
      case 'weak_password':
        return new AuthServiceError('weak_password', { cause: error })
      case 'signup_disabled':
      case 'email_provider_disabled':
        return new AuthServiceError('signup_disabled', { cause: error })
      case 'over_request_rate_limit':
      case 'over_email_send_rate_limit':
        return new AuthServiceError('rate_limited', { cause: error })
    }
    if (error.status === 429) return new AuthServiceError('rate_limited', { cause: error })
  }

  return new AuthServiceError('unknown', { cause: error })
}

function origin(): string {
  return window.location.origin
}

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function signUp({ email, password, fullName }: SignUpInput): Promise<SignUpResult> {
  const { data, error } = await supabase.auth
    .signUp({
      email: normaliseEmail(email),
      password,
      options: {
        emailRedirectTo: `${origin()}/`,
        data: fullName ? { full_name: fullName.trim() } : undefined,
      },
    })
    .catch((thrown: unknown) => ({ data: null, error: thrown }))

  if (error || !data) throw toAuthServiceError(error)

  // With email confirmation on, Supabase returns a user but no session. For an email that is
  // already registered it returns a user with no identities, to avoid revealing which emails exist.
  return {
    user: data.user,
    session: data.session,
    needsEmailConfirmation: data.user !== null && data.session === null,
  }
}

export async function signIn({ email, password }: SignInInput): Promise<Session> {
  const { data, error } = await supabase.auth
    .signInWithPassword({ email: normaliseEmail(email), password })
    .catch((thrown: unknown) => ({ data: null, error: thrown }))

  if (error || !data?.session) throw toAuthServiceError(error)
  return data.session
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth
    .signOut()
    .catch((thrown: unknown) => ({ error: thrown as AuthError }))
  if (error) throw toAuthServiceError(error)
}

/** Returns the stored session (refreshing it if expired), or null when signed out. */
export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth
    .getSession()
    .catch((thrown: unknown) => ({ data: null, error: thrown }))
  if (error || !data) throw toAuthServiceError(error)
  return data.session
}

/**
 * Returns the user verified against the Auth server, or null when signed out.
 * Prefer this over `session.user` for anything security-sensitive.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth
    .getUser()
    .catch((thrown: unknown) => ({ data: null, error: thrown }))

  if (error || !data) {
    // "No session" is a normal signed-out state, not a failure.
    if (isAuthApiError(error) && (error.status === 401 || error.status === 403)) return null
    if (error instanceof AuthError && error.name === 'AuthSessionMissingError') return null
    throw toAuthServiceError(error)
  }
  return data.user
}

/** Sends a password-reset email. Succeeds silently for unknown emails (no account enumeration). */
export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth
    .resetPasswordForEmail(normaliseEmail(email), { redirectTo: `${origin()}/reset-password` })
    .catch((thrown: unknown) => ({ data: null, error: thrown as AuthError }))
  if (error) throw toAuthServiceError(error)
}
