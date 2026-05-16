import { createServerClient } from './server'

export interface LoungeVisit {
  id: string
  userCardId: string
  cardSlug: string
  cardName: string
  visitDate: string
  loungeName: string
  visitType: 'domestic' | 'international'
  guestCount: number
  notes: string | null
}

export interface LoungeUsage {
  userCardId: string
  cardSlug: string
  cardName: string
  cardColor: string
  domesticUsed: number
  domesticQuota: number | 'unlimited' | null
  intlUsed: number
  intlQuota: number | 'unlimited' | null
}

export async function getLoungeVisits(userId: string, limit = 50): Promise<LoungeVisit[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('user_lounge_visits')
    .select(`
      id, user_card_id, visit_date, lounge_name, visit_type, guest_count, notes,
      user_cards!inner(cards!inner(slug, name))
    `)
    .eq('user_id', userId)
    .order('visit_date', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []).map((row) => {
    const card = (row.user_cards as unknown as { cards: { slug: string; name: string } }).cards
    return {
      id: row.id,
      userCardId: row.user_card_id,
      cardSlug: card.slug,
      cardName: card.name,
      visitDate: row.visit_date,
      loungeName: row.lounge_name,
      visitType: row.visit_type as 'domestic' | 'international',
      guestCount: row.guest_count ?? 0,
      notes: row.notes,
    }
  })
}

export async function getLoungeUsageByCard(userId: string): Promise<LoungeUsage[]> {
  const supabase = await createServerClient()
  const yearStart = `${new Date().getFullYear()}-01-01`
  const yearEnd = `${new Date().getFullYear()}-12-31`

  const { data: userCards, error: uErr } = await supabase
    .from('user_cards')
    .select(`
      id,
      cards!inner(slug, name, card_color_gradient, domestic_lounges_per_year, intl_lounges_per_year)
    `)
    .eq('user_id', userId)
    .is('removed_at', null)
  if (uErr) throw uErr

  const { data: visits, error: vErr } = await supabase
    .from('user_lounge_visits')
    .select('user_card_id, visit_type')
    .eq('user_id', userId)
    .gte('visit_date', yearStart)
    .lte('visit_date', yearEnd)
  if (vErr) throw vErr

  const counts = new Map<string, { domestic: number; intl: number }>()
  for (const v of visits ?? []) {
    const c = counts.get(v.user_card_id) ?? { domestic: 0, intl: 0 }
    if (v.visit_type === 'domestic') c.domestic += 1
    else c.intl += 1
    counts.set(v.user_card_id, c)
  }

  return (userCards ?? []).map((row) => {
    const card = row.cards as unknown as {
      slug: string
      name: string
      card_color_gradient: string
      domestic_lounges_per_year: number | null
      intl_lounges_per_year: number | null
    }
    const c = counts.get(row.id) ?? { domestic: 0, intl: 0 }
    return {
      userCardId: row.id,
      cardSlug: card.slug,
      cardName: card.name,
      cardColor: card.card_color_gradient,
      domesticUsed: c.domestic,
      domesticQuota:
        card.domestic_lounges_per_year === -1
          ? 'unlimited'
          : card.domestic_lounges_per_year ?? null,
      intlUsed: c.intl,
      intlQuota:
        card.intl_lounges_per_year === -1
          ? 'unlimited'
          : card.intl_lounges_per_year ?? null,
    }
  })
}

export async function logLoungeVisit(input: {
  userId: string
  userCardId: string
  visitDate: string
  loungeName: string
  visitType: 'domestic' | 'international'
  guestCount?: number
  notes?: string
}): Promise<{ id: string }> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('user_lounge_visits')
    .insert({
      user_id: input.userId,
      user_card_id: input.userCardId,
      visit_date: input.visitDate,
      lounge_name: input.loungeName,
      visit_type: input.visitType,
      guest_count: input.guestCount ?? 0,
      notes: input.notes ?? null,
    })
    .select('id')
    .single()
  if (error) throw error
  return { id: data.id }
}

export async function deleteLoungeVisit(userId: string, visitId: string): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('user_lounge_visits')
    .delete()
    .eq('id', visitId)
    .eq('user_id', userId)
  if (error) throw error
}
