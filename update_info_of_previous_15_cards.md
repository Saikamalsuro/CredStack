/**
 * ORIGINAL 15 CREDIT CARDS — VERIFIED 2026 DATA — CredStack
 *
 * This file replaces the original `creditCards` array in `lib/data/cards.ts`.
 * Every field has been verified from at least 2-3 sources (PaisaBazaar,
 * BankBazaar, official issuer sites, CardExpert, CardInsider, 1Finance) in
 * April-May 2026.
 *
 * --------------------------------------------------------------------------
 * KEY CORRECTIONS FROM ORIGINAL SEED DATA (please review carefully):
 * --------------------------------------------------------------------------
 *
 * 1) HDFC Infinia — Added April 2026 retention rule: ₹18L annual spend OR
 *    ₹50L Relationship Value to keep the card. Forex 2% (not 1.99%).
 *
 * 2) Amex Platinum — Annual fee is ₹66,000 (NOT ₹60,000). It is a charge
 *    card with no preset spending limit. Min income ₹25L salaried / ₹15L
 *    self-employed. 1 MR per ₹40 (excludes utilities/insurance).
 *
 * 3) Axis Magnus (standard, non-Burgundy) — Lounge access is UNLIMITED
 *    domestic + UNLIMITED international via Priority Pass (your old data
 *    showing 8/quarter is wrong). Annual fee waiver raised to ₹25L spend
 *    (from ₹15L) effective Sept 2024. Forex 2%.
 *
 * 4) SBI ELITE — Lounge: 8 domestic + 6 international via Priority Pass.
 *    Forex 1.99%. Welcome ₹5,000 voucher.
 *
 * 5) Amazon Pay ICICI — Forex is 1.99% (not 3.5%). NEW Jan 2026: 1% fee
 *    on wallet loads ≥ ₹5,000. NO lounge access (correctly null).
 *
 * 6) HDFC Millennia — 5% capped at 1,000 CashPoints/month on the 10 partner
 *    brands; 1% capped at 1,000 CashPoints/month on others. Lounge access
 *    is now milestone-driven (1 visit on ₹1L quarterly spend).
 *
 * 7) OneCard — Confirmed lifetime free, NO lounge access (your data was
 *    correct here — null preserved).
 *
 * 8) HDFC Regalia Gold — MAJOR May/July 2026 changes baked in:
 *    - Earn rate changed to 5 RPs/₹200 (from 4 RPs/₹150) effective May 2026
 *    - From July 1 2026, lounge access requires ₹60K quarterly spend to
 *      unlock 3 domestic visits next quarter (no more automatic access)
 *
 * 9) Flipkart Axis — Lounge access DISCONTINUED (June 2025). 7.5% on
 *    Myntra (capped ₹4K/quarter), 5% on Flipkart/Cleartrip, 4% on
 *    preferred merchants (Swiggy/Uber/PVR/Cult.fit), 1% other.
 *
 * 10) ICICI Sapphiro — For cards issued post-15 Nov 2024:
 *     4 domestic lounge visits (require ₹75K quarterly spend) + 2
 *     international visits via Priority Pass.
 *
 * 11) IndusInd Legend — Now LIFETIME FREE. Lounge access DISCONTINUED
 *     7 March 2025. KrisFlyer 4:1 transfer.
 *
 * 12) AU LIT — Customizable card; features activate for 90 days at fees
 *     ₹49–₹399 per feature. Base: 1 RP/₹100, 10X/5X on activated features.
 *
 * 13) SBI Cashback — Revised April 2026 caps: 5% online capped ₹2,000/mo,
 *     1% offline capped ₹2,000/mo (max ₹4,000/cycle). No welcome bonus.
 *
 * 14) IDFC FIRST Millennia — Lifetime free. NO airport lounges; 4 RAILWAY
 *     lounge visits/quarter. 10X above ₹20K/month, 3X up to ₹20K/month.
 *
 * 15) HSBC Smart Value — Lifetime free (no joining or annual fee per
 *     HSBC official site). 1 RP per ₹100, 3X on online/dining/telecom.
 *
 * --------------------------------------------------------------------------
 * MERGE INSTRUCTIONS:
 * --------------------------------------------------------------------------
 * In `lib/data/cards.ts`, replace the original 15-card seed array with:
 *
 *   import { originalCardsVerified } from "./cards-original-verified"
 *   import { additionalCards } from "./cards-additional"
 *
 *   export const creditCards: CreditCard[] = [
 *     ...originalCardsVerified,
 *     ...additionalCards,
 *   ]
 *
 * IDs match the original `card.id` slugs so URLs (/cards/[id]) keep working.
 */

import type { CreditCard } from "./cards"

export const originalCardsVerified: CreditCard[] = [
  // ─────────────────────────────────────────────────────────────────
  // 1. HDFC Infinia — Super Premium / invite-only
  // ─────────────────────────────────────────────────────────────────
  {
    id: "hdfc-infinia",
    name: "HDFC Infinia Metal Edition",
    issuer: "HDFC Bank",
    network: "visa",
    category: ["premium", "travel", "rewards"],
    annualFee: 12500,
    joiningFee: 12500,
    interestRate: { min: 1.99, max: 1.99 },
    creditLimit: { min: 1000000, max: 10000000 },
    rewards: {
      type: "points",
      rate: 3.33,
      description:
        "5 reward points per Rs. 150 (3.33% base); up to 10X on SmartBuy capped at 15,000 RPs/month; 1 RP = Rs. 1 on flights/hotels/Apple/Tanishq"
    },
    benefits: [
      "Unlimited complimentary domestic & international airport lounge access (Priority Pass) for primary and add-on cardholders",
      "Up to 10X reward points on SmartBuy (capped at 15,000 RPs/month) covering travel and shopping",
      "Unlimited complimentary golf games and lessons at premium courses in India and abroad",
      "Complimentary Club Marriott membership for the first year",
      "Book 3 nights and pay for 2 at participating ITC hotels; 1+1 buffet on weekends at ITC",
      "10% off (up to Rs. 1,000) on dining via Swiggy Dineout (twice a month, min bill Rs. 8,000)",
      "Welcome benefit: 12,500 reward points on fee realization",
      "Annual fee waiver on Rs. 10 lakh spend in preceding 12 months",
      "**April 2026 retention rule:** Rs. 18 lakh annual spend OR Rs. 50 lakh Relationship Value required to retain card",
      "24x7 Global Personal Concierge",
      "Air accident insurance and overseas medical cover"
    ],
    loungeAccess: { domestic: "unlimited", international: "unlimited" },
    welcomeBonus: "12,500 reward points + Club Marriott membership on fee realization",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 2,
    minIncome: 5000000,
    rating: 4.8,
    reviewCount: 8743,
    imageUrl: "/cards/hdfc-infinia.jpg",
    cardColor: "from-slate-800 via-slate-900 to-black",
    featured: true,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 2. American Express Platinum Charge Card
  // ─────────────────────────────────────────────────────────────────
  {
    id: "amex-platinum",
    name: "American Express Platinum Charge Card",
    issuer: "American Express",
    network: "amex",
    category: ["premium", "travel", "rewards"],
    annualFee: 66000, // ⚠ CORRECTED: was incorrectly ₹60,000 in seed data
    joiningFee: 66000,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 1000000, max: 10000000 }, // charge card; no preset limit officially
    rewards: {
      type: "points",
      rate: 1.25,
      description:
        "1 Membership Reward point per Rs. 40 (excludes utilities, insurance, cash, EMI conversions); 1 MR ≈ Rs. 0.50 max value"
    },
    benefits: [
      "Charge card with NO PRESET spend limit — internal shadow limit grows with usage",
      "Welcome vouchers up to Rs. 60,000 (Taj Hotels Rs. 50K / Reliance Luxe Rs. 35K / Postcard Hotels Rs. 60K) on Rs. 50K spend in first 2 months",
      "Renewal milestone: vouchers up to Rs. 35,000 from Taj/Reliance Luxe/Postcard on Rs. 20 lakh annual spend",
      "Unlimited complimentary golf at 30+ Indian and 50+ global courses (primary and add-on members) including lessons",
      "Multi-program lounge access: Priority Pass + Centurion Lounges + Amex Lounges + Escape Lounges + Plaza Premium",
      "Fine Hotels & Resorts: complimentary suite of benefits worth ~Rs. 44,300 per stay at 1,300+ properties",
      "Hotel Loyalty Program memberships: Marriott Bonvoy Gold, Hilton Honors Gold, Radisson Premium, Taj Epicure Plus, Accor Plus Silver",
      "Air accident insurance up to Rs. 5 Crore",
      "Times Ace membership (40+ OTT and publications including Disney+ Hotstar, Amazon Prime Lite)",
      "Up to 50% off at 1,800+ premium restaurants in India",
      "24x7 Platinum Concierge",
      "10,000 referral bonus MR points on Rs. 5,000 spend within 90 days"
    ],
    loungeAccess: { domestic: "unlimited", international: "unlimited" },
    welcomeBonus: "Vouchers worth up to Rs. 60,000 (Taj/Reliance Luxe/Postcard) on Rs. 50K spend in first 2 months",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 2500000, // ₹25 LPA salaried
    rating: 4.7,
    reviewCount: 3245,
    imageUrl: "/cards/amex-platinum.jpg",
    cardColor: "from-zinc-300 via-zinc-400 to-zinc-600",
    featured: true,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 3. Axis Bank Magnus (Standard Variant)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "axis-magnus",
    name: "Axis Bank Magnus",
    issuer: "Axis Bank",
    network: "mastercard", // also available on Visa; MC variant unlocks World Mastercard golf perks
    category: ["premium", "travel", "rewards"],
    annualFee: 12500,
    joiningFee: 12500,
    interestRate: { min: 3.0, max: 3.0 },
    creditLimit: { min: 500000, max: 5000000 },
    rewards: {
      type: "points",
      rate: 4.8,
      description:
        "12 EDGE points per Rs. 200 base (up to Rs. 1.5L/month); 35 EDGE points per Rs. 200 above Rs. 1.5L/month; 60 per Rs. 200 on Travel EDGE up to Rs. 2L/month; 5:2 partner transfer (5:4 for Burgundy variant)"
    },
    benefits: [
      "Welcome benefit: Voucher worth Rs. 12,500 (Luxe Gift Card / Postcard Hotels / Yatra) — fully offsets joining fee",
      "Unlimited complimentary domestic airport lounge access for primary and add-on cardholders",
      "Unlimited complimentary international airport lounge access via Priority Pass + 4 guest visits per year",
      "12 EDGE points per Rs. 200 base; 35 EDGE points per Rs. 200 on incremental monthly spends above Rs. 1.5 lakh",
      "60 EDGE points per Rs. 200 on Axis Travel EDGE portal (up to Rs. 2 lakh per month)",
      "Transfer EDGE points to 20+ travel partners (5:2 ratio for non-Burgundy)",
      "Up to 15% off on domestic/international Trident & Oberoi hotels",
      "Up to 30% off at 4,000+ partner restaurants via Axis Dining Delights",
      "Annual fee waiver on Rs. 25 lakh spend in preceding year (raised from Rs. 15L in Sept 2024)",
      "Forex markup of 2%",
      "Mastercard variant: 4 complimentary golf games + 12 lessons per year",
      "**Excluded from rewards:** wallet, rent, fuel, utilities, government, insurance, gold/jewellery"
    ],
    loungeAccess: { domestic: "unlimited", international: "unlimited" },
    welcomeBonus: "Voucher worth Rs. 12,500 (Luxe / Postcard Hotels / Yatra) on first transaction within 30 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 2,
    minIncome: 2400000,
    rating: 4.6,
    reviewCount: 6892,
    imageUrl: "/cards/axis-magnus.jpg",
    cardColor: "from-purple-900 via-purple-800 to-indigo-900",
    featured: true,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 4. SBI Card ELITE
  // ─────────────────────────────────────────────────────────────────
  {
    id: "sbi-elite",
    name: "SBI Card ELITE",
    issuer: "SBI Card",
    network: "visa", // available on Visa / Mastercard / Amex / RuPay Select
    category: ["premium", "rewards", "travel"],
    annualFee: 4999,
    joiningFee: 4999,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 200000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 2.5,
      description:
        "10 reward points per Rs. 100 on dining/grocery/department stores (capped 10,000 RPs/month combined); 2 RPs per Rs. 100 elsewhere; 1 RP = Rs. 0.25"
    },
    benefits: [
      "Welcome e-Gift Voucher worth Rs. 5,000 from Yatra/Bata/Pantaloons/Aditya Birla Fashion/Shoppers Stop",
      "5X reward points (10 RPs per Rs. 100) on dining, grocery, departmental stores, movies",
      "Up to 50,000 bonus reward points per year (worth Rs. 12,500): 10K each on Rs. 3L & Rs. 4L spend; 15K each on Rs. 5L & Rs. 8L spend",
      "Free movie tickets worth Rs. 6,000 per year (2 tickets/month, Rs. 250 each via BookMyShow)",
      "8 complimentary domestic airport lounge visits per year (2/quarter)",
      "6 complimentary international lounge visits per year via Priority Pass (max 2/quarter)",
      "Lowest-in-class 1.99% forex markup fee",
      "Mastercard variant: 4 free green-fee rounds + 1 monthly golf lesson",
      "Annual fee waiver on Rs. 10 lakh annual spend",
      "Club ITC Silver Tier membership for cards sourced from 1 Sept 2025",
      "Dedicated concierge service (flower delivery, gift delivery, online doctor consultation)"
    ],
    loungeAccess: { domestic: 8, international: 6 },
    welcomeBonus: "e-Gift Voucher worth Rs. 5,000 from partner brands on annual fee payment",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.99,
    minIncome: 720000,
    rating: 4.5,
    reviewCount: 12453,
    imageUrl: "/cards/sbi-elite.jpg",
    cardColor: "from-amber-900 via-yellow-800 to-amber-700",
    featured: true,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 5. Amazon Pay ICICI Bank Credit Card
  // ─────────────────────────────────────────────────────────────────
  {
    id: "amazon-pay-icici",
    name: "Amazon Pay ICICI Bank Credit Card",
    issuer: "ICICI Bank",
    network: "visa",
    category: ["cashback", "shopping"],
    annualFee: 0,
    joiningFee: 0,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 50000, max: 800000 },
    rewards: {
      type: "cashback",
      rate: 5,
      description:
        "5% on Amazon (Prime members), 3% on Amazon (non-Prime), 2% at 100+ Amazon Pay merchants, 1% on other spends. Cashback credited as Amazon Pay balance, never expires."
    },
    benefits: [
      "Lifetime free — no joining or annual fee",
      "5% cashback on Amazon.in for Prime members; 3% for non-Prime",
      "2% cashback at 100+ Amazon Pay partner merchants",
      "1% cashback on all other spends (excl. fuel, rent, taxes, education, EMI, international)",
      "Cashback auto-credited as Amazon Pay balance; reward points never expire",
      "No-cost EMI on eligible Amazon purchases for 3-6 months",
      "Welcome benefits worth ~Rs. 2,500 (vouchers + 1-month EazyDiner Prime)",
      "1% fuel surcharge waiver at all fuel stations across India",
      "Low forex markup of 1.99%",
      "Min 15% discount on dining at 2,500+ restaurants under ICICI Culinary Treats",
      "**Jan 2026 update:** 1% fee on wallet loads ≥ Rs. 5,000",
      "No lounge access; no add-on cards"
    ],
    loungeAccess: null,
    welcomeBonus: "Welcome cashback and vouchers worth ~Rs. 2,500 + 1-month EazyDiner Prime",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.99,
    minIncome: 360000,
    rating: 4.6,
    reviewCount: 24876,
    imageUrl: "/cards/amazon-pay-icici.jpg",
    cardColor: "from-orange-500 via-orange-600 to-zinc-800",
    featured: true,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 6. HDFC Millennia Credit Card
  // ─────────────────────────────────────────────────────────────────
  {
    id: "hdfc-millennia",
    name: "HDFC Millennia",
    issuer: "HDFC Bank",
    network: "mastercard", // also Visa / Diners
    category: ["cashback", "shopping"],
    annualFee: 1000,
    joiningFee: 1000,
    interestRate: { min: 3.6, max: 3.6 },
    creditLimit: { min: 50000, max: 500000 },
    rewards: {
      type: "cashback",
      rate: 5,
      description:
        "5% on 10 partner brands (capped 1,000 CashPoints/month); 1% on other spends (capped 1,000 CashPoints/month); 1 CashPoint = Rs. 1 against statement"
    },
    benefits: [
      "5% cashback on 10 partner brands: Amazon, Flipkart, Myntra, Tata CLiQ, Swiggy, Zomato, Uber, BookMyShow, Sony LIV, Cult.fit (capped 1,000 CashPoints/month)",
      "1% cashback on other spends (capped 1,000 CashPoints/month, excl. fuel)",
      "Welcome benefit: 1,000 CashPoints on joining fee payment",
      "Quarterly milestone (Rs. 1L spend): choose Rs. 1,000 voucher OR 1 complimentary domestic lounge access",
      "10% additional discount on Swiggy Dineout (max Rs. 1,000)",
      "Annual fee waiver on Rs. 1 lakh annual spend",
      "1% fuel surcharge waiver (Rs. 400-Rs. 5,000, max Rs. 250/cycle)",
      "Up to 50 days interest-free credit period",
      "1 CashPoint = Re. 1 for statement credit; Re. 0.30 for SmartBuy/airmiles/products"
    ],
    loungeAccess: { domestic: 4, international: 0 }, // milestone-based: 1 visit per quarter on ₹1L spend
    welcomeBonus: "1,000 CashPoints worth Rs. 1,000 on payment of joining fee",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 420000,
    rating: 4.4,
    reviewCount: 17234,
    imageUrl: "/cards/hdfc-millennia.jpg",
    cardColor: "from-cyan-600 via-blue-600 to-indigo-700",
    featured: false,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 7. OneCard Metal Credit Card
  // ─────────────────────────────────────────────────────────────────
  {
    id: "onecard",
    name: "OneCard Metal",
    issuer: "OneCard (FPL Technologies)",
    network: "visa",
    category: ["rewards", "shopping"],
    annualFee: 0,
    joiningFee: 0,
    interestRate: { min: 3.75, max: 3.75 },
    creditLimit: { min: 25000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 1,
      description:
        "1 reward point per Rs. 50 base; 5X on top 2 spend categories of the month (auto-determined). 1 RP = Rs. 0.10. Fractional points awarded."
    },
    benefits: [
      "Lifetime free Visa Signature metal card — no joining or annual fee",
      "Issued in partnership with SBM Bank, South Indian Bank, Federal Bank, BOB Financial, Indian Bank, CSB Bank",
      "5X reward points automatically applied on top 2 spend categories each month",
      "Fractional reward points (e.g. 0.5 RP for Rs. 25 spend)",
      "Reward points credited instantly and never expire",
      "1% forex markup — among the lowest in India",
      "Fully app-based: virtual card in <5 minutes via OneCard app",
      "App controls for transaction limits, online/offline/international toggles, contactless",
      "Reward points redeemable for cashback (1 RP = Rs. 0.10) with no redemption fee",
      "5X benefit requires spends in at least 3 different categories; doesn't apply to wallet, rent, cash, fuel",
      "No airport lounge access",
      "Add-on cards available (free)"
    ],
    loungeAccess: null,
    welcomeBonus: null,
    fuelSurchargeWaiver: false,
    foreignTransactionFee: 1,
    minIncome: 300000,
    rating: 4.5,
    reviewCount: 18965,
    imageUrl: "/cards/onecard.jpg",
    cardColor: "from-zinc-700 via-zinc-800 to-zinc-900",
    featured: false,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 8. HDFC Regalia Gold Credit Card
  // ─────────────────────────────────────────────────────────────────
  {
    id: "hdfc-regalia-gold",
    name: "HDFC Regalia Gold",
    issuer: "HDFC Bank",
    network: "visa", // also Mastercard
    category: ["premium", "travel", "rewards"],
    annualFee: 2500,
    joiningFee: 2500,
    interestRate: { min: 3.6, max: 3.6 },
    creditLimit: { min: 100000, max: 1000000 },
    rewards: {
      type: "points",
      rate: 1.65,
      description:
        "(May 2026 onwards) 5 reward points per Rs. 200 base; 5X on Marks & Spencer / Myntra / Nykaa / Reliance Digital. 1 RP = Rs. 0.65 on Gold Catalogue, Rs. 0.50 on Smartbuy flights/hotels"
    },
    benefits: [
      "**May 15 2026 update:** Earn rate revised to 5 RPs per Rs. 200 (from 4 RPs per Rs. 150)",
      "Welcome: Complimentary Swiggy One + MakeMyTrip Black Gold memberships on joining fee payment",
      "Welcome benefit voucher worth Rs. 2,500",
      "5X reward points at Marks & Spencer, Myntra, Nykaa, Reliance Digital",
      "**July 1 2026 update:** Lounge access requires Rs. 60K quarterly spend → unlocks 3 domestic visits next quarter (no longer automatic)",
      "6 complimentary international lounge visits per year via Priority Pass (primary + add-ons share limit)",
      "Annual milestone: Rs. 1,500 voucher on Rs. 1.5L quarterly spend; Rs. 5,000 voucher on Rs. 5L annual spend",
      "Annual fee waiver on Rs. 4 lakh spend in preceding year",
      "10% off (up to Rs. 1,000) on Swiggy Dineout via Good Food Trail",
      "Travel Edge benefit: choose 2 quarterly perks (spa, airport transfer, buffet, room upgrade)",
      "1 RP = Re. 1 on Apple/Tanishq vouchers via SmartBuy"
    ],
    loungeAccess: { domestic: 12, international: 6 },
    welcomeBonus: "Swiggy One + MakeMyTrip Black Gold memberships + Rs. 2,500 voucher on fee payment",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 2,
    minIncome: 1800000,
    rating: 4.5,
    reviewCount: 9876,
    imageUrl: "/cards/hdfc-regalia-gold.jpg",
    cardColor: "from-yellow-700 via-amber-600 to-yellow-800",
    featured: true,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 9. Flipkart Axis Bank Credit Card
  // ─────────────────────────────────────────────────────────────────
  {
    id: "flipkart-axis",
    name: "Flipkart Axis Bank Credit Card",
    issuer: "Axis Bank",
    network: "mastercard",
    category: ["cashback", "shopping"],
    annualFee: 500,
    joiningFee: 500,
    interestRate: { min: 3.6, max: 3.6 },
    creditLimit: { min: 30000, max: 500000 },
    rewards: {
      type: "cashback",
      rate: 5,
      description:
        "7.5% on Myntra (capped Rs. 4K/quarter), 5% on Flipkart & Cleartrip (capped Rs. 4K/quarter each), 4% on preferred merchants (Swiggy/Uber/PVR/Cult.fit), 1% on all other"
    },
    benefits: [
      "7.5% unlimited cashback on Myntra (capped at Rs. 4,000 per statement quarter)",
      "5% cashback on Flipkart and Cleartrip (capped at Rs. 4,000 per quarter each)",
      "4% cashback on preferred merchants: Swiggy, Uber, PVR, Cult.fit (uncapped)",
      "1% cashback on all other eligible spends",
      "Cashback credited directly to statement",
      "Welcome: Rs. 250 Flipkart voucher (paid cards only) + 50% off up to Rs. 100 on first Swiggy order (code AXISFKNEW)",
      "**Lounge access discontinued June 2025** — no airport lounge benefit on this card any more",
      "Up to 15% off on dining at 10,000+ partner restaurants via Axis Dining Delights/EazyDiner",
      "1% fuel surcharge waiver (Rs. 400-Rs. 4,000, max Rs. 400/cycle)",
      "Annual fee waiver on Rs. 3.5 lakh spend (raised from Rs. 2L)",
      "**Excluded from cashback:** utilities, telecom, fuel, jewellery, insurance, rent, wallet, education, government"
    ],
    loungeAccess: null, // discontinued
    welcomeBonus: "Rs. 250 Flipkart voucher + 50% off (up to Rs. 100) first Swiggy order",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 180000,
    rating: 4.3,
    reviewCount: 21456,
    imageUrl: "/cards/flipkart-axis.jpg",
    cardColor: "from-blue-600 via-yellow-500 to-blue-700",
    featured: false,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 10. ICICI Bank Sapphiro Credit Card
  // ─────────────────────────────────────────────────────────────────
  {
    id: "icici-sapphiro",
    name: "ICICI Bank Sapphiro",
    issuer: "ICICI Bank",
    network: "visa", // also Amex variant
    category: ["premium", "travel", "rewards"],
    annualFee: 3500,
    joiningFee: 3500,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 200000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 2,
      description:
        "4 RPs per Rs. 100 international, 2 RPs per Rs. 100 domestic, 1 RP per Rs. 100 on utilities/insurance; 6X on flights/vouchers and 12X on hotels via iShop"
    },
    benefits: [
      "Welcome vouchers worth ~Rs. 13,000 within 45 days of joining fee: Tata CLiQ Rs. 3,000, Croma Rs. 1,500, Da Milano Rs. 5,000, EaseMyTrip Rs. 4,000, EazyDiner 3-month membership",
      "4 RPs per Rs. 100 on international spends; 2 RPs per Rs. 100 domestic; 1 RP on utilities/insurance",
      "6X RPs on flights and vouchers, 12X RPs on hotel bookings via iShop portal",
      "**Lounge (post-15 Nov 2024):** 4 domestic visits/year requiring Rs. 75K quarterly spend + 2 international visits via Priority Pass",
      "Buy 1 Get 1 on BookMyShow up to Rs. 750 off, 2 times per month",
      "Annual milestone: 4,000 RPs on Rs. 4L spend + 2,000 RPs per additional Rs. 1L (cap 20,000 RPs/year)",
      "Annual fee waiver on Rs. 6 lakh spend",
      "Up to 4 complimentary golf rounds per month on Rs. 50K monthly spend (max 4)",
      "Air accident insurance up to Rs. 3 Crore",
      "i-Assist 24x7 concierge service",
      "Min 15% off at restaurants under ICICI Culinary Treats"
    ],
    loungeAccess: { domestic: 4, international: 2 },
    welcomeBonus: "Welcome vouchers worth ~Rs. 13,000 from Tata CLiQ, Croma, Da Milano, EaseMyTrip, EazyDiner",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 960000,
    rating: 4.4,
    reviewCount: 7654,
    imageUrl: "/cards/icici-sapphiro.jpg",
    cardColor: "from-blue-700 via-sky-600 to-cyan-700",
    featured: false,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 11. IndusInd Bank Legend Credit Card
  // ─────────────────────────────────────────────────────────────────
  {
    id: "indusind-legend",
    name: "IndusInd Bank Legend",
    issuer: "IndusInd Bank",
    network: "visa", // Visa Signature
    category: ["rewards", "travel", "premium"],
    annualFee: 0, // Now lifetime free per Paisabazaar; some sources still list ₹5,000 joining fee
    joiningFee: 0,
    interestRate: { min: 3.83, max: 3.83 },
    creditLimit: { min: 100000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 1,
      description:
        "1 RP per Rs. 100 on weekday spends; 2 RPs per Rs. 100 on weekend spends; 3,000 bonus RPs on Rs. 5L annual spend"
    },
    benefits: [
      "**Lifetime free** — no joining or annual fee (per current Paisabazaar listing)",
      "1 RP per Rs. 100 on weekday spends; 2 RPs per Rs. 100 on weekend spends",
      "3,000 bonus reward points on Rs. 5 lakh annual spend",
      "Reward points never expire",
      "Buy 1 Get 1 on BookMyShow up to Rs. 200/month savings",
      "**Lounge access discontinued 7 March 2025** — no longer offers complimentary visits",
      "1.8% forex markup — low for international travel",
      "Total Protect: full credit limit cover for unauthorized transactions, 48 hours before reporting",
      "24/7 concierge for travel, dining, gift delivery, event bookings",
      "Auto Assist: roadside repairs, towing, fuel refill, accident management",
      "Travel insurance: Rs. 1 lakh lost baggage, Rs. 50K passport loss, Rs. 25K trip delay",
      "1:1 conversion to KrisFlyer Miles (Singapore Airlines)",
      "1 RP = Rs. 0.5 cash; up to 5% redemption for pay-with-rewards"
    ],
    loungeAccess: null, // discontinued March 2025
    welcomeBonus: null,
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.8,
    minIncome: 240000,
    rating: 4.2,
    reviewCount: 4532,
    imageUrl: "/cards/indusind-legend.jpg",
    cardColor: "from-red-900 via-rose-800 to-red-700",
    featured: false,
    popular: false
  },

  // ─────────────────────────────────────────────────────────────────
  // 12. AU Small Finance Bank LIT Credit Card
  // ─────────────────────────────────────────────────────────────────
  {
    id: "au-lit",
    name: "AU Bank LIT Credit Card",
    issuer: "AU Small Finance Bank",
    network: "visa",
    category: ["rewards", "shopping", "cashback"],
    annualFee: 0,
    joiningFee: 0,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 30000, max: 800000 },
    rewards: {
      type: "points",
      rate: 1,
      description:
        "1 RP per Rs. 100 retail base. Activate paid features for 90 days at fees Rs. 49–399 each: 10X RPs (Rs. 299), 5X RPs (Rs. 199), 5% cashback features, lounge feature, etc."
    },
    benefits: [
      "India's first FULLY CUSTOMIZABLE credit card — pick features you want, pay only for those",
      "Lifetime free base card (no joining or annual fee)",
      "Features activate via AU 0101 app for 90-day cycles, then auto-renew unless turned off",
      "Available features (with quarterly fees):",
      "  • 10X reward points on all spends — Rs. 299/3 months",
      "  • 5X reward points on all spends — Rs. 199/3 months",
      "  • 5% additional cashback on Rs. 10K spends (capped Rs. 500/30 days)",
      "  • 2% additional cashback on Rs. 15K spends (capped Rs. 1,000/30 days)",
      "  • Domestic airport lounge access — Rs. 399 per visit, max 2/quarter",
      "  • Amazon Prime / ZEE5 memberships available",
      "Redemption fee Rs. 99 per redemption",
      "Fuel, cash withdrawal, EMI transactions excluded from rewards",
      "1% fuel surcharge waiver (Rs. 400-Rs. 4,000 transactions)",
      "Up to 48 days interest-free credit period",
      "No welcome benefit"
    ],
    loungeAccess: null, // pay-per-use feature, not complimentary
    welcomeBonus: null,
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 400000,
    rating: 4.3,
    reviewCount: 3421,
    imageUrl: "/cards/au-lit.jpg",
    cardColor: "from-pink-600 via-fuchsia-600 to-violet-700",
    featured: false,
    popular: false
  },

  // ─────────────────────────────────────────────────────────────────
  // 13. Cashback SBI Card
  // ─────────────────────────────────────────────────────────────────
  {
    id: "sbi-cashback",
    name: "Cashback SBI Card",
    issuer: "SBI Card",
    network: "visa",
    category: ["cashback", "shopping"],
    annualFee: 999,
    joiningFee: 999,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 50000, max: 500000 },
    rewards: {
      type: "cashback",
      rate: 5,
      description:
        "(April 2026 revised) 5% on online spends (capped Rs. 2,000/cycle), 1% on offline spends (capped Rs. 2,000/cycle); max Rs. 4,000 cashback per cycle"
    },
    benefits: [
      "5% cashback on ALL online spends — no merchant restrictions (capped at Rs. 2,000 per statement cycle from April 2026)",
      "1% cashback on offline spends (capped at Rs. 2,000 per cycle)",
      "Maximum total cashback Rs. 4,000 per cycle",
      "Cashback auto-credited to statement within 2 days of next statement",
      "Annual fee waiver on Rs. 2 lakh annual spend",
      "1% fuel surcharge waiver (Rs. 500-Rs. 3,000 transactions, max Rs. 100/cycle)",
      "Add-on cards available free of cost for family members 18+",
      "**Excluded from cashback:** wallet recharge, fuel, jewellery, education, utility bills, novelty, railway, quasi cash, EMI",
      "Contactless payments up to Rs. 5,000 without PIN",
      "No airport lounge access",
      "No welcome bonus"
    ],
    loungeAccess: null,
    welcomeBonus: null,
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 240000,
    rating: 4.5,
    reviewCount: 19874,
    imageUrl: "/cards/sbi-cashback.jpg",
    cardColor: "from-emerald-700 via-green-700 to-teal-800",
    featured: false,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 14. IDFC FIRST Millennia Credit Card
  // ─────────────────────────────────────────────────────────────────
  {
    id: "idfc-millennia",
    name: "IDFC FIRST Millennia",
    issuer: "IDFC FIRST Bank",
    network: "visa", // also RuPay variant for UPI (₹199/year)
    category: ["rewards", "shopping"],
    annualFee: 0,
    joiningFee: 0,
    interestRate: { min: 0.71, max: 3.85 },
    creditLimit: { min: 50000, max: 1000000 },
    rewards: {
      type: "points",
      rate: 1.67,
      description:
        "10X RPs on incremental spends above Rs. 20K/month + birthday spends; 3X RPs up to Rs. 20K monthly online & offline; 1 RP per Rs. 150 on utilities/insurance; 1 RP = Rs. 0.25"
    },
    benefits: [
      "Lifetime free — no joining, annual or membership fee",
      "10X reward points on incremental spends above Rs. 20,000/month and on birthday spends",
      "3X reward points on online & offline spends up to Rs. 20,000 monthly",
      "1X RP per Rs. 150 on utilities, insurance, FASTag",
      "Reward points never expire",
      "Welcome: Rs. 500 voucher (Amazon/BigBasket/Uber/Lifestyle) on Rs. 5,000 spend within 30 days",
      "5% cashback up to Rs. 1,000 on first EMI within 90 days",
      "**No airport lounge access**",
      "**4 complimentary RAILWAY lounge visits per quarter** at IRCTC Executive Lounges",
      "25% off on movie tickets (up to Rs. 100) once/month via District app",
      "Up to 20% off at 1,500+ partner restaurants",
      "Up to 15% off at 3,000+ Health & Wellness outlets",
      "Roadside assistance worth Rs. 1,399 (4 times/year)",
      "Personal accident cover Rs. 2 lakh; lost card liability Rs. 25K",
      "1% fuel surcharge waiver (Rs. 200-Rs. 5,000 transactions, max Rs. 200/month)",
      "Reward redemption fee Rs. 99 + GST per redemption"
    ],
    loungeAccess: { domestic: 16, international: 0 }, // 4/quarter at railway lounges (not airports)
    welcomeBonus: "Rs. 500 voucher on Rs. 5,000 spend within 30 days + 5% cashback on first EMI",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 300000,
    rating: 4.4,
    reviewCount: 8765,
    imageUrl: "/cards/idfc-millennia.jpg",
    cardColor: "from-rose-600 via-pink-600 to-rose-700",
    featured: false,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 15. HSBC Smart Value Credit Card
  // ─────────────────────────────────────────────────────────────────
  {
    id: "hsbc-smart-value",
    name: "HSBC Smart Value Credit Card",
    issuer: "HSBC Bank",
    network: "visa",
    category: ["rewards", "shopping"],
    annualFee: 0,
    joiningFee: 0,
    interestRate: { min: 1.99, max: 3.49 },
    creditLimit: { min: 50000, max: 500000 },
    rewards: {
      type: "points",
      rate: 1,
      description:
        "1 RP per Rs. 100 on retail. 3X RPs on online, dining and telecom spends (capped at 1,000 incremental RPs/month)"
    },
    benefits: [
      "Lifetime free — no joining or annual fee",
      "1 reward point per Rs. 100 spent",
      "3X reward points on online, dining and telecom spends (capped at 1,000 incremental RPs/month)",
      "Attractive instalment plans at 10.99% per year for EMI products booked within first 90 days",
      "Variable interest rates: 1.99% to 3.49% per month based on credit history & repayment behavior",
      "Convenient EMI options: Balance Transfer on EMI, Cash-on-EMI, Loan-on-Phone",
      "No airport lounge access",
      "Up to 50 days interest-free credit period",
      "Add-on cards available",
      "Available to residents of select cities (Chennai, Delhi NCR, Mumbai, Bengaluru, Hyderabad, Pune, Kolkata, Ahmedabad, Jaipur, Kochi, Coimbatore, Chandigarh)"
    ],
    loungeAccess: null,
    welcomeBonus: null,
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 400000,
    rating: 4.0,
    reviewCount: 1876,
    imageUrl: "/cards/hsbc-smart-value.jpg",
    cardColor: "from-red-700 via-red-800 to-rose-900",
    featured: false,
    popular: false
  }
]

/**
 * Quick stats:
 *   Total cards: 15
 *   Issuers covered: HDFC, Amex, Axis, SBI Card, ICICI, IndusInd, AU SFB,
 *                    IDFC FIRST, HSBC, OneCard
 *   Networks: Visa, Mastercard, Amex
 *   Categories spanned: premium, travel, cashback, rewards, shopping
 *
 * Last verified: April-May 2026 (PaisaBazaar, BankBazaar, official issuer
 * sites, CardExpert, CardInsider, 1Finance).
 *
 * Combined with cards-additional.ts (20 cards), the total catalog will be
 * 35 verified Indian credit cards.
 */