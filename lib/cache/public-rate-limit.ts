import { NextResponse } from 'next/server'
import { rateLimit } from './ratelimit'

/**
 * Wraps a public (unauthenticated) GET handler with per-IP rate-limiting via
 * Upstash. If Redis isn't configured the limiter is a no-op so dev still works.
 */
export async function withPublicRateLimit(
  request: Request,
  key: string,
  limit: number,
  window: `${number} ${'s' | 'm' | 'h' | 'd'}`
): Promise<NextResponse | null> {
  const ip = ipFromRequest(request)
  const { success, remaining, reset } = await rateLimit(key, ip, limit, window)
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(Math.max(0, remaining)),
          'X-RateLimit-Reset': String(reset),
          'Retry-After': String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))),
        },
      }
    )
  }
  return null
}

function ipFromRequest(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0]!.trim()
  const real = request.headers.get('x-real-ip')
  if (real) return real
  return 'anon'
}
