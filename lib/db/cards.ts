import { createPublicClient } from './public-client'
import { rowToCard, CARD_SELECT, type CardRow } from './_card-row'
import type { CreditCard, CardCategory, CardNetwork } from '@/lib/data/cards'
import {
  sortCards as sortCardsImpl,
  filterCards as filterCardsImpl,
} from '@/lib/data/cards'

export type { CreditCard, CardCategory, CardNetwork }

export async function getCards(): Promise<CreditCard[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('cards')
    .select(CARD_SELECT)
    .eq('is_active', true)
    .order('rating', { ascending: false, nullsFirst: false })

  if (error) throw error
  return (data ?? []).map((r) => rowToCard(r as unknown as CardRow))
}

export async function getCardById(slug: string): Promise<CreditCard | undefined> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('cards')
    .select(CARD_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error
  return data ? rowToCard(data as unknown as CardRow) : undefined
}

export async function getCardsByCategory(category: CardCategory): Promise<CreditCard[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('cards')
    .select(CARD_SELECT)
    .eq('is_active', true)
    .contains('categories', [category])
    .order('rating', { ascending: false, nullsFirst: false })

  if (error) throw error
  return (data ?? []).map((r) => rowToCard(r as unknown as CardRow))
}

export async function getFeaturedCards(): Promise<CreditCard[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('cards')
    .select(CARD_SELECT)
    .eq('is_active', true)
    .eq('featured', true)
    .order('rating', { ascending: false, nullsFirst: false })

  if (error) throw error
  return (data ?? []).map((r) => rowToCard(r as unknown as CardRow))
}

export async function getPopularCards(): Promise<CreditCard[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('cards')
    .select(CARD_SELECT)
    .eq('is_active', true)
    .eq('popular', true)
    .order('rating', { ascending: false, nullsFirst: false })

  if (error) throw error
  return (data ?? []).map((r) => rowToCard(r as unknown as CardRow))
}

export async function searchCards(query: string): Promise<CreditCard[]> {
  const supabase = createPublicClient()
  const q = query.trim()
  if (!q) return getCards()

  const escaped = q.replace(/[%,_]/g, '\\$&')
  const { data, error } = await supabase
    .from('cards')
    .select(CARD_SELECT)
    .eq('is_active', true)
    .or(`name.ilike.%${escaped}%,issuer.ilike.%${escaped}%`)
    .order('rating', { ascending: false, nullsFirst: false })

  if (error) throw error
  return (data ?? []).map((r) => rowToCard(r as unknown as CardRow))
}

export const sortCards = sortCardsImpl
export const filterCards = filterCardsImpl
