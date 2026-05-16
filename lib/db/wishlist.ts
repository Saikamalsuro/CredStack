import { createServerClient } from './server'

export interface WishlistEntry {
  id: string
  cardId: string
  cardSlug: string
  cardName: string
  cardIssuer: string
  cardColor: string
  annualFee: number
  notes: string | null
  createdAt: string
}

export async function getWishlist(userId: string): Promise<WishlistEntry[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('user_wishlists')
    .select(`
      id, notes, created_at, card_id,
      cards!inner(slug, name, issuer, card_color_gradient, annual_fee)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((row) => {
    const card = row.cards as unknown as {
      slug: string
      name: string
      issuer: string
      card_color_gradient: string
      annual_fee: number
    }
    return {
      id: row.id,
      cardId: row.card_id,
      cardSlug: card.slug,
      cardName: card.name,
      cardIssuer: card.issuer,
      cardColor: card.card_color_gradient,
      annualFee: card.annual_fee,
      notes: row.notes,
      createdAt: row.created_at,
    }
  })
}

export async function isCardWishlisted(userId: string, cardSlug: string): Promise<boolean> {
  const supabase = await createServerClient()
  const { data: card } = await supabase
    .from('cards')
    .select('id')
    .eq('slug', cardSlug)
    .maybeSingle()
  if (!card) return false
  const { data, error } = await supabase
    .from('user_wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('card_id', card.id)
    .maybeSingle()
  if (error) throw error
  return Boolean(data)
}

export async function addToWishlist(userId: string, cardSlug: string, notes?: string): Promise<void> {
  const supabase = await createServerClient()
  const { data: card, error: lookupErr } = await supabase
    .from('cards')
    .select('id')
    .eq('slug', cardSlug)
    .maybeSingle()
  if (lookupErr) throw lookupErr
  if (!card) throw new Error(`card not found: ${cardSlug}`)
  const { error } = await supabase
    .from('user_wishlists')
    .upsert({ user_id: userId, card_id: card.id, notes: notes ?? null }, { onConflict: 'user_id,card_id' })
  if (error) throw error
}

export async function removeFromWishlist(userId: string, cardSlug: string): Promise<void> {
  const supabase = await createServerClient()
  const { data: card } = await supabase
    .from('cards')
    .select('id')
    .eq('slug', cardSlug)
    .maybeSingle()
  if (!card) return
  const { error } = await supabase
    .from('user_wishlists')
    .delete()
    .eq('user_id', userId)
    .eq('card_id', card.id)
  if (error) throw error
}
