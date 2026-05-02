import { inngest } from './client'
import { createAdminClient } from '@/lib/db/admin'
import { scrapeMarkdown } from '@/lib/scraping/firecrawl'
import { SCRAPE_TARGETS, type ScrapeTarget } from '@/lib/scraping/targets'
import { offerHash } from '@/lib/scraping/deduplicate'
import { complete } from '@/lib/ai/groq'
import {
  buildOfferExtractPrompt,
  OfferExtractSchema,
  fallbackOfferExtract,
} from '@/lib/ai/prompts/offer-extract'

async function processTarget(target: ScrapeTarget) {
  const supabase = createAdminClient()

  const { data: scrapeRun, error: runErr } = await supabase
    .from('scrape_runs')
    .insert({ source_url: target.url, status: 'running' })
    .select('id')
    .single()
  if (runErr || !scrapeRun) return { merchant: target.merchant, error: runErr?.message ?? 'no run id' }

  const runId = scrapeRun.id
  const markdown = await scrapeMarkdown(target.url)

  if (!markdown) {
    await supabase
      .from('scrape_runs')
      .update({
        status: 'failed',
        error_message: 'firecrawl unavailable or scrape failed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', runId)
    return { merchant: target.merchant, scraped: false }
  }

  const { data } = await complete({
    ...buildOfferExtractPrompt(target.merchant, markdown),
    schema: OfferExtractSchema,
    model: 'fast',
    fallback: fallbackOfferExtract,
  })

  let added = 0
  let updated = 0
  for (const offer of data.offers) {
    const hash = offerHash(target.merchant, offer.title, offer.validUntil)
    const { data: upsertResult, error: upErr } = await supabase
      .from('offers')
      .upsert(
        {
          merchant: target.merchant,
          title: offer.title,
          description: offer.description,
          applicable_issuers: offer.applicableIssuers,
          discount_type: offer.discountType,
          discount_value: offer.discountValue,
          min_txn_amount: offer.minTxnAmount,
          max_discount: offer.maxDiscount,
          valid_from: offer.validFrom,
          valid_until: offer.validUntil,
          source_url: target.url,
          source_hash: hash,
          scraped_at: new Date().toISOString(),
          is_active: true,
        },
        { onConflict: 'source_hash' }
      )
      .select('id')
      .maybeSingle()
    if (!upErr && upsertResult) {
      updated += 1
    } else if (!upErr) {
      added += 1
    }
  }

  await supabase
    .from('scrape_runs')
    .update({
      status: 'success',
      offers_found: data.offers.length,
      offers_added: added,
      offers_updated: updated,
      completed_at: new Date().toISOString(),
    })
    .eq('id', runId)

  return { merchant: target.merchant, found: data.offers.length, added, updated }
}

export const scrapeOffers = inngest.createFunction(
  {
    id: 'scrape-offers',
    triggers: [{ cron: '0 */6 * * *' }, { event: 'offers.scrape.requested' }],
  },
  async () => {
    const results = []
    for (const target of SCRAPE_TARGETS) {
      results.push(await processTarget(target))
    }
    return { results }
  }
)
