import { NextResponse } from 'next/server'
import { listOffers } from '@/lib/db/offers'
import type { OfferCategory } from '@/lib/types/offers'
import { withPublicRateLimit } from '@/lib/cache/public-rate-limit'

export const revalidate = 300

function safeInt(v: string | null, fallback: number, min: number, max: number): number {
  if (v == null) return fallback
  const n = Number(v)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, Math.trunc(n)))
}

function safeFloat(v: string | null): number | undefined {
  if (v == null) return undefined
  const n = Number(v)
  if (!Number.isFinite(n)) return undefined
  return Math.min(1, Math.max(0, n))
}

const VALID_CATEGORIES = new Set<OfferCategory>([
  'food_delivery',
  'dining',
  'grocery',
  'ecommerce_general',
  'fashion',
  'electronics',
  'travel_flight',
  'travel_hotel',
  'travel_cab',
  'fuel',
  'utility',
  'entertainment',
  'health_wellness',
  'education',
  'insurance',
  'lifestyle',
  'other',
])

export async function GET(request: Request) {
  const rl = await withPublicRateLimit(request, 'offers', 60, '1 m')
  if (rl) return rl

  const url = new URL(request.url)
  const categoryParam = url.searchParams.get('category')
  const merchantSlug = url.searchParams.get('merchant_slug') ?? undefined
  const cardId = url.searchParams.get('card_id') ?? undefined

  const category =
    categoryParam && VALID_CATEGORIES.has(categoryParam as OfferCategory)
      ? (categoryParam as OfferCategory)
      : undefined

  try {
    const { offers, total } = await listOffers({
      category,
      merchantSlug,
      cardId,
      minConfidence: safeFloat(url.searchParams.get('min_confidence')),
      limit: safeInt(url.searchParams.get('limit'), 60, 1, 200),
      offset: safeInt(url.searchParams.get('offset'), 0, 0, 10_000),
    })
    return NextResponse.json(
      { offers, total },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900',
        },
      }
    )
  } catch (err) {
    console.error('[api/offers] failed', err)
    return NextResponse.json({ error: 'Failed to load offers' }, { status: 500 })
  }
}
