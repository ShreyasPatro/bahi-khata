import type { Session, User } from '@supabase/supabase-js'

export type { Session, User }

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface SignUpInput {
  email: string
  password: string
  fullName?: string
}

export interface SignInInput {
  email: string
  password: string
}

export interface SignUpResult {
  user: User | null
  session: Session | null
  /** True when the project requires email confirmation before the first sign-in. */
  needsEmailConfirmation: boolean
}

/** Stable, UI-friendly error codes. Raw provider messages are never shown to users. */
export type AuthErrorCode =
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'user_already_exists'
  | 'weak_password'
  | 'rate_limited'
  | 'signup_disabled'
  | 'network'
  | 'unknown'
