import { createServerClient } from './server'
import type { CreditCard } from '@/lib/data/cards'
import { rowToCard, type CardRow } from './_card-row'

export interface UserCardRow {
  id: string
  cardSlug: string
  card: CreditCard
  cardLastFour: string | null
  nickname: string | null
  statementDay: number | null
  dueDay: number | null
  creditLimit: number | null
  isPrimary: boolean
  addedAt: string
}

export async function getUserCards(userId: string): Promise<UserCardRow[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('user_cards')
    .select(`
      id, card_last_four, nickname, statement_day, due_day,
      credit_limit, is_primary, added_at,
      cards!inner(*, card_benefits(title, display_order))
    `)
    .eq('user_id', userId)
    .is('removed_at', null)
    .order('is_primary', { ascending: false })
    .order('added_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((row) => {
    const cardRow = row.cards as unknown as CardRow
    const card = rowToCard(cardRow)
    return {
      id: row.id,
      cardSlug: card.id,
      card,
      cardLastFour: row.card_last_four,
      nickname: row.nickname,
      statementDay: row.statement_day,
      dueDay: row.due_day,
      creditLimit: row.credit_limit,
      isPrimary: row.is_primary ?? false,
      addedAt: row.added_at,
    }
  })
}

export async function addUserCard(input: {
  userId: string
  cardSlug: string
  cardLastFour: string
  statementDay: number
  dueDay: number
  creditLimit: number
  nickname?: string
}): Promise<{ id: string }> {
  const supabase = await createServerClient()

  const { data: cardRow, error: lookupErr } = await supabase
    .from('cards')
    .select('id')
    .eq('slug', input.cardSlug)
    .maybeSingle()
  if (lookupErr) throw lookupErr
  if (!cardRow) throw new Error(`card not found: ${input.cardSlug}`)

  const { data, error } = await supabase
    .from('user_cards')
    .insert({
      user_id: input.userId,
      card_id: cardRow.id,
      card_last_four: input.cardLastFour,
      statement_day: input.statementDay,
      due_day: input.dueDay,
      credit_limit: input.creditLimit,
      nickname: input.nickname ?? null,
    })
    .select('id')
    .single()

  if (error) throw error
  return { id: data.id }
}

export async function softDeleteUserCard(userId: string, userCardId: string): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('user_cards')
    .update({ removed_at: new Date().toISOString() })
    .eq('id', userCardId)
    .eq('user_id', userId)
  if (error) throw error
}
