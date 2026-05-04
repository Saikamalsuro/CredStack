/**
 * Sync `cards.apply_url` in Supabase from `lib/data/card-apply-urls.ts`.
 *
 * Run: npx tsx scripts/seed-apply-urls.ts
 */

import 'dotenv/config'
import { config as loadEnv } from 'dotenv'
import { resolve } from 'node:path'

loadEnv({ path: resolve(process.cwd(), '.env.local') })

import { cardApplyUrls } from '../lib/data/card-apply-urls'
import { createAdminClient } from '../lib/db/admin'

async function main() {
  const supabase = createAdminClient()

  const { data: dbCards, error } = await supabase
    .from('cards')
    .select('slug')

  if (error) {
    console.error('Failed to read cards:', error)
    process.exit(1)
  }

  const dbSlugs = new Set((dbCards ?? []).map((c) => c.slug))
  const updates: Array<{ slug: string; apply_url: string }> = []
  const missing: string[] = []

  for (const [slug, url] of Object.entries(cardApplyUrls)) {
    if (dbSlugs.has(slug)) {
      updates.push({ slug, apply_url: url })
    } else {
      missing.push(slug)
    }
  }

  console.log(`Updating apply_url for ${updates.length} cards...`)
  let done = 0
  for (const { slug, apply_url } of updates) {
    const { error: updErr } = await supabase
      .from('cards')
      .update({ apply_url } as never)
      .eq('slug', slug)
    if (updErr) {
      console.error(`  ${slug} -> ${updErr.message}`)
    } else {
      done += 1
    }
  }
  console.log(`  Done: ${done}/${updates.length}`)

  if (missing.length) {
    console.warn(
      `\n${missing.length} URL(s) in map have no matching DB slug:`,
      missing
    )
  }

  // Cards with no URL mapping
  const mapSlugs = new Set(Object.keys(cardApplyUrls))
  const dbWithoutUrl = [...dbSlugs].filter((s) => !mapSlugs.has(s))
  if (dbWithoutUrl.length) {
    console.warn(
      `\n${dbWithoutUrl.length} active card(s) have no apply_url mapping:`,
      dbWithoutUrl
    )
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
