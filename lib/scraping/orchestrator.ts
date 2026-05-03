import { createAdminClient } from '@/lib/db/admin'
import { complete } from '@/lib/ai/groq'
import {
  buildOfferExtractPrompt,
  OfferExtractSchema,
  fallbackOfferExtract,
} from '@/lib/ai/prompts/offer-extract'
import { cachedFirecrawl } from './firecrawl'
import { matchMerchant } from './merchant-matcher'
import { matchOfferToCards, bandFromScore } from './card-matcher'
import { SOURCES } from './sources'
import type { ConfidenceBand, SourceDefinition } from '@/lib/types/offers'
import type { Json } from '@/lib/db/types'

interface SourceRow {
  id: string
  slug: string
  name: string
  url: string
  source_type: string
  cache_ttl_seconds: number
  firecrawl_options: Record<string, unknown>
  enabled: boolean
}

export interface RunOutcome {
  sourceSlug: string
  status: 'success' | 'cache_hit' | 'failed' | 'skipped'
  offersFound: number
  offersNew: number
  offersUpdated: number
  cacheHit: boolean
  creditsUsed: number
  error?: string
}

function findRegistryEntry(slug: string): SourceDefinition | undefined {
  return SOURCES.find((s) => s.slug === slug)
}

export async function runSource(
  sourceId: string,
  triggeredBy: 'cron' | 'manual' | 'on_demand'
): Promise<RunOutcome> {
  const supabase = createAdminClient()

  const { data: srcData, error: srcErr } = await supabase
    .from('scrape_sources')
    .select('id, slug, name, url, source_type, cache_ttl_seconds, firecrawl_options, enabled')
    .eq('id', sourceId)
    .single()

  if (srcErr || !srcData) {
    return {
      sourceSlug: sourceId,
      status: 'failed',
      offersFound: 0,
      offersNew: 0,
      offersUpdated: 0,
      cacheHit: false,
      creditsUsed: 0,
      error: srcErr?.message ?? 'source not found',
    }
  }
  const src = srcData as SourceRow

  if (!src.enabled) {
    return {
      sourceSlug: src.slug,
      status: 'skipped',
      offersFound: 0,
      offersNew: 0,
      offersUpdated: 0,
      cacheHit: false,
      creditsUsed: 0,
    }
  }

  const registry = findRegistryEntry(src.slug)
  const issuerHint = registry?.issuerHint

  const { data: runRow } = await supabase
    .from('scrape_runs')
    .insert({
      source_id: src.id,
      triggered_by: triggeredBy,
      status: 'running',
    })
    .select('id')
    .single()
  const runId = runRow?.id as string | undefined

  await supabase
    .from('scrape_sources')
    .update({ last_run_at: new Date().toISOString() })
    .eq('id', src.id)

  const fc = await cachedFirecrawl({
    url: src.url,
    cacheTtlSeconds: src.cache_ttl_seconds,
    firecrawlOptions: src.firecrawl_options as never,
  })

  if (!fc.result) {
    if (runId) {
      await supabase
        .from('scrape_runs')
        .update({
          status: 'failed',
          finished_at: new Date().toISOString(),
          cache_hit: false,
          firecrawl_credits: fc.creditsUsed,
          error: fc.error ?? 'no result',
          duration_ms: fc.durationMs,
        })
        .eq('id', runId)
    }
    await supabase
      .from('scrape_sources')
      .update({ consecutive_failures: 0 })
      .eq('id', src.id)
    return {
      sourceSlug: src.slug,
      status: 'failed',
      offersFound: 0,
      offersNew: 0,
      offersUpdated: 0,
      cacheHit: fc.cacheHit,
      creditsUsed: fc.creditsUsed,
      error: fc.error,
    }
  }

  const { data: parsed } = await complete({
    ...buildOfferExtractPrompt({
      sourceName: src.name,
      sourceUrl: src.url,
      issuerHint,
      markdown: fc.result.markdown,
    }),
    schema: OfferExtractSchema,
    model: 'reasoning',
    fallback: fallbackOfferExtract,
  })

  let offersNew = 0
  let offersUpdated = 0

  for (const o of parsed.offers) {
    const merchantHint = o.merchant ?? null
    const merchantMatch = await matchMerchant(merchantHint, o.category)
    const cardMatches = await matchOfferToCards({
      cardMention: o.cardMention,
      eligibleIssuers: o.eligibleIssuers,
      eligibleNetworks: o.eligibleNetworks,
      defaultIssuer: issuerHint ?? null,
    })

    const eligibleCardIds = cardMatches.map((m) => m.cardId)
    const topConfidence = cardMatches.reduce((max, m) => Math.max(max, m.confidence), 0)
    const confidenceScore = Math.max(0.4, topConfidence)
    const confidenceBand: ConfidenceBand = bandFromScore(confidenceScore)

    const offerRow = {
      source_id: src.id,
      external_id: o.externalId ?? null,
      source_url: src.url,
      title: o.title,
      description: o.description ?? null,
      offer_type: o.offerType,
      category: merchantMatch.category,
      merchant_id: merchantMatch.merchantId,
      merchant_name: merchantMatch.merchantName,
      value_pct: o.valuePct ?? null,
      value_flat: o.valueFlat ?? null,
      max_value: o.maxValue ?? null,
      min_txn: o.minTxn ?? null,
      eligible_card_ids: eligibleCardIds,
      eligible_card_networks: o.eligibleNetworks,
      eligible_issuers: o.eligibleIssuers && o.eligibleIssuers.length
        ? o.eligibleIssuers
        : issuerHint
        ? [issuerHint]
        : [],
      starts_at: o.startsAt ?? null,
      ends_at: o.endsAt ?? null,
      is_active: true,
      confidence_score: confidenceScore,
      confidence_band: confidenceBand,
      manually_verified: false,
      raw_data: o as unknown as Json,
      scraped_at: new Date().toISOString(),
    }

    // Find existing offer to upsert against (by external_id or by title+merchant)
    let existingId: string | null = null
    if (o.externalId) {
      const { data: existing } = await supabase
        .from('offers')
        .select('id')
        .eq('source_id', src.id)
        .eq('external_id', o.externalId)
        .maybeSingle()
      existingId = (existing?.id as string | undefined) ?? null
    }
    if (!existingId) {
      const { data: existing } = await supabase
        .from('offers')
        .select('id')
        .eq('source_id', src.id)
        .eq('title', o.title)
        .maybeSingle()
      existingId = (existing?.id as string | undefined) ?? null
    }

    let offerId: string
    if (existingId) {
      await supabase.from('offers').update(offerRow).eq('id', existingId)
      offerId = existingId
      offersUpdated += 1
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from('offers')
        .insert(offerRow)
        .select('id')
        .single()
      if (insErr || !inserted) continue
      offerId = inserted.id as string
      offersNew += 1
    }

    if (cardMatches.length > 0) {
      await supabase.from('card_offers').delete().eq('offer_id', offerId)
      const rows = cardMatches.map((m) => ({
        card_id: m.cardId,
        offer_id: offerId,
        match_reason: m.reason,
        match_confidence: m.confidence,
      }))
      await supabase.from('card_offers').upsert(rows, { onConflict: 'card_id,offer_id' })
    }
  }

  if (runId) {
    await supabase
      .from('scrape_runs')
      .update({
        status: fc.cacheHit ? 'cache_hit' : 'success',
        finished_at: new Date().toISOString(),
        cache_hit: fc.cacheHit,
        firecrawl_credits: fc.creditsUsed,
        offers_found: parsed.offers.length,
        offers_new: offersNew,
        offers_updated: offersUpdated,
        raw_response_size_bytes: fc.rawSizeBytes ?? null,
        duration_ms: fc.durationMs,
      })
      .eq('id', runId)
  }
  await supabase
    .from('scrape_sources')
    .update({
      last_success_at: new Date().toISOString(),
      consecutive_failures: 0,
    })
    .eq('id', src.id)

  return {
    sourceSlug: src.slug,
    status: fc.cacheHit ? 'cache_hit' : 'success',
    offersFound: parsed.offers.length,
    offersNew,
    offersUpdated,
    cacheHit: fc.cacheHit,
    creditsUsed: fc.creditsUsed,
  }
}

export async function runAllEnabledSources(
  triggeredBy: 'cron' | 'manual' = 'cron'
): Promise<RunOutcome[]> {
  const supabase = createAdminClient()
  const { data: sources } = await supabase
    .from('scrape_sources')
    .select('id')
    .eq('enabled', true)
    .order('cron_schedule')

  const results: RunOutcome[] = []
  for (const s of sources ?? []) {
    try {
      results.push(await runSource((s as { id: string }).id, triggeredBy))
    } catch (err) {
      results.push({
        sourceSlug: (s as { id: string }).id,
        status: 'failed',
        offersFound: 0,
        offersNew: 0,
        offersUpdated: 0,
        cacheHit: false,
        creditsUsed: 0,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }
  return results
}

export async function runSourceBySlug(
  slug: string,
  triggeredBy: 'cron' | 'manual' | 'on_demand' = 'manual'
): Promise<RunOutcome> {
  const supabase = createAdminClient()
  const { data: src } = await supabase
    .from('scrape_sources')
    .select('id')
    .eq('slug', slug)
    .single()
  if (!src) {
    return {
      sourceSlug: slug,
      status: 'failed',
      offersFound: 0,
      offersNew: 0,
      offersUpdated: 0,
      cacheHit: false,
      creditsUsed: 0,
      error: 'source slug not registered',
    }
  }
  return runSource((src as { id: string }).id, triggeredBy)
}
