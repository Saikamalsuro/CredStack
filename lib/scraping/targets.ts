export interface ScrapeTarget {
  merchant: string
  url: string
  extractor: 'amazon' | 'flipkart' | 'swiggy' | 'generic'
}

export const SCRAPE_TARGETS: ScrapeTarget[] = [
  { merchant: 'amazon', url: 'https://www.amazon.in/b?node=18316023031', extractor: 'amazon' },
  { merchant: 'flipkart', url: 'https://www.flipkart.com/offers-store', extractor: 'flipkart' },
  { merchant: 'swiggy', url: 'https://www.swiggy.com/offers-near-me', extractor: 'swiggy' },
  { merchant: 'makemytrip', url: 'https://www.makemytrip.com/offers/', extractor: 'generic' },
  { merchant: 'myntra', url: 'https://www.myntra.com/offers', extractor: 'generic' },
]
