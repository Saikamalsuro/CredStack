/**
 * Seed expert reviews from lib/data/expert-reviews-seed.ts
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
  body: string
  rating?: number
  pros?: string[]
  cons?: string[]
  useCase?: string
}

async function loadSeed(): Promise<SeedReview[]> {
  try {
    // @ts-expect-error optional seed file; user provides
    const mod = await import('../lib/data/expert-reviews-seed')
    return (mod.expertReviews as SeedReview[]) ?? []
  } catch {
    console.error('No seed file at lib/data/expert-reviews-seed.ts')
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
  const { data: cards } = await supabase.from('cards').select('id, slug').in('slug', slugs)
  const slugToId = new Map<string, string>(
    (cards ?? []).map((c) => [c.slug, c.id])
  )

  const rows: { card_id: string; reviewer_name: string; body: string; reviewer_title?: string | null; rating?: number | null; pros?: string[]; cons?: string[]; use_case?: string | null }[] = []
  const missing: string[] = []
  for (const r of reviews) {
    const id = slugToId.get(r.cardSlug)
    if (!id) {
      missing.push(r.cardSlug)
      continue
    }
    rows.push({
      card_id: id,
      reviewer_name: r.reviewerName,
      reviewer_title: r.reviewerTitle ?? null,
      body: r.body,
      rating: r.rating ?? null,
      pros: r.pros ?? [],
      cons: r.cons ?? [],
      use_case: r.useCase ?? null,
    })
  }

  if (missing.length) console.warn(`Missing card slugs: ${missing.join(', ')}`)

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
