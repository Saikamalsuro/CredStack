/**
 * Seed Tier 2 catalogue (50 cards) into Supabase.
 *
 * Run: npx tsx scripts/seed-tier2-cards.ts
 *
 * Reads .env.local for SUPABASE_SERVICE_ROLE_KEY. Idempotent: upserts
 * cards on slug; replaces card_benefits for each upserted card.
 */

import 'dotenv/config'
import { config as loadEnv } from 'dotenv'
import { resolve } from 'node:path'

loadEnv({ path: resolve(process.cwd(), '.env.local') })

import { tier2Cards } from '../lib/data/cards-tier2'
import { createAdminClient } from '../lib/db/admin'
import type { CreditCard } from '../lib/data/cards'

function loungeToInt(v: number | 'unlimited' | undefined): number | null {
  if (v === undefined) return null
  if (v === 'unlimited') return -1
  return v
}

function cardToRow(c: CreditCard) {
  const lounge = c.loungeAccess
  return {
    slug: c.id,
    name: c.name,
    issuer: c.issuer,
    network: c.network,
    categories: c.category,
    annual_fee: c.annualFee,
    joining_fee: c.joiningFee,
    is_lifetime_free: c.annualFee === 0 && c.joiningFee === 0,
    forex_markup_pct: c.foreignTransactionFee,
    fuel_surcharge_waiver: c.fuelSurchargeWaiver,
    apr_min: c.interestRate.min,
    apr_max: c.interestRate.max,
    min_income: c.minIncome,
    credit_limit_min: c.creditLimit.min,
    credit_limit_max: c.creditLimit.max,
    reward_type: c.rewards.type,
    base_reward_rate: c.rewards.rate,
    reward_description: c.rewards.description,
    welcome_bonus_text: c.welcomeBonus,
    domestic_lounges_per_year: lounge ? loungeToInt(lounge.domestic) : null,
    intl_lounges_per_year: lounge ? loungeToInt(lounge.international) : null,
    image_url: c.imageUrl,
    card_color_gradient: c.cardColor,
    rating: c.rating,
    review_count: c.reviewCount,
    featured: c.featured,
    popular: c.popular,
    is_active: true,
    data_last_verified_at: new Date().toISOString(),
  }
}

async function main() {
  const supabase = createAdminClient()

  console.log(`Seeding ${tier2Cards.length} Tier 2 cards...`)
  const rows = tier2Cards.map(cardToRow)

  const { data: upserted, error: upsertErr } = await supabase
    .from('cards')
    .upsert(rows as never, { onConflict: 'slug' })
    .select('id, slug')

  if (upsertErr) {
    console.error('Card upsert failed:', upsertErr)
    process.exit(1)
  }
  console.log(`  Upserted ${upserted?.length ?? 0} cards`)

  const slugToId = new Map<string, string>(
    (upserted ?? []).map((r) => [r.slug, r.id])
  )

  // Replace benefits per card to keep idempotency
  const slugs = tier2Cards.map((c) => c.id)
  const ids = slugs.map((s) => slugToId.get(s)).filter(Boolean) as string[]
  if (ids.length > 0) {
    const { error: delErr } = await supabase
      .from('card_benefits')
      .delete()
      .in('card_id', ids)
    if (delErr) {
      console.error('Benefit delete failed:', delErr)
      process.exit(1)
    }
  }

  const benefitRows: Array<{ card_id: string; title: string; display_order: number }> = []
  for (const c of tier2Cards) {
    const id = slugToId.get(c.id)
    if (!id) continue
    c.benefits.forEach((title, i) => {
      benefitRows.push({ card_id: id, title, display_order: i })
    })
  }

  if (benefitRows.length > 0) {
    const { error: benErr } = await supabase
      .from('card_benefits')
      .insert(benefitRows as never)
    if (benErr) {
      console.error('Benefit insert failed:', benErr)
      process.exit(1)
    }
    console.log(`  Inserted ${benefitRows.length} benefit rows`)
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
