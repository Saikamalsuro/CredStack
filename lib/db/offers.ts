import { createPublicClient } from './public-client'
import type {
  ConfidenceBand,
  Offer,
  OfferCategory,
  OfferType,
} from '@/lib/types/offers'

interface OfferRow {
  id: string
  title: string
  description: string | null
  offer_type: OfferType
  category: OfferCategory
  merchant_id: string | null
  merchant_name: string | null
  value_pct: number | null
  value_flat: number | null
  max_value: number | null
  min_txn: number | null
  starts_at: string | null
  ends_at: string | null
  scraped_at: string
  source_url: string
  confidence_score: number
  confidence_band: ConfidenceBand
  manually_verified: boolean
  eligible_issuers: string[] | null
  eligible_card_networks: string[] | null
  eligible_card_ids: string[] | null
  merchants?: { slug: string; name: string } | null
}

function rowToOffer(row: OfferRow): Offer {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    offerType: row.offer_type,
    category: row.category,
    merchantId: row.merchant_id,
    merchantName: row.merchant_name ?? row.merchants?.name ?? null,
    merchantSlug: row.merchants?.slug ?? null,
    valuePct: row.value_pct ? Number(row.value_pct) : null,
    valueFlat: row.value_flat,
    maxValue: row.max_value,
    minTxn: row.min_txn,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    scrapedAt: row.scraped_at,
    sourceUrl: row.source_url,
    confidenceScore: Number(row.confidence_score),
    confidenceBand: row.confidence_band,
    manuallyVerified: row.manually_verified,
    eligibleIssuers: row.eligible_issuers ?? [],
    eligibleCardNetworks: row.eligible_card_networks ?? [],
    eligibleCardIds: row.eligible_card_ids ?? [],
  }
}

const SELECT =
  'id,title,description,offer_type,category,merchant_id,merchant_name,value_pct,value_flat,max_value,min_txn,starts_at,ends_at,scraped_at,source_url,confidence_score,confidence_band,manually_verified,eligible_issuers,eligible_card_networks,eligible_card_ids,merchants(slug,name)'

export interface OfferQuery {
  category?: OfferCategory
  merchantSlug?: string
  cardId?: string
  minConfidence?: number
  limit?: number
  offset?: number
}

export async function listOffers(q: OfferQuery = {}): Promise<{ offers: Offer[]; total: number }> {
  const supabase = createPublicClient()
  const limit = Math.min(q.limit ?? 60, 200)
  const offset = q.offset ?? 0
  const minConf = q.minConfidence ?? 0.45

  let query = supabase
    .from('offers')
    .select(SELECT, { count: 'exact' })
    .eq('is_active', true)
    .gte('confidence_score', minConf)
    .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`)
    .order('confidence_score', { ascending: false })
    .order('scraped_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (q.category) query = query.eq('category', q.category)
  if (q.cardId) query = query.contains('eligible_card_ids', [q.cardId])

  if (q.merchantSlug) {
    const { data: m } = await supabase
      .from('merchants')
      .select('id')
      .eq('slug', q.merchantSlug)
      .maybeSingle()
    if (!m) return { offers: [], total: 0 }
    query = query.eq('merchant_id', (m as { id: string }).id)
  }

  const { data, error, count } = await query
  if (error) throw error
  const offers = ((data ?? []) as unknown as OfferRow[]).map(rowToOffer)
  return { offers, total: count ?? offers.length }
}

export async function getOffersByCardSlug(slug: string, limit = 10): Promise<Offer[]> {
  const supabase = createPublicClient()
  const { data: card } = await supabase
    .from('cards')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()
  if (!card) return []
  const { offers } = await listOffers({
    cardId: (card as { id: string }).id,
    limit,
    minConfidence: 0.45,
  })
  return offers
}

export async function getCategoryCounts(): Promise<Array<{ category: OfferCategory; count: number }>> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('offers')
    .select('category')
    .eq('is_active', true)
    .gte('confidence_score', 0.45)
    .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`)
  if (error) throw error
  const counts = new Map<OfferCategory, number>()
  for (const row of (data ?? []) as Array<{ category: OfferCategory }>) {
    counts.set(row.category, (counts.get(row.category) ?? 0) + 1)
  }
  return [...counts.entries()].map(([category, count]) => ({ category, count }))
}

export async function listMerchantsWithOfferCounts(): Promise<
  Array<{ slug: string; name: string; category: OfferCategory; count: number; popular: boolean }>
> {
  const supabase = createPublicClient()
  const { data: merchants } = await supabase
    .from('merchants')
    .select('id, slug, name, category, popular')
  if (!merchants) return []
  const { data: rows } = await supabase
    .from('offers')
    .select('merchant_id')
    .eq('is_active', true)
    .gte('confidence_score', 0.45)
  const counts = new Map<string, number>()
  for (const r of (rows ?? []) as Array<{ merchant_id: string | null }>) {
    if (!r.merchant_id) continue
    counts.set(r.merchant_id, (counts.get(r.merchant_id) ?? 0) + 1)
  }
  return (merchants as Array<{
    id: string
    slug: string
    name: string
    category: OfferCategory
    popular: boolean | null
  }>)
    .map((m) => ({
      slug: m.slug,
      name: m.name,
      category: m.category,
      popular: m.popular ?? false,
      count: counts.get(m.id) ?? 0,
    }))
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count)
}

// Keep legacy export name for any caller still relying on it
export const getActiveOffers = async (): Promise<Offer[]> => {
  const { offers } = await listOffers({ limit: 200 })
  return offers
}
