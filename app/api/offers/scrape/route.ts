import { NextResponse } from 'next/server'
import { runAllEnabledSources, runSourceBySlug } from '@/lib/scraping/orchestrator'
import { rateLimit } from '@/lib/cache/ratelimit'

/**
 * POST /api/offers/scrape
 * Body: { sourceSlug?: string, secret: string }
 * Manual trigger guarded by SCRAPE_TRIGGER_SECRET.
 * Without the secret env var set, route returns 503 (disabled).
 * Failed-auth attempts are rate-limited by IP and logged.
 */
function ipFromRequest(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'anon'
  )
}

export async function POST(request: Request) {
  const ip = ipFromRequest(request)
  // Independent of payload validity — caps brute-force attempts.
  const probe = await rateLimit('scrape-probe', ip, 10, '1 m')
  if (!probe.success) {
    console.warn('[offers/scrape] rate-limited probe from', ip)
    return NextResponse.json({ error: 'too many requests' }, { status: 429 })
  }
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
    console.warn('[offers/scrape] failed-auth attempt from', ip)
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (body.sourceSlug) {
    const r = await runSourceBySlug(body.sourceSlug, 'manual')
    return NextResponse.json({ results: [r] })
  }
  const results = await runAllEnabledSources('manual')
  return NextResponse.json({ results })
}
