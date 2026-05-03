import { NextResponse } from 'next/server'
import { getCategoryCounts } from '@/lib/db/offers'
import { OFFER_CATEGORY_LABELS, type OfferCategory } from '@/lib/types/offers'

export const revalidate = 1800

export async function GET() {
  try {
    const counts = await getCategoryCounts()
    const map = new Map(counts.map((c) => [c.category, c.count]))
    const categories = (Object.keys(OFFER_CATEGORY_LABELS) as OfferCategory[]).map((slug) => ({
      slug,
      label: OFFER_CATEGORY_LABELS[slug],
      count: map.get(slug) ?? 0,
    }))
    return NextResponse.json(
      { categories },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      }
    )
  } catch (err) {
    console.error('[api/offers/categories] failed', err)
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 })
  }
}
