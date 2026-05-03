import { NextResponse } from 'next/server'
import { listOffers } from '@/lib/db/offers'

export const revalidate = 300

export async function GET(request: Request) {
  const url = new URL(request.url)
  const merchantSlug = url.searchParams.get('merchant_slug')
  if (!merchantSlug) {
    return NextResponse.json({ error: 'merchant_slug required' }, { status: 400 })
  }
  try {
    const { offers, total } = await listOffers({
      merchantSlug,
      limit: Number(url.searchParams.get('limit') ?? 50),
    })
    const sorted = [...offers].sort((a, b) => {
      const av = (a.valuePct ?? 0) * 1000 + (a.maxValue ?? 0)
      const bv = (b.valuePct ?? 0) * 1000 + (b.maxValue ?? 0)
      return bv - av
    })
    return NextResponse.json(
      { offers: sorted, total },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900',
        },
      }
    )
  } catch (err) {
    console.error('[api/offers/by-merchant] failed', err)
    return NextResponse.json({ error: 'Failed to load offers' }, { status: 500 })
  }
}
