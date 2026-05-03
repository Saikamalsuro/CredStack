import 'dotenv/config'
import { createAdminClient } from '@/lib/db/admin'
import type { OfferCategory, OfferType } from '@/lib/types/offers'

interface SampleOffer {
  title: string
  description: string
  offerType: OfferType
  category: OfferCategory
  merchantSlug: string
  cardNameContains?: string[]
  issuers?: string[]
  networks?: string[]
  valuePct?: number
  valueFlat?: number
  maxValue?: number
  minTxn?: number
  endsAt?: string
  sourceUrl: string
}

const NEXT_QUARTER = new Date()
NEXT_QUARTER.setMonth(NEXT_QUARTER.getMonth() + 3)
const ENDS_DEFAULT = NEXT_QUARTER.toISOString()

const SAMPLES: SampleOffer[] = [
  {
    title: '10% instant discount on Swiggy',
    description: 'Get 10% off (up to ₹150) on Swiggy orders above ₹500 with HDFC Bank credit cards. Valid on weekends.',
    offerType: 'instant_discount',
    category: 'food_delivery',
    merchantSlug: 'swiggy',
    issuers: ['HDFC Bank'],
    valuePct: 10,
    maxValue: 150,
    minTxn: 500,
    endsAt: ENDS_DEFAULT,
    sourceUrl: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards',
  },
  {
    title: 'Flat ₹125 off on Zomato orders',
    description: 'Flat ₹125 instant discount on Zomato food delivery for ICICI Bank credit card holders. Min order ₹399.',
    offerType: 'instant_discount',
    category: 'food_delivery',
    merchantSlug: 'zomato',
    issuers: ['ICICI Bank'],
    valueFlat: 125,
    minTxn: 399,
    endsAt: ENDS_DEFAULT,
    sourceUrl: 'https://www.icicibank.com/personal-banking/cards/credit-card',
  },
  {
    title: '5% cashback on Amazon India',
    description: 'Earn 5% cashback on Amazon purchases with the Amazon Pay ICICI Bank Credit Card. Unlimited.',
    offerType: 'cashback',
    category: 'ecommerce_general',
    merchantSlug: 'amazon-in',
    cardNameContains: ['Amazon Pay'],
    issuers: ['ICICI Bank'],
    valuePct: 5,
    sourceUrl: 'https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay-credit-card',
  },
  {
    title: '₹500 off on Flipkart Big Billion Days',
    description: 'Flat ₹500 instant discount on Flipkart for purchases above ₹5,000 with Axis Bank credit cards.',
    offerType: 'instant_discount',
    category: 'ecommerce_general',
    merchantSlug: 'flipkart',
    issuers: ['Axis Bank'],
    valueFlat: 500,
    minTxn: 5000,
    endsAt: ENDS_DEFAULT,
    sourceUrl: 'https://www.axisbank.com/cards/credit-card/offers-corner',
  },
  {
    title: '15% off on MakeMyTrip flights',
    description: 'Get 15% instant discount up to ₹3,000 on domestic flight bookings via MakeMyTrip with HDFC Bank credit cards.',
    offerType: 'instant_discount',
    category: 'travel_flight',
    merchantSlug: 'makemytrip',
    issuers: ['HDFC Bank'],
    valuePct: 15,
    maxValue: 3000,
    minTxn: 5000,
    endsAt: ENDS_DEFAULT,
    sourceUrl: 'https://www.makemytrip.com/offers/',
  },
  {
    title: '20% off on Myntra fashion',
    description: 'Flat 20% off (max ₹1,000) on Myntra orders above ₹2,500 with SBI Credit Cards. End-of-season sale.',
    offerType: 'instant_discount',
    category: 'fashion',
    merchantSlug: 'myntra',
    issuers: ['SBI Card'],
    valuePct: 20,
    maxValue: 1000,
    minTxn: 2500,
    endsAt: ENDS_DEFAULT,
    sourceUrl: 'https://www.sbicard.com/en/personal/offers.page',
  },
  {
    title: '10X reward points on BigBasket',
    description: 'Earn 10X reward points on BigBasket grocery purchases with HDFC Bank Millennia and Diners Club Black Credit Cards.',
    offerType: 'reward_multiplier',
    category: 'grocery',
    merchantSlug: 'bigbasket',
    cardNameContains: ['Millennia', 'Diners Club Black'],
    issuers: ['HDFC Bank'],
    valuePct: 10,
    sourceUrl: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards',
  },
  {
    title: '15% cashback on Zepto orders',
    description: 'Get 15% cashback up to ₹100 on Zepto orders above ₹399 with Axis Bank credit cards. Limited period.',
    offerType: 'cashback',
    category: 'grocery',
    merchantSlug: 'zepto',
    issuers: ['Axis Bank'],
    valuePct: 15,
    maxValue: 100,
    minTxn: 399,
    endsAt: ENDS_DEFAULT,
    sourceUrl: 'https://www.axisbank.com/cards/credit-card/offers-corner',
  },
  {
    title: 'Buy 1 Get 1 free on BookMyShow',
    description: 'Buy one movie ticket get one free (max ₹250 off) every Friday with Kotak credit cards on BookMyShow.',
    offerType: 'bogo',
    category: 'entertainment',
    merchantSlug: 'bookmyshow',
    issuers: ['Kotak Mahindra Bank'],
    maxValue: 250,
    endsAt: ENDS_DEFAULT,
    sourceUrl: 'https://www.bookmyshow.com/offers',
  },
  {
    title: '5% cashback on fuel surcharge waiver',
    description: 'Get 1% fuel surcharge waiver plus 5% accelerated cashback at HPCL pumps with SBI BPCL Octane Card.',
    offerType: 'cashback',
    category: 'fuel',
    merchantSlug: 'hpcl',
    cardNameContains: ['BPCL Octane'],
    issuers: ['SBI Card'],
    valuePct: 5,
    sourceUrl: 'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-bpcl-octane.page',
  },
  {
    title: '₹200 off Uber rides',
    description: 'Get ₹200 off on Uber rides (₹50 x 4 rides) for new users with American Express credit cards. Min ride value ₹250.',
    offerType: 'voucher',
    category: 'travel_cab',
    merchantSlug: 'uber',
    issuers: ['American Express'],
    valueFlat: 200,
    minTxn: 250,
    endsAt: ENDS_DEFAULT,
    sourceUrl: 'https://www.americanexpress.com/in/benefits/offers/',
  },
  {
    title: '12% off on Croma electronics',
    description: 'Flat 12% instant discount up to ₹2,500 on Croma purchases above ₹15,000 with HDFC Bank credit cards. No-cost EMI.',
    offerType: 'instant_discount',
    category: 'electronics',
    merchantSlug: 'croma',
    issuers: ['HDFC Bank'],
    valuePct: 12,
    maxValue: 2500,
    minTxn: 15000,
    endsAt: ENDS_DEFAULT,
    sourceUrl: 'https://www.croma.com/',
  },
]

async function main() {
  const supabase = createAdminClient()

  const { data: cards } = await supabase.from('cards').select('id, slug, name, issuer')
  const allCards = (cards ?? []) as Array<{ id: string; slug: string; name: string; issuer: string }>

  const { data: merchants } = await supabase.from('merchants').select('id, slug, name, category')
  const merchantBySlug = new Map(
    ((merchants ?? []) as Array<{ id: string; slug: string; name: string; category: string }>).map(
      (m) => [m.slug, m]
    )
  )

  let inserted = 0
  for (const s of SAMPLES) {
    const merchant = merchantBySlug.get(s.merchantSlug)
    if (!merchant) {
      console.warn(`merchant ${s.merchantSlug} not seeded — skipping`)
      continue
    }

    // Resolve eligible cards
    const cardIds = new Set<string>()
    const matchRows: Array<{ card_id: string; reason: string; conf: number }> = []

    if (s.cardNameContains?.length) {
      for (const needle of s.cardNameContains) {
        for (const c of allCards) {
          if (c.name.toLowerCase().includes(needle.toLowerCase())) {
            if (!cardIds.has(c.id)) {
              cardIds.add(c.id)
              matchRows.push({ card_id: c.id, reason: 'explicit_card_name', conf: 0.95 })
            }
          }
        }
      }
    }
    if (s.issuers?.length) {
      const norms = s.issuers.map((i) => i.toLowerCase().replace(/[^a-z]/g, ''))
      for (const c of allCards) {
        const ci = c.issuer.toLowerCase().replace(/[^a-z]/g, '')
        if (norms.some((n) => ci.includes(n) || n.includes(ci))) {
          if (!cardIds.has(c.id)) {
            cardIds.add(c.id)
            matchRows.push({ card_id: c.id, reason: 'issuer_match', conf: 0.7 })
          }
        }
      }
    }

    const eligibleCardIds = [...cardIds]
    const topConf = matchRows.reduce((m, r) => Math.max(m, r.conf ?? 0.7), 0)
    const band = topConf >= 0.85 ? 'verified' : topConf >= 0.65 ? 'medium' : 'low'

    const offerRow = {
      source_id: null,
      external_id: null,
      source_url: s.sourceUrl,
      title: s.title,
      description: s.description,
      offer_type: s.offerType,
      category: s.category,
      merchant_id: merchant.id,
      merchant_name: merchant.name,
      value_pct: s.valuePct ?? null,
      value_flat: s.valueFlat ?? null,
      max_value: s.maxValue ?? null,
      min_txn: s.minTxn ?? null,
      eligible_card_ids: eligibleCardIds,
      eligible_card_networks: s.networks ?? [],
      eligible_issuers: s.issuers ?? [],
      starts_at: null,
      ends_at: s.endsAt ?? null,
      is_active: true,
      confidence_score: Math.max(0.85, topConf),
      confidence_band: 'verified' as const,
      manually_verified: true,
      raw_data: null,
      scraped_at: new Date().toISOString(),
    }

    const { data: inserted_offer, error } = await supabase
      .from('offers')
      .insert(offerRow)
      .select('id')
      .single()

    if (error || !inserted_offer) {
      console.error(`failed to insert ${s.title}:`, error?.message)
      continue
    }

    const offerId = inserted_offer.id as string
    if (matchRows.length > 0) {
      const cardOfferRows = matchRows.map((m) => ({
        card_id: m.card_id,
        offer_id: offerId,
        match_reason: m.reason,
        match_confidence: m.conf ?? 0.7,
      }))
      await supabase.from('card_offers').upsert(cardOfferRows, { onConflict: 'card_id,offer_id' })
    }

    inserted += 1
    console.log(`✓ ${s.title} → ${eligibleCardIds.length} cards matched`)
    void band
  }

  console.log(`\ndone — inserted ${inserted}/${SAMPLES.length} offers`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
