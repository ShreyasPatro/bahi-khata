/**
 * Database types for the Supabase client.
 *
 * TEMPORARY: no tables exist yet, so the schema below is intentionally empty.
 * After the first migration is applied, generate real types and replace this file's
 * `Database` with a re-export:
 *
 *   npm run db:types        # writes src/lib/supabase/database.types.ts
 *
 *   export type { Database, Json } from './database.types'
 *
 * Migrations in supabase/migrations are the source of truth for the schema.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

type PublicSchema = Database['public']

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T] extends {
  Row: infer R
}
  ? R
  : never
