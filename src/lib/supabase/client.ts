import { createClient } from '@supabase/supabase-js'
import { getEnv } from '@/lib/env'
import type { Database } from './types'

const env = getEnv()

/**
 * The single browser Supabase client. It uses the publishable/anon key only; all
 * access is governed by Row Level Security. Never create a second client and never
 * use a service-role key here.
 */
export const supabase = createClient<Database>(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'bahi-auth',
  },
})
