export type OfferType =
  | 'cashback'
  | 'instant_discount'
  | 'reward_multiplier'
  | 'voucher'
  | 'bogo'
  | 'no_cost_emi'
  | 'milestone'
  | 'welcome'
  | 'lounge_access'
  | 'other'

export type OfferCategory =
  | 'food_delivery'
  | 'dining'
  | 'grocery'
  | 'ecommerce_general'
  | 'fashion'
  | 'electronics'
  | 'travel_flight'
  | 'travel_hotel'
  | 'travel_cab'
  | 'fuel'
  | 'utility'
  | 'entertainment'
  | 'health_wellness'
  | 'education'
  | 'insurance'
  | 'lifestyle'
  | 'other'

export type SourceType = 'bank_hub' | 'aggregator' | 'merchant' | 'manual'
export type ConfidenceBand = 'verified' | 'high' | 'medium' | 'low'

export const OFFER_CATEGORY_LABELS: Record<OfferCategory, string> = {
  food_delivery: 'Food Delivery',
  dining: 'Dining',
  grocery: 'Grocery',
  ecommerce_general: 'Shopping',
  fashion: 'Fashion',
  electronics: 'Electronics',
  travel_flight: 'Flights',
  travel_hotel: 'Hotels',
  travel_cab: 'Cabs',
  fuel: 'Fuel',
  utility: 'Bills & Utility',
  entertainment: 'Entertainment',
  health_wellness: 'Health & Wellness',
  education: 'Education',
  insurance: 'Insurance',
  lifestyle: 'Lifestyle',
  other: 'Other',
}

export const OFFER_TYPE_LABELS: Record<OfferType, string> = {
  cashback: 'Cashback',
  instant_discount: 'Instant Discount',
  reward_multiplier: 'Reward Multiplier',
  voucher: 'Voucher',
  bogo: 'Buy One Get One',
  no_cost_emi: 'No-Cost EMI',
  milestone: 'Milestone',
  welcome: 'Welcome Benefit',
  lounge_access: 'Lounge Access',
  other: 'Offer',
}

export interface RawOffer {
  externalId?: string | null
  sourceUrl: string
  title: string
  description?: string | null
  offerType: OfferType
  category: OfferCategory
  merchantNameHint?: string | null
  cardMentionRaw?: string | null
  eligibleIssuers?: string[]
  eligibleCardNetworks?: string[]
  valuePct?: number | null
  valueFlat?: number | null
  maxValue?: number | null
  minTxn?: number | null
  startsAt?: string | null
  endsAt?: string | null
}

export interface Offer {
  id: string
  title: string
  description: string | null
  offerType: OfferType
  category: OfferCategory
  merchantId: string | null
  merchantName: string | null
  merchantSlug: string | null
  valuePct: number | null
  valueFlat: number | null
  maxValue: number | null
  minTxn: number | null
  endsAt: string | null
  startsAt: string | null
  scrapedAt: string
  sourceUrl: string
  confidenceScore: number
  confidenceBand: ConfidenceBand
  manuallyVerified: boolean
  eligibleIssuers: string[]
  eligibleCardNetworks: string[]
  eligibleCardIds: string[]
}

export interface CardMatch {
  cardId: string
  reason:
    | 'explicit_card_id'
    | 'explicit_card_name'
    | 'issuer_match'
    | 'network_match'
    | 'bin_match'
  confidence: number
}

export interface ScrapeOptions {
  formats?: Array<'markdown' | 'html' | 'rawHtml'>
  onlyMainContent?: boolean
  waitFor?: number
  includeTags?: string[]
  excludeTags?: string[]
}

export interface ScrapeResult {
  url: string
  markdown: string
  metadata: Record<string, unknown>
  scrapedAt: string
}

export interface SourceDefinition {
  slug: string
  name: string
  url: string
  sourceType: SourceType
  parserModule: string
  cronSchedule: string
  cacheTtlSeconds: number
  firecrawlOptions?: ScrapeOptions
  issuerHint?: string
}
