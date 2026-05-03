import type { OfferCategory } from '@/lib/types/offers'
import { MERCHANTS_SEED } from './merchants-seed'

const KEYWORD_TO_CATEGORY: Array<[RegExp, OfferCategory]> = [
  [/swiggy|zomato|food panda|food delivery/i, 'food_delivery'],
  [/eazydiner|dineout|restaurant|dining/i, 'dining'],
  [/bigbasket|blinkit|zepto|instamart|dmart|jiomart|grocer/i, 'grocery'],
  [/myntra|ajio|tatacliq|tata cliq|nykaa|fashion|apparel/i, 'fashion'],
  [/croma|reliance digital|vijay sales|electronics|appliance/i, 'electronics'],
  [/makemytrip|mmt|cleartrip|easemytrip|yatra|irctc|flight|airline/i, 'travel_flight'],
  [/booking\.com|agoda|taj|marriott|hotel|resort/i, 'travel_hotel'],
  [/uber|ola|rapido|cab|ride/i, 'travel_cab'],
  [/hpcl|bpcl|iocl|indian oil|petrol|diesel|fuel/i, 'fuel'],
  [/airtel|jio|vi |vodafone|electricity|recharge|utility|broadband|gas bill|water bill/i, 'utility'],
  [/bookmyshow|pvr|inox|cinema|movie|district/i, 'entertainment'],
  [/cult\.?fit|1mg|pharmeasy|apollo|wellness|gym|pharmacy/i, 'health_wellness'],
  [/insurance|policy|premium/i, 'insurance'],
  [/spa|salon|lifestyle/i, 'lifestyle'],
  [/amazon|flipkart|meesho|shopping|ecommerce/i, 'ecommerce_general'],
]

export function inferCategory(merchantName: string | null | undefined): OfferCategory {
  if (!merchantName) return 'other'
  const lower = merchantName.toLowerCase().trim()

  for (const m of MERCHANTS_SEED) {
    if (lower === m.slug || lower === m.name.toLowerCase()) return m.category
    if (m.aliases?.some((a) => a.toLowerCase() === lower)) return m.category
  }
  for (const [re, cat] of KEYWORD_TO_CATEGORY) {
    if (re.test(merchantName)) return cat
  }
  return 'other'
}
