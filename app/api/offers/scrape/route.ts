import { NextResponse } from 'next/server'
import { runAllEnabledSources, runSourceBySlug } from '@/lib/scraping/orchestrator'

/**
 * POST /api/offers/scrape
 * Body: { sourceSlug?: string, secret: string }
 * Manual trigger guarded by SCRAPE_TRIGGER_SECRET.
 * Without the secret env var set, route returns 503 (disabled).
 */
export async function POST(request: Request) {
  const secret = process.env.SCRAPE_TRIGGER_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'manual trigger disabled' }, { status: 503 })
  }
  let body: { sourceSlug?: string; secret?: string } = {}
  try {
    body = await request.json()
  } catch {
    body = {}
  }
  if (body.secret !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (body.sourceSlug) {
    const r = await runSourceBySlug(body.sourceSlug, 'manual')
    return NextResponse.json({ results: [r] })
  }
  const results = await runAllEnabledSources('manual')
  return NextResponse.json({ results })
}
