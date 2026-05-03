import type { OfferCategory } from '@/lib/types/offers'

export interface MerchantSeed {
  slug: string
  name: string
  category: OfferCategory
  primaryDomain: string
  aliases?: string[]
  popular?: boolean
}

export const MERCHANTS_SEED: MerchantSeed[] = [
  // Ecommerce
  { slug: 'amazon-in', name: 'Amazon India', category: 'ecommerce_general', primaryDomain: 'amazon.in', aliases: ['amazon', 'amazon.com'], popular: true },
  { slug: 'flipkart', name: 'Flipkart', category: 'ecommerce_general', primaryDomain: 'flipkart.com', popular: true },
  { slug: 'meesho', name: 'Meesho', category: 'ecommerce_general', primaryDomain: 'meesho.com' },
  { slug: 'tatacliq', name: 'Tata CLiQ', category: 'ecommerce_general', primaryDomain: 'tatacliq.com' },
  // Fashion
  { slug: 'myntra', name: 'Myntra', category: 'fashion', primaryDomain: 'myntra.com', popular: true },
  { slug: 'ajio', name: 'Ajio', category: 'fashion', primaryDomain: 'ajio.com', popular: true },
  { slug: 'nykaa', name: 'Nykaa', category: 'fashion', primaryDomain: 'nykaa.com', popular: true },
  // Food delivery
  { slug: 'swiggy', name: 'Swiggy', category: 'food_delivery', primaryDomain: 'swiggy.com', popular: true },
  { slug: 'zomato', name: 'Zomato', category: 'food_delivery', primaryDomain: 'zomato.com', popular: true },
  // Dining
  { slug: 'eazydiner', name: 'EazyDiner', category: 'dining', primaryDomain: 'eazydiner.com' },
  { slug: 'dineout', name: 'Dineout', category: 'dining', primaryDomain: 'dineout.co.in' },
  // Grocery
  { slug: 'bigbasket', name: 'BigBasket', category: 'grocery', primaryDomain: 'bigbasket.com', popular: true },
  { slug: 'blinkit', name: 'Blinkit', category: 'grocery', primaryDomain: 'blinkit.com', popular: true },
  { slug: 'zepto', name: 'Zepto', category: 'grocery', primaryDomain: 'zeptonow.com', popular: true },
  { slug: 'instamart', name: 'Swiggy Instamart', category: 'grocery', primaryDomain: 'swiggy.com', aliases: ['swiggy instamart'] },
  { slug: 'dmart', name: 'DMart', category: 'grocery', primaryDomain: 'dmart.in' },
  { slug: 'jiomart', name: 'JioMart', category: 'grocery', primaryDomain: 'jiomart.com' },
  // Electronics
  { slug: 'croma', name: 'Croma', category: 'electronics', primaryDomain: 'croma.com', popular: true },
  { slug: 'reliance-digital', name: 'Reliance Digital', category: 'electronics', primaryDomain: 'reliancedigital.in' },
  { slug: 'vijay-sales', name: 'Vijay Sales', category: 'electronics', primaryDomain: 'vijaysales.com', aliases: ['vijay sales'] },
  // Travel — flights
  { slug: 'makemytrip', name: 'MakeMyTrip', category: 'travel_flight', primaryDomain: 'makemytrip.com', aliases: ['mmt'], popular: true },
  { slug: 'cleartrip', name: 'Cleartrip', category: 'travel_flight', primaryDomain: 'cleartrip.com' },
  { slug: 'easemytrip', name: 'EaseMyTrip', category: 'travel_flight', primaryDomain: 'easemytrip.com' },
  { slug: 'yatra', name: 'Yatra', category: 'travel_flight', primaryDomain: 'yatra.com' },
  { slug: 'irctc', name: 'IRCTC', category: 'travel_flight', primaryDomain: 'irctc.co.in' },
  // Travel — hotels
  { slug: 'booking-com', name: 'Booking.com', category: 'travel_hotel', primaryDomain: 'booking.com', aliases: ['booking'] },
  { slug: 'agoda', name: 'Agoda', category: 'travel_hotel', primaryDomain: 'agoda.com' },
  { slug: 'taj-hotels', name: 'Taj Hotels', category: 'travel_hotel', primaryDomain: 'tajhotels.com', aliases: ['ihcl', 'taj'] },
  { slug: 'marriott', name: 'Marriott Bonvoy', category: 'travel_hotel', primaryDomain: 'marriott.com' },
  // Travel — cabs
  { slug: 'uber', name: 'Uber', category: 'travel_cab', primaryDomain: 'uber.com', popular: true },
  { slug: 'ola', name: 'Ola', category: 'travel_cab', primaryDomain: 'olacabs.com', popular: true },
  { slug: 'rapido', name: 'Rapido', category: 'travel_cab', primaryDomain: 'rapido.bike' },
  // Fuel
  { slug: 'hpcl', name: 'HPCL', category: 'fuel', primaryDomain: 'hindustanpetroleum.com' },
  { slug: 'bpcl', name: 'BPCL', category: 'fuel', primaryDomain: 'bharatpetroleum.in' },
  { slug: 'iocl', name: 'Indian Oil', category: 'fuel', primaryDomain: 'indianoil.in', aliases: ['indianoil', 'indian oil'] },
  // Utility
  { slug: 'airtel', name: 'Airtel', category: 'utility', primaryDomain: 'airtel.in' },
  { slug: 'jio', name: 'Jio', category: 'utility', primaryDomain: 'jio.com' },
  // Entertainment
  { slug: 'bookmyshow', name: 'BookMyShow', category: 'entertainment', primaryDomain: 'bookmyshow.com', popular: true },
  { slug: 'pvr', name: 'PVR Inox', category: 'entertainment', primaryDomain: 'pvrcinemas.com', aliases: ['pvr', 'inox'] },
  { slug: 'district', name: 'District by Zomato', category: 'entertainment', primaryDomain: 'district.in', aliases: ['district'] },
  // Health
  { slug: 'cult-fit', name: 'Cult.fit', category: 'health_wellness', primaryDomain: 'cult.fit', aliases: ['cultfit', 'cult fit'] },
  { slug: '1mg', name: 'Tata 1mg', category: 'health_wellness', primaryDomain: '1mg.com', aliases: ['1mg'] },
  { slug: 'pharmeasy', name: 'PharmEasy', category: 'health_wellness', primaryDomain: 'pharmeasy.in' },
  { slug: 'apollo-pharmacy', name: 'Apollo Pharmacy', category: 'health_wellness', primaryDomain: 'apollopharmacy.in', aliases: ['apollo'] },
]
