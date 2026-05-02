import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/db/server'
import type { User } from '@supabase/supabase-js'

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function requireAuth(redirectTo = '/auth/sign-in'): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect(`${redirectTo}?redirect=${encodeURIComponent(redirectTo)}`)
  }
  return user
}
