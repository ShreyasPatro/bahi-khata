// TEMPORARY connection test: `npm run check:supabase`.
// Reads .env.local, then checks the URL, client initialisation, the network path and the
// Auth endpoints. It reads no tables and never prints a key. Remove once real data features land.
import { createClient } from '@supabase/supabase-js'

try {
  process.loadEnvFile('.env.local')
} catch {
  console.error('FAIL  .env.local not found. Copy .env.example to .env.local and fill it in.')
  process.exit(1)
}

const url = (process.env.VITE_SUPABASE_URL ?? '').trim()
const key = (process.env.VITE_SUPABASE_ANON_KEY ?? '').trim()
let failed = false

function report(ok, label, detail = '') {
  if (!ok) failed = true
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ` — ${detail}` : ''}`)
}

function jwtRole(token) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()).role
  } catch {
    return undefined
  }
}

// 1. Variables present, valid and safe (values are never printed).
report(Boolean(url), 'VITE_SUPABASE_URL is set')
report(Boolean(key), 'VITE_SUPABASE_ANON_KEY is set')
if (!url || !key) process.exit(1)

report(
  !(key.startsWith('sb_secret_') || jwtRole(key) === 'service_role'),
  'key is not a service-role/secret key',
)

const validUrl = URL.canParse(url)
report(validUrl, 'project URL is a valid URL')
if (!validUrl) process.exit(1)
const { protocol, hostname } = new URL(url)
const local = hostname === 'localhost' || hostname === '127.0.0.1'
report(
  protocol === 'https:' || local,
  'project URL uses https',
  protocol === 'https:' ? '' : 'http only allowed for localhost',
)
report(local || hostname.endsWith('.supabase.co'), 'host looks like a Supabase project', hostname)

// 2. Client initialises.
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})
report(typeof supabase.auth?.getSession === 'function', 'Supabase client initialises')

// 3. Network + Auth endpoints reachable.
const headers = { apikey: key }
const timeout = () => AbortSignal.timeout(10_000)

try {
  const health = await fetch(`${url}/auth/v1/health`, { headers, signal: timeout() })
  report(health.ok, 'Auth health endpoint reachable', `HTTP ${health.status}`)

  const settingsResponse = await fetch(`${url}/auth/v1/settings`, { headers, signal: timeout() })
  report(
    settingsResponse.ok,
    'Auth settings endpoint reachable (key accepted)',
    `HTTP ${settingsResponse.status}`,
  )
  if (settingsResponse.ok) {
    const settings = await settingsResponse.json()
    console.log(
      `INFO  email sign-in: ${settings.external?.email ? 'enabled' : 'DISABLED'}; ` +
        `sign-ups: ${settings.disable_signup ? 'DISABLED' : 'enabled'}; ` +
        `email confirmation: ${settings.mailer_autoconfirm ? 'off (auto-confirm)' : 'required'}`,
    )
  }
} catch (error) {
  report(false, 'network request to project', error instanceof Error ? error.name : 'unknown error')
}

// 4. SDK round trip: no stored session is a normal signed-out result, not an error.
try {
  const { data, error } = await supabase.auth.getSession()
  report(!error && data.session === null, 'supabase.auth.getSession() works (signed out)')
} catch {
  report(false, 'supabase.auth.getSession() works')
}

console.log(failed ? '\nConnection test FAILED.' : '\nConnection test passed.')
process.exit(failed ? 1 : 0)
