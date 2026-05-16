/**
 * Seed debit / prepaid / forex cards from lib/data/non-credit-cards-seed.ts
 *
 * Default behaviour: insert only `verificationStatus === 'verified'` entries.
 * Pass `--include-pending` to upsert pending entries as well.
 *
 * Run: npx tsx scripts/seed-non-credit-cards.ts [--include-pending]
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
  type: 'debit' | 'prepaid' | 'forex'
  network: 'visa' | 'mastercard' | 'rupay' | 'amex'
  variant?: string
  annualFee: number
  joiningFee: number
  forexMarkupPct: number
  atmWithdrawalLimitDaily: number
  posLimitDaily: number
  keyFeatures: string[]
  linkedAccountRequired: boolean
  imageUrl: string
  cardColorGradient: string
  applyUrl: string
  verificationStatus: 'verified' | 'pending'
  notes?: string
}

async function loadSeed(): Promise<SeedCard[]> {
  try {
    const mod = await import('../lib/data/non-credit-cards-seed')
    const arr = (mod as { nonCreditCardsSeed?: SeedCard[]; nonCreditCards?: SeedCard[] }).nonCreditCardsSeed
      ?? (mod as { nonCreditCardsSeed?: SeedCard[]; nonCreditCards?: SeedCard[] }).nonCreditCards
      ?? []
    return arr
  } catch (err) {
    console.error('No seed file found at lib/data/non-credit-cards-seed.ts')
    console.error(err)
    return []
  }
}

async function main() {
  const includePending = process.argv.includes('--include-pending')

  const all = await loadSeed()
  if (all.length === 0) {
    console.log('Nothing to seed.')
    process.exit(0)
  }

  const filtered = includePending
    ? all
    : all.filter((c) => c.verificationStatus === 'verified')

  const skipped = all.length - filtered.length

  const rows = filtered.map((c) => ({
    slug: c.slug,
    name: c.name,
    issuer: c.issuer,
    card_type: c.type,
    network: c.network,
    variant: c.variant ?? null,
    annual_fee: c.annualFee,
    joining_fee: c.joiningFee,
    forex_markup_pct: c.forexMarkupPct,
    atm_withdrawal_limit_daily: c.atmWithdrawalLimitDaily,
    pos_limit_daily: c.posLimitDaily,
    key_features: c.keyFeatures,
    linked_account_required: c.linkedAccountRequired,
    image_url: c.imageUrl,
    card_color_gradient: c.cardColorGradient,
    apply_url: c.applyUrl,
    verification_status: c.verificationStatus,
    notes: c.notes ?? null,
    data_pending: c.verificationStatus === 'pending',
    data_last_verified_at: new Date().toISOString(),
  }))

  const supabase = createAdminClient()
  console.log(
    `Seeding ${rows.length} non-credit cards (${all.filter((c) => c.verificationStatus === 'verified').length} verified, ${all.filter((c) => c.verificationStatus === 'pending').length} pending, skipping ${skipped})...`
  )

  const { error } = await supabase
    .from('non_credit_cards')
    .upsert(rows as never, { onConflict: 'slug' })
  if (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }

  // Per-type summary
  const byType = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.card_type] = (acc[r.card_type] ?? 0) + 1
    return acc
  }, {})
  console.log(`  By type: ${Object.entries(byType).map(([k, v]) => `${k}=${v}`).join(', ')}`)
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
