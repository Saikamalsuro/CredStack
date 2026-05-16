/**
 * Seed debit + prepaid cards from lib/data/non-credit-cards-seed.ts
 * (file dropped in by editorial team).
 *
 * Run: npx tsx scripts/seed-non-credit-cards.ts
 */

import 'dotenv/config'
import { config as loadEnv } from 'dotenv'
import { resolve } from 'node:path'

loadEnv({ path: resolve(process.cwd(), '.env.local') })

import { createAdminClient } from '../lib/db/admin'

interface SeedCard {
  slug: string
  name: string
  issuer: string
  cardType: 'debit' | 'prepaid'
  network: 'visa' | 'mastercard' | 'amex' | 'rupay' | 'discover'
  annualFee: number
  joiningFee: number
  forexMarkupPct: number
  atmWithdrawalLimitDaily?: number
  posLimitDaily?: number
  keyFeatures: string[]
  linkedAccountRequired: boolean
  imageUrl?: string
  cardColorGradient: string
  applyUrl?: string
  dataPending?: boolean
}

async function loadSeed(): Promise<SeedCard[]> {
  try {
    // @ts-expect-error optional seed file; user provides
    const mod = await import('../lib/data/non-credit-cards-seed')
    return (mod.nonCreditCards as SeedCard[]) ?? []
  } catch {
    console.error('No seed file found at lib/data/non-credit-cards-seed.ts')
    console.error('Drop file with `export const nonCreditCards: SeedCard[] = [...]` to seed.')
    return []
  }
}

async function main() {
  const cards = await loadSeed()
  if (cards.length === 0) {
    console.log('Nothing to seed.')
    process.exit(0)
  }

  const supabase = createAdminClient()
  const rows = cards.map((c) => ({
    slug: c.slug,
    name: c.name,
    issuer: c.issuer,
    card_type: c.cardType,
    network: c.network,
    annual_fee: c.annualFee,
    joining_fee: c.joiningFee,
    forex_markup_pct: c.forexMarkupPct,
    atm_withdrawal_limit_daily: c.atmWithdrawalLimitDaily ?? null,
    pos_limit_daily: c.posLimitDaily ?? null,
    key_features: c.keyFeatures,
    linked_account_required: c.linkedAccountRequired,
    image_url: c.imageUrl ?? null,
    card_color_gradient: c.cardColorGradient,
    apply_url: c.applyUrl ?? null,
    data_pending: c.dataPending ?? false,
    data_last_verified_at: new Date().toISOString(),
  }))

  console.log(`Seeding ${rows.length} non-credit cards...`)
  const { error } = await supabase
    .from('non_credit_cards')
    .upsert(rows as never, { onConflict: 'slug' })
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
