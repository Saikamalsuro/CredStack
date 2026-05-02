import { Redis } from '@upstash/redis'

let cached: Redis | null | undefined

export function getRedis(): Redis | null {
  if (cached !== undefined) return cached
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    cached = null
    return null
  }
  cached = new Redis({ url, token })
  return cached
}

/**
 * Cache-or-compute. If Redis is unavailable, runs fn() directly.
 */
export async function cacheJson<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<T> {
  const redis = getRedis()
  if (!redis) return fn()

  try {
    const hit = await redis.get<T>(key)
    if (hit !== null && hit !== undefined) return hit
  } catch {
    // fall through to compute
  }

  const value = await fn()
  try {
    await redis.set(key, value, { ex: ttlSeconds })
  } catch {
    // ignore write failures
  }
  return value
}
