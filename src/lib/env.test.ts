import { describe, expect, it } from 'vitest'
import { isServiceRoleKey, validateEnv } from './env'

const jwt = (role: string) => `h.${btoa(JSON.stringify({ role }))}.s`
const valid = {
  VITE_SUPABASE_URL: 'https://abcd.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'sb_publishable_example',
}

describe('validateEnv', () => {
  it('accepts a publishable key and https URL', () => {
    const result = validateEnv(valid)
    expect(result.issues).toEqual([])
    expect(result.env?.VITE_SUPABASE_URL).toBe(valid.VITE_SUPABASE_URL)
  })

  it('accepts a legacy anon JWT and a localhost http URL', () => {
    const result = validateEnv({
      VITE_SUPABASE_URL: 'http://127.0.0.1:54321',
      VITE_SUPABASE_ANON_KEY: jwt('anon'),
    })
    expect(result.issues).toEqual([])
  })

  it('reports missing values by variable name', () => {
    const { env, issues } = validateEnv({})
    expect(env).toBeNull()
    expect(issues.join(' ')).toContain('VITE_SUPABASE_URL is missing')
    expect(issues.join(' ')).toContain('VITE_SUPABASE_ANON_KEY is missing')
  })

  it('rejects malformed and insecure URLs', () => {
    expect(validateEnv({ ...valid, VITE_SUPABASE_URL: 'not a url' }).issues[0]).toMatch(/valid URL/)
    expect(
      validateEnv({ ...valid, VITE_SUPABASE_URL: 'http://abcd.supabase.co' }).issues[0],
    ).toMatch(/https/)
  })

  it('rejects service-role keys in either format and never echoes the value', () => {
    for (const key of [jwt('service_role'), 'sb_secret_abc123']) {
      const { env, issues } = validateEnv({ ...valid, VITE_SUPABASE_ANON_KEY: key })
      expect(env).toBeNull()
      expect(issues.join(' ')).toMatch(/service-role/)
      expect(issues.join(' ')).not.toContain(key)
    }
  })

  it('rejects any VITE_ variable named like a service-role key', () => {
    const { env, issues } = validateEnv({ ...valid, VITE_SUPABASE_SERVICE_ROLE_KEY: 'x' })
    expect(env).toBeNull()
    expect(issues[0]).toContain('VITE_SUPABASE_SERVICE_ROLE_KEY')
  })
})

describe('isServiceRoleKey', () => {
  it('ignores malformed tokens', () => {
    expect(isServiceRoleKey('nodots')).toBe(false)
    expect(isServiceRoleKey('a.!!!.c')).toBe(false)
  })
})
