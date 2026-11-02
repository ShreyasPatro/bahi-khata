import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import { AuthContext, type AuthActionResult, type AuthContextValue } from './auth-context'
import * as authService from './services/auth.service'
import { AuthServiceError, toAuthServiceError } from './services/auth.service'
import type { Session } from './types'

/**
 * Central auth state. Reads the persisted session once, then follows Supabase's
 * auth events (sign-in, sign-out, token refresh, other tabs).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AuthServiceError | null>(null)

  useEffect(() => {
    let active = true

    // Callback must stay synchronous: awaiting Supabase calls inside it can deadlock the client.
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      setIsLoading(false)
    })

    authService
      .getSession()
      .then((initial) => {
        if (active) setSession((current) => current ?? initial)
      })
      .catch((thrown: unknown) => {
        if (active) setError(toAuthServiceError(thrown))
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const run = useCallback(async <T,>(action: () => Promise<T>): Promise<AuthActionResult<T>> => {
    setError(null)
    try {
      return { ok: true, data: await action() }
    } catch (thrown) {
      const failure = toAuthServiceError(thrown)
      setError(failure)
      return { ok: false, error: failure }
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      status: isLoading ? 'loading' : session ? 'authenticated' : 'unauthenticated',
      isLoading,
      session,
      user: session?.user ?? null,
      error,
      clearError: () => setError(null),
      signUp: (input) => run(() => authService.signUp(input)),
      signIn: (input) => run(async () => void (await authService.signIn(input))),
      signOut: () => run(() => authService.signOut()),
      resetPassword: (email) => run(() => authService.resetPassword(email)),
    }),
    [error, isLoading, run, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
