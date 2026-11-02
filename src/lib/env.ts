import { z } from 'zod'

/**
 * Browser-safe environment. Only public values belong here: the project URL and
 * the publishable (or legacy anon) key. Secrets such as the service-role key must
 * never be placed in a VITE_* variable, because Vite ships those to the browser.
 *
 * Messages name variables only — they never echo a value.
 */

export const ENV_HELP =
  'Copy .env.example to .env.local, fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the dev server.'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1'])

/** Reads the `role` claim of a legacy JWT key without verifying it. */
function jwtRole(key: string): string | undefined {
  const payload = key.split('.')[1]
  if (!payload) return undefined
  try {
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const role = (JSON.parse(json) as { role?: unknown }).role
    return typeof role === 'string' ? role : undefined
  } catch {
    return undefined
  }
}

/** True for new-style `sb_secret_…` keys and legacy JWTs carrying the service_role claim. */
export function isServiceRoleKey(key: string): boolean {
  return key.startsWith('sb_secret_') || jwtRole(key) === 'service_role'
}

const supabaseUrl = z
  .string()
  .trim()
  .min(1, 'VITE_SUPABASE_URL is missing.')
  .refine((value) => URL.canParse(value), 'VITE_SUPABASE_URL is not a valid URL.')
  .refine((value) => {
    if (!URL.canParse(value)) return true
    const { protocol, hostname } = new URL(value)
    return protocol === 'https:' || (protocol === 'http:' && LOCAL_HOSTS.has(hostname))
  }, 'VITE_SUPABASE_URL must use https:// (http:// is only allowed for localhost).')

const supabaseKey = z
  .string()
  .trim()
  .min(1, 'VITE_SUPABASE_ANON_KEY is missing.')
  .refine(
    (value) => !isServiceRoleKey(value),
    'VITE_SUPABASE_ANON_KEY contains a service-role/secret key. Use the publishable or anon key; remove the secret key from the browser env immediately.',
  )

const envSchema = z.object({
  VITE_SUPABASE_URL: supabaseUrl,
  VITE_SUPABASE_ANON_KEY: supabaseKey,
})

export type Env = z.infer<typeof envSchema>

export interface EnvValidation {
  /** Validated values, present only when `issues` is empty. */
  env: Env | null
  issues: string[]
}

/** Validates a raw Vite env object. Pure, so it can be unit tested. */
export function validateEnv(raw: Record<string, unknown>): EnvValidation {
  const issues: string[] = []

  // Any VITE_ variable that looks like a service-role key is a leak, whatever its value.
  for (const name of Object.keys(raw)) {
    if (/^VITE_.*SERVICE[_-]?ROLE/i.test(name)) {
      issues.push(`${name} must not exist: service-role keys must never be exposed to the browser.`)
    }
  }

  const result = envSchema.safeParse({
    VITE_SUPABASE_URL: raw.VITE_SUPABASE_URL ?? '',
    VITE_SUPABASE_ANON_KEY: raw.VITE_SUPABASE_ANON_KEY ?? '',
  })
  if (!result.success) {
    // One message per variable: an empty value would otherwise be reported as missing *and* invalid.
    const seen = new Set<PropertyKey>()
    for (const issue of result.error.issues) {
      const field = issue.path[0] ?? ''
      if (seen.has(field)) continue
      seen.add(field)
      issues.push(issue.message)
    }
  }

  return { env: issues.length === 0 && result.success ? result.data : null, issues }
}

export const envValidation = validateEnv(import.meta.env)

/** Problems with the current environment; empty when the app can start. */
export const envIssues = envValidation.issues

/** Validated env. Throws a clear, value-free error when configuration is invalid. */
export function getEnv(): Env {
  if (!envValidation.env) {
    throw new Error(`Bahi is not configured.\n- ${envValidation.issues.join('\n- ')}\n${ENV_HELP}`)
  }
  return envValidation.env
}
