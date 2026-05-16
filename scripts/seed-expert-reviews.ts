/**
 * Seed editorial expert reviews from lib/data/expert-reviews-seed.ts
 *
 * Fails loudly if any cardSlug does not resolve to a real card.
 *
 * Run: npx tsx scripts/seed-expert-reviews.ts
 */

import 'dotenv/config'
import { config as loadEnv } from 'dotenv'
import { resolve } from 'node:path'

loadEnv({ path: resolve(process.cwd(), '.env.local') })

import { createAdminClient } from '../lib/db/admin'

interface SeedReview {
  cardSlug: string
  reviewerName: string
  reviewerTitle?: string
  useCase?: string
  rating?: number
  shortSummary?: string
  pros?: string[]
  cons?: string[]
  body: string
  publishedAt?: string
}

async function loadSeed(): Promise<SeedReview[]> {
  try {
    const mod = await import('../lib/data/expert-reviews-seed')
    const arr = (mod as { expertReviewsSeed?: SeedReview[]; expertReviews?: SeedReview[] }).expertReviewsSeed
      ?? (mod as { expertReviewsSeed?: SeedReview[]; expertReviews?: SeedReview[] }).expertReviews
      ?? []
    return arr
  } catch (err) {
    console.error('No seed file at lib/data/expert-reviews-seed.ts')
    console.error(err)
    return []
  }
}

async function main() {
  const reviews = await loadSeed()
  if (reviews.length === 0) {
    console.log('Nothing to seed.')
    process.exit(0)
  }

  const supabase = createAdminClient()

  const slugs = [...new Set(reviews.map((r) => r.cardSlug))]
  const { data: cards, error: lookupErr } = await supabase
    .from('cards')
    .select('id, slug')
    .in('slug', slugs)
  if (lookupErr) {
    console.error('Card lookup failed:', lookupErr)
    process.exit(1)
  }

  const slugToId = new Map<string, string>((cards ?? []).map((c) => [c.slug, c.id]))

  const missing = slugs.filter((s) => !slugToId.has(s))
  if (missing.length > 0) {
    console.error(`FATAL: card slugs not found in DB: ${missing.join(', ')}`)
    console.error('Aborting to avoid orphan reviews.')
    process.exit(1)
  }

  const rows = reviews.map((r) => ({
    card_id: slugToId.get(r.cardSlug)!,
    reviewer_name: r.reviewerName,
    reviewer_title: r.reviewerTitle ?? null,
    body: r.body,
    rating: r.rating ?? null,
    pros: r.pros ?? [],
    cons: r.cons ?? [],
    use_case: r.useCase ?? null,
    short_summary: r.shortSummary ?? null,
    published_at: r.publishedAt ?? new Date().toISOString(),
  }))

  console.log(`Seeding ${rows.length} expert reviews...`)
  const { error } = await supabase
    .from('expert_reviews')
    .upsert(rows as never, { onConflict: 'card_id,reviewer_name' })
  if (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
