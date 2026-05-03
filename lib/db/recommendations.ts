import { createPublicClient } from './public-client'
import { rowToCard, CARD_SELECT, type CardRow } from './_card-row'
import type { CreditCard } from '@/lib/data/cards'

/**
 * Content-based recommendations via pgvector.
 *
 * Each card has a 384-dim sentence embedding (all-MiniLM-L6-v2 over a
 * structured feature string). The Postgres function
 * `get_similar_card_slugs(target_slug, k)` ranks cards by cosine
 * similarity using the HNSW index on cards.embedding.
 *
 * If embeddings are absent (e.g. fresh DB before scripts/embed-cards
 * runs), this falls back to category-overlap so the UI never breaks.
 */
export async function getSimilarCards(slug: string, limit = 3): Promise<CreditCard[]> {
  const supabase = createPublicClient()

  const { data: rpcRows, error: rpcErr } = await (supabase as unknown as {
    rpc: (
      fn: string,
      args: Record<string, unknown>,
    ) => Promise<{ data: { slug: string; similarity: number }[] | null; error: { message: string } | null }>
  }).rpc('get_similar_card_slugs', { target_slug: slug, k: limit })

  if (rpcErr) {
    console.warn('[recommendations] RPC failed:', rpcErr.message)
  }

  const slugs = (rpcRows ?? []).map((r: { slug: string }) => r.slug)

  if (slugs.length > 0) {
    const { data, error } = await supabase
      .from('cards')
      .select(CARD_SELECT)
      .in('slug', slugs)
      .eq('is_active', true)
    if (error) throw error

    const bySlug = new Map<string, CreditCard>()
    for (const row of data ?? []) {
      const card = rowToCard(row as unknown as CardRow)
      bySlug.set(card.id, card)
    }
    // Preserve similarity order from RPC.
    return slugs
      .map((s: string) => bySlug.get(s))
      .filter((c: CreditCard | undefined): c is CreditCard => Boolean(c))
  }

  // Fallback: category-overlap (works pre-embedding-seed).
  const { data: target } = await supabase
    .from('cards')
    .select('categories')
    .eq('slug', slug)
    .maybeSingle()

  if (!target) return []

  const { data: pool, error: poolErr } = await supabase
    .from('cards')
    .select(CARD_SELECT)
    .eq('is_active', true)
    .neq('slug', slug)
    .overlaps('categories', target.categories ?? [])
    .order('rating', { ascending: false, nullsFirst: false })
    .limit(limit)

  if (poolErr) throw poolErr
  return (pool ?? []).map((r) => rowToCard(r as unknown as CardRow))
}
