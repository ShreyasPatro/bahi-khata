import { createContext } from 'react'
import type { AuthServiceError } from './services/auth.service'
import type { AuthStatus, Session, SignInInput, SignUpInput, SignUpResult, User } from './types'

export type AuthActionResult<T = void> =
  { ok: true; data: T } | { ok: false; error: AuthServiceError }

export interface AuthContextValue {
  status: AuthStatus
  /** True until the persisted session has been read for the first time. */
  isLoading: boolean
  session: Session | null
  user: User | null
  /** Most recent action error, cleared by the next action or `clearError`. */
  error: AuthServiceError | null
  clearError: () => void
  signUp: (input: SignUpInput) => Promise<AuthActionResult<SignUpResult>>
  signIn: (input: SignInInput) => Promise<AuthActionResult>
  signOut: () => Promise<AuthActionResult>
  resetPassword: (email: string) => Promise<AuthActionResult>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
