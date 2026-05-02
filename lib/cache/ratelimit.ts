import { Ratelimit } from '@upstash/ratelimit'
import { getRedis } from './redis'

type RateLimitResult = { success: boolean; remaining: number; reset: number }

const limiters = new Map<string, Ratelimit>()

function buildLimiter(key: string, limit: number, window: `${number} ${'s' | 'm' | 'h' | 'd'}`): Ratelimit | null {
  const cached = limiters.get(key)
  if (cached) return cached
  const redis = getRedis()
  if (!redis) return null
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    analytics: false,
    prefix: `rl:${key}`,
  })
  limiters.set(key, limiter)
  return limiter
}

export async function rateLimit(
  key: string,
  identifier: string,
  limit: number,
  window: `${number} ${'s' | 'm' | 'h' | 'd'}`
): Promise<RateLimitResult> {
  const limiter = buildLimiter(key, limit, window)
  if (!limiter) {
    // No Redis configured — allow through.
    return { success: true, remaining: limit, reset: Date.now() }
  }
  const { success, remaining, reset } = await limiter.limit(identifier)
  return { success, remaining, reset }
}
