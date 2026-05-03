import Firecrawl from '@mendable/firecrawl-js'
import { createHash } from 'node:crypto'
import { getRedis } from '@/lib/cache/redis'
import type { ScrapeOptions, ScrapeResult } from '@/lib/types/offers'

let cached: Firecrawl | null | undefined

function getClient(): Firecrawl | null {
  if (cached !== undefined) return cached
  const apiKey = process.env.FIRECRAWL_API_KEY
  const apiUrl = process.env.FIRECRAWL_BASE_URL
  if (!apiKey && !apiUrl) {
    cached = null
    return null
  }
  cached = new Firecrawl({ apiKey: apiKey ?? 'self-hosted', apiUrl })
  return cached
}

function hashUrl(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 24)
}

export interface CachedScrapeArgs {
  url: string
  cacheTtlSeconds: number
  firecrawlOptions?: ScrapeOptions
}

export interface CachedScrapeResult {
  result: ScrapeResult | null
  cacheHit: boolean
  creditsUsed: number
  durationMs: number
  error?: string
  rawSizeBytes?: number
}

/**
 * Single canonical entry point. Cache-first; only burns Firecrawl credits on miss.
 * Returns a structured result so callers can persist scrape_run telemetry.
 */
export async function cachedFirecrawl(args: CachedScrapeArgs): Promise<CachedScrapeResult> {
  const start = Date.now()
  const cacheKey = `fc:${hashUrl(args.url)}`
  const redis = getRedis()

  if (redis) {
    try {
      const hit = await redis.get<ScrapeResult>(cacheKey)
      if (hit && hit.markdown) {
        return {
          result: hit,
          cacheHit: true,
          creditsUsed: 0,
          durationMs: Date.now() - start,
          rawSizeBytes: hit.markdown.length,
        }
      }
    } catch {
      // ignore cache read errors, fall through to fresh scrape
    }
  }

  const client = getClient()
  if (!client) {
    return {
      result: null,
      cacheHit: false,
      creditsUsed: 0,
      durationMs: Date.now() - start,
      error: 'firecrawl not configured',
    }
  }

  try {
    const opts = {
      formats: args.firecrawlOptions?.formats ?? ['markdown'],
      onlyMainContent: args.firecrawlOptions?.onlyMainContent ?? true,
      waitFor: args.firecrawlOptions?.waitFor ?? 1000,
      includeTags: args.firecrawlOptions?.includeTags,
      excludeTags: args.firecrawlOptions?.excludeTags,
    }
    const res = await client.scrape(args.url, opts as never)
    const markdown = res?.markdown ?? ''
    const result: ScrapeResult = {
      url: args.url,
      markdown,
      metadata: (res?.metadata as Record<string, unknown>) ?? {},
      scrapedAt: new Date().toISOString(),
    }

    if (redis && markdown) {
      try {
        await redis.set(cacheKey, result, { ex: args.cacheTtlSeconds })
      } catch {
        // ignore cache write errors
      }
    }

    return {
      result,
      cacheHit: false,
      creditsUsed: 1,
      durationMs: Date.now() - start,
      rawSizeBytes: markdown.length,
    }
  } catch (err) {
    return {
      result: null,
      cacheHit: false,
      creditsUsed: 0,
      durationMs: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}
