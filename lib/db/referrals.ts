import { createServerClient } from './server'
import type { Database } from './types'

export type ReferralStatus = Database['public']['Enums']['referral_status']

export interface ReferralEntry {
  id: string
  cardId: string | null
  cardName: string | null
  referredName: string
  expectedBonus: number
  status: ReferralStatus
  referredDate: string
  creditedDate: string | null
  notes: string | null
}

export async function listReferrals(userId: string): Promise<ReferralEntry[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('user_referrals')
    .select(`
      id, card_id, referred_name, expected_bonus, status, referred_date, credited_date, notes,
      cards(name)
    `)
    .eq('user_id', userId)
    .order('referred_date', { ascending: false })
  if (error) throw error
  return (data ?? []).map((row) => {
    const card = row.cards as unknown as { name: string } | null
    return {
      id: row.id,
      cardId: row.card_id,
      cardName: card?.name ?? null,
      referredName: row.referred_name,
      expectedBonus: row.expected_bonus ?? 0,
      status: row.status,
      referredDate: row.referred_date,
      creditedDate: row.credited_date,
      notes: row.notes,
    }
  })
}

export async function createReferral(input: {
  userId: string
  cardSlug: string | null
  referredName: string
  expectedBonus: number
  referredDate: string
  notes?: string
}): Promise<{ id: string }> {
  const supabase = await createServerClient()
  let cardId: string | null = null
  if (input.cardSlug) {
    const { data: card } = await supabase
      .from('cards')
      .select('id')
      .eq('slug', input.cardSlug)
      .maybeSingle()
    cardId = card?.id ?? null
  }
  const { data, error } = await supabase
    .from('user_referrals')
    .insert({
      user_id: input.userId,
      card_id: cardId,
      referred_name: input.referredName,
      expected_bonus: input.expectedBonus,
      referred_date: input.referredDate,
      notes: input.notes ?? null,
    })
    .select('id')
    .single()
  if (error) throw error
  return { id: data.id }
}

export async function markReferralCredited(userId: string, referralId: string): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('user_referrals')
    .update({
      status: 'credited',
      credited_date: new Date().toISOString().slice(0, 10),
    })
    .eq('id', referralId)
    .eq('user_id', userId)
  if (error) throw error
}

export async function deleteReferral(userId: string, referralId: string): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('user_referrals')
    .delete()
    .eq('id', referralId)
    .eq('user_id', userId)
  if (error) throw error
}
