import type { Metadata } from 'next'
import {
  getCategoryCounts,
  listMerchantsWithOfferCounts,
  listOffers,
} from '@/lib/db/offers'
import { OFFER_CATEGORY_LABELS, type OfferCategory } from '@/lib/types/offers'
import { OffersClient } from './offers-client'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Card Offers | CredStack',
  description:
    'Live credit-card offers across Indian merchants — scraped weekly from bank hubs and aggregator sites, organised by category and merchant.',
}

export default async function OffersPage() {
  const [{ offers }, counts, merchants] = await Promise.all([
    listOffers({ limit: 200, minConfidence: 0.45 }),
    getCategoryCounts(),
    listMerchantsWithOfferCounts(),
  ])

  const map = new Map(counts.map((c) => [c.category, c.count]))
  const categories = (Object.keys(OFFER_CATEGORY_LABELS) as OfferCategory[]).map((slug) => ({
    slug,
    label: OFFER_CATEGORY_LABELS[slug],
    count: map.get(slug) ?? 0,
  }))

  return <OffersClient initialOffers={offers} categories={categories} merchants={merchants} />
}
