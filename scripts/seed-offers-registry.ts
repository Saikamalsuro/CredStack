import 'dotenv/config'
import { createAdminClient } from '@/lib/db/admin'
import { MERCHANTS_SEED } from '@/lib/scraping/merchants-seed'
import { SOURCES } from '@/lib/scraping/sources'

async function seedMerchants() {
  const supabase = createAdminClient()
  const rows = MERCHANTS_SEED.map((m) => ({
    slug: m.slug,
    name: m.name,
    category: m.category,
    primary_domain: m.primaryDomain,
    aliases: m.aliases ?? [],
    popular: m.popular ?? false,
  }))
  const { error } = await supabase.from('merchants').upsert(rows, { onConflict: 'slug' })
  if (error) {
    console.error('[seed merchants] failed:', error)
    process.exit(1)
  }
  console.log(`[seed merchants] upserted ${rows.length}`)
}

async function seedSources() {
  const supabase = createAdminClient()
  const rows = SOURCES.map((s) => ({
    slug: s.slug,
    name: s.name,
    url: s.url,
    source_type: s.sourceType,
    parser_module: s.parserModule,
    cron_schedule: s.cronSchedule,
    cache_ttl_seconds: s.cacheTtlSeconds,
    firecrawl_options: (s.firecrawlOptions ?? {}) as never,
    enabled: true,
  }))
  const { error } = await supabase.from('scrape_sources').upsert(rows, { onConflict: 'slug' })
  if (error) {
    console.error('[seed sources] failed:', error)
    process.exit(1)
  }
  console.log(`[seed sources] upserted ${rows.length}`)
}

async function main() {
  await seedMerchants()
  await seedSources()
  console.log('done')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
