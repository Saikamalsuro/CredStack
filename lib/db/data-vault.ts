import { createAdminClient } from './admin'

export interface UserDataExport {
  exportedAt: string
  user: {
    id: string
    email: string | null
  }
  profile: Record<string, unknown> | null
  userCards: unknown[]
  transactions: unknown[]
  cardPayments: unknown[]
  loungeVisits: unknown[]
  applications: unknown[]
  wishlists: unknown[]
  referrals: unknown[]
  advisorSessions: unknown[]
  analyzerRuns: unknown[]
  reviews: unknown[]
}

export async function exportUserData(userId: string, email: string | null): Promise<UserDataExport> {
  const supabase = createAdminClient()

  const [
    profile,
    userCards,
    transactions,
    cardPayments,
    loungeVisits,
    applications,
    wishlists,
    referrals,
    advisorSessions,
    analyzerRuns,
    reviews,
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('user_cards').select('*').eq('user_id', userId),
    supabase.from('transactions').select('*').eq('user_id', userId),
    supabase.from('card_payments').select('*').eq('user_id', userId),
    supabase.from('user_lounge_visits').select('*').eq('user_id', userId),
    supabase.from('user_applications').select('*').eq('user_id', userId),
    supabase.from('user_wishlists').select('*').eq('user_id', userId),
    supabase.from('user_referrals').select('*').eq('user_id', userId),
    supabase.from('advisor_sessions').select('*').eq('user_id', userId),
    supabase.from('analyzer_runs').select('*').eq('user_id', userId),
    supabase.from('reviews').select('*').eq('user_id', userId),
  ])

  return {
    exportedAt: new Date().toISOString(),
    user: { id: userId, email },
    profile: profile.data ?? null,
    userCards: userCards.data ?? [],
    transactions: transactions.data ?? [],
    cardPayments: cardPayments.data ?? [],
    loungeVisits: loungeVisits.data ?? [],
    applications: applications.data ?? [],
    wishlists: wishlists.data ?? [],
    referrals: referrals.data ?? [],
    advisorSessions: advisorSessions.data ?? [],
    analyzerRuns: analyzerRuns.data ?? [],
    reviews: reviews.data ?? [],
  }
}

export async function deleteAllUserData(userId: string): Promise<void> {
  const supabase = createAdminClient()

  // Order: children → parents. profiles cascade-deletes everything else,
  // but be explicit to avoid leaving orphans if profile row is somehow detached.
  await supabase.from('user_referrals').delete().eq('user_id', userId)
  await supabase.from('user_applications').delete().eq('user_id', userId)
  await supabase.from('user_wishlists').delete().eq('user_id', userId)
  await supabase.from('user_lounge_visits').delete().eq('user_id', userId)
  await supabase.from('transactions').delete().eq('user_id', userId)
  await supabase.from('card_payments').delete().eq('user_id', userId)
  await supabase.from('user_cards').delete().eq('user_id', userId)
  await supabase.from('advisor_sessions').delete().eq('user_id', userId)
  await supabase.from('analyzer_runs').delete().eq('user_id', userId)
  await supabase.from('reviews').delete().eq('user_id', userId)
  await supabase.from('profiles').delete().eq('id', userId)

  // Auth user deletion requires service role and is final.
  await supabase.auth.admin.deleteUser(userId)
}
