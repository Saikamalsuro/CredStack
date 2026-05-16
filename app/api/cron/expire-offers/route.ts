import { NextResponse } from 'next/server'
import { inngest } from '@/lib/jobs/client'

/**
 * Daily cron — fires at 2 AM IST via Vercel Cron (see vercel.json).
 * Dispatches the `offers.expire.requested` event so the Inngest
 * `expire-old-offers` function does the actual DB work. Keeps cron
 * endpoints thin and lets Inngest handle retries/observability.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 })
    }
  } else if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await inngest.send({ name: 'offers.expire.requested', data: {} })
  } catch (err) {
    console.warn('[cron/expire-offers] Inngest dispatch failed', err)
    return NextResponse.json({ error: 'dispatch failed' }, { status: 502 })
  }
  return NextResponse.json({ ok: true, dispatchedAt: new Date().toISOString() })
}
