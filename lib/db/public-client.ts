import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * Anon client without cookie integration. Safe to call from
 * generateStaticParams, ISR, and any build-time path. Only use for
 * public-read queries (cards, offers) — RLS still applies.
 */
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
