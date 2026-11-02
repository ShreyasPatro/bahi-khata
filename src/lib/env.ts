import { z } from 'zod'

// Only public, browser-safe values belong here. Never add service-role keys to VITE_* variables.
const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().default(''),
  VITE_SUPABASE_ANON_KEY: z.string().default(''),
})

export const env = envSchema.parse(import.meta.env)
