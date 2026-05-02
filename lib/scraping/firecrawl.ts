import Firecrawl from '@mendable/firecrawl-js'

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

/**
 * Scrape a URL into Markdown. Returns null when Firecrawl is not configured
 * or the call fails — caller should handle the absence rather than throw.
 */
export async function scrapeMarkdown(url: string): Promise<string | null> {
  const client = getClient()
  if (!client) return null
  try {
    const result = await client.scrape(url, { formats: ['markdown'] })
    if (!result) return null
    return result.markdown ?? null
  } catch (err) {
    console.warn(`[firecrawl] scrape failed for ${url}`, err)
    return null
  }
}
