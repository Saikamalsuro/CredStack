import { NextResponse } from 'next/server'
import { listOffers } from '@/lib/db/offers'
import type { OfferCategory } from '@/lib/types/offers'

export const revalidate = 300

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
  const url = new URL(request.url)
  const categoryParam = url.searchParams.get('category')
  const merchantSlug = url.searchParams.get('merchant_slug') ?? undefined
  const cardId = url.searchParams.get('card_id') ?? undefined
  const minConfidenceParam = url.searchParams.get('min_confidence')
  const limitParam = url.searchParams.get('limit')
  const offsetParam = url.searchParams.get('offset')

  const category =
    categoryParam && VALID_CATEGORIES.has(categoryParam as OfferCategory)
      ? (categoryParam as OfferCategory)
      : undefined

  try {
    const { offers, total } = await listOffers({
      category,
      merchantSlug,
      cardId,
      minConfidence: minConfidenceParam ? Number(minConfidenceParam) : undefined,
      limit: limitParam ? Number(limitParam) : 60,
      offset: offsetParam ? Number(offsetParam) : 0,
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
