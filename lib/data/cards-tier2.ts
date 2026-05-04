/**
 * TIER 2 — 50 MORE INDIAN CREDIT CARDS — CredStack
 *
 * This file adds 50 mainstream cards beyond the original 35 already in
 * `cards-original-verified.ts` (15) + `cards-additional.ts` (20).
 * Combined catalog after this file: 85 cards covering ~95% of cards
 * Indian users actually compare in 2026.
 *
 * --------------------------------------------------------------------------
 * COVERAGE NOTES
 * --------------------------------------------------------------------------
 * • HDFC (8): MoneyBack+, IRCTC, IndianOil, Tata Neu Plus, Swiggy, 6E Rewards XL,
 *             Diners Privilege, Pixel
 * • SBI (5): SimplyCLICK, SimplySAVE, BPCL (regular), Pulse, Reliance PRIME
 * • ICICI (5): Coral, Rubyx, Platinum Chip, MakeMyTrip Signature, HPCL Super Saver
 * • Axis (8): Reserve, Vistara Signature/Infinite (rebadged Maharaja Club),
 *             Privilege, Select, MyZone, IndianOil Premium, Horizon
 * • Amex (3): Platinum Travel, SmartEarn, Platinum Reserve
 * • Kotak (3): League Platinum, IndianOil Kotak, Myntra Kotak
 * • IDFC FIRST (5): Select, Wow, Power, Power+, Mayura
 * • Yes Bank (2): Reserv, Ace
 * • IndusInd (3): Pinnacle World, Tiger, Pioneer Heritage
 * • RBL (3): Insignia Preferred, Icon, Shoprite
 * • Federal (1): Scapia
 * • BoB (2): Eterna, Premier
 * • HSBC (1): Live+
 * • AU SFB (1): Ixigo
 *
 * --------------------------------------------------------------------------
 * MAJOR 2026 CHANGES BAKED IN (verify before launch)
 * --------------------------------------------------------------------------
 * • ICICI announced Jan-Feb 2026 devaluation: rewards capped on transportation,
 *   BookMyShow BOGO requires ₹25K quarterly spend, 2% fee on gaming MCC 5816,
 *   1% fee on wallet loads ≥ ₹5K. Applies to Coral, Rubyx, Sapphiro, Emeralde,
 *   Manchester United, MMT, Adani One, HPCL Super Saver.
 * • Axis Vistara cards: post Vistara-Air India merger (Nov 2024), rebadged as
 *   Maharaja Club. Vistara Infinite no longer available for new applications.
 * • IndusInd Pinnacle: from 1 April 2026, lounge access spend-criteria tracking
 *   begins; from July 2026 quarter, lounges unlocked only on prior-quarter spend.
 * • Citi Premier Miles → Axis Horizon migration completed.
 *
 * --------------------------------------------------------------------------
 * MERGE INSTRUCTIONS
 * --------------------------------------------------------------------------
 * In `lib/data/cards.ts`:
 *
 *   import { originalCardsVerified } from "./cards-original-verified"
 *   import { additionalCards } from "./cards-additional"
 *   import { tier2Cards } from "./cards-tier2"
 *
 *   export const creditCards: CreditCard[] = [
 *     ...originalCardsVerified,
 *     ...additionalCards,
 *     ...tier2Cards,
 *   ]
 */

import type { CreditCard } from "./cards"

export const tier2Cards: CreditCard[] = [
  // ═══════════════════════════════════════════════════════════════════
  // HDFC BANK (8 cards)
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "hdfc-moneyback-plus",
    name: "HDFC MoneyBack+ Credit Card",
    issuer: "HDFC Bank",
    network: "visa",
    category: ["cashback", "shopping"],
    annualFee: 500,
    joiningFee: 500,
    interestRate: { min: 3.6, max: 3.6 },
    creditLimit: { min: 30000, max: 400000 },
    rewards: {
      type: "cashback",
      rate: 3.33,
      description:
        "10X CashPoints (5% value) on Amazon, Flipkart, BigBasket, Reliance Smart, Swiggy; 5X on EMI spends; 2 CashPoints/₹150 on others. 1 CP = ₹0.25"
    },
    benefits: [
      "10X CashPoints on Amazon, Flipkart, BigBasket, Reliance Smart Superstore, Swiggy",
      "5X CashPoints on EMI spends at merchant locations",
      "2 CashPoints per ₹150 on all other spends (excl. fuel, wallets, gift cards)",
      "₹500 gift voucher on quarterly spend of ₹50,000",
      "Up to 20% off via Swiggy Dineout at partner restaurants",
      "Annual fee waiver on ₹50,000 spend in preceding year",
      "1% fuel surcharge waiver (₹400-₹5,000 transactions, max ₹250/cycle)",
      "Welcome gift voucher worth ₹500 on fee realization",
      "Up to 50 days interest-free credit period"
    ],
    loungeAccess: null,
    welcomeBonus: "Gift voucher worth ₹500 on payment of joining fee",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 300000,
    rating: 4.3,
    reviewCount: 14523,
    imageUrl: "/cards/hdfc-moneyback-plus.jpg",
    cardColor: "from-orange-600 via-red-600 to-orange-700",
    featured: false,
    popular: true
  },

  {
    id: "hdfc-irctc",
    name: "IRCTC HDFC Bank Credit Card",
    issuer: "HDFC Bank",
    network: "rupay",
    category: ["travel", "rewards"],
    annualFee: 500,
    joiningFee: 500,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 50000, max: 500000 },
    rewards: {
      type: "points",
      rate: 5,
      description:
        "5% reward points on IRCTC bookings; additional 5% via SmartBuy (total 10%); 1% transaction charge waiver on IRCTC; 1 RP/₹100 on UPI/grocery/dining"
    },
    benefits: [
      "Co-branded RuPay card supporting UPI payments via PhonePe/GPay",
      "Additional 5% cashback on IRCTC train ticket bookings via HDFC SmartBuy",
      "8 complimentary IRCTC Executive Lounge visits per year (2 per quarter)",
      "1% transaction charges waiver on IRCTC website & Rail Connect App (capped ₹1,000/month)",
      "Welcome gift voucher worth ₹500 on activation",
      "Gift voucher worth ₹500 on quarterly spend of ₹30,000+ (effective 1 Jan 2026)",
      "1% fuel surcharge waiver (max ₹250/cycle)",
      "Annual fee waiver on ₹1.5 lakh spend",
      "Best for frequent train travellers"
    ],
    loungeAccess: { domestic: 8, international: 0 }, // 8 IRCTC railway lounges
    welcomeBonus: "Gift voucher worth ₹500 on activation",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 300000,
    rating: 4.2,
    reviewCount: 6543,
    imageUrl: "/cards/hdfc-irctc.jpg",
    cardColor: "from-blue-700 via-indigo-700 to-blue-800",
    featured: false,
    popular: false
  },

  {
    id: "hdfc-indianoil",
    name: "IndianOil HDFC Bank Credit Card",
    issuer: "HDFC Bank",
    network: "rupay",
    category: ["fuel", "rewards"],
    annualFee: 500,
    joiningFee: 500,
    interestRate: { min: 3.6, max: 3.6 },
    creditLimit: { min: 50000, max: 600000 },
    rewards: {
      type: "points",
      rate: 5,
      description:
        "5% Fuel Points on IndianOil outlets (cap 250 FP/month for first 6 mo, 150 FP/month after); 5% on groceries & bills (cap 100 FP/month each); 1 FP/₹150 on others"
    },
    benefits: [
      "Earn up to 50 litres free fuel annually at IndianOil outlets",
      "5% as Fuel Points at IndianOil (cap 250 FP/month first 6 months, then 150)",
      "5% as Fuel Points on groceries and bill payments (cap 100 FP/month each)",
      "1 Fuel Point per ₹150 on all other purchases including UPI",
      "Complimentary IndianOil XTRAREWARDS Program (IXRP) membership",
      "1% fuel surcharge waiver at all fuel stations",
      "Annual fee waiver on ₹50,000 spend in preceding year",
      "Fuel Points valid for 2 years; 1 FP = ₹0.96 max value at IOCL outlets",
      "Up to 4 add-on cards complimentary"
    ],
    loungeAccess: null,
    welcomeBonus: null,
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 300000,
    rating: 4.4,
    reviewCount: 8765,
    imageUrl: "/cards/hdfc-indianoil.jpg",
    cardColor: "from-red-600 via-orange-600 to-yellow-600",
    featured: false,
    popular: true
  },

  {
    id: "hdfc-tata-neu-plus",
    name: "Tata Neu Plus HDFC Bank Credit Card",
    issuer: "HDFC Bank",
    network: "rupay", // also Visa
    category: ["shopping", "rewards"],
    annualFee: 499,
    joiningFee: 499,
    interestRate: { min: 3.6, max: 3.6 },
    creditLimit: { min: 50000, max: 800000 },
    rewards: {
      type: "points",
      rate: 2,
      description:
        "1.5% NeuCoins on Tata brand spends; 1% on non-Tata; +5% extra on Tata Neu app/website (capped 500 NC/month); 1% NeuCoins on UPI via RuPay variant"
    },
    benefits: [
      "1.5% NeuCoins on non-Tata brand spends",
      "5% NeuCoins on Tata Neu app/website on select categories (capped 500 NC/month)",
      "1% NeuCoins on UPI spends including Tata brand spends (RuPay variant)",
      "Welcome 499 NeuCoins on card activation",
      "1 NeuCoin = ₹1 on Tata Neu app/website and partner brands (Westside, BigBasket, Air India, Croma)",
      "8 complimentary domestic airport lounge visits per year (2 per quarter)",
      "1% fuel surcharge waiver",
      "Renewal fee waived on ₹1 lakh spend",
      "Best for Tata ecosystem loyalists (Westside, BigBasket, Croma, Tanishq, Air India)"
    ],
    loungeAccess: { domestic: 8, international: 0 },
    welcomeBonus: "499 NeuCoins on card activation",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 360000,
    rating: 4.3,
    reviewCount: 12876,
    imageUrl: "/cards/hdfc-tata-neu-plus.jpg",
    cardColor: "from-violet-700 via-purple-700 to-violet-800",
    featured: false,
    popular: true
  },

  {
    id: "hdfc-swiggy",
    name: "Swiggy HDFC Bank Credit Card",
    issuer: "HDFC Bank",
    network: "mastercard",
    category: ["cashback", "shopping"],
    annualFee: 500,
    joiningFee: 500,
    interestRate: { min: 3.6, max: 3.6 },
    creditLimit: { min: 30000, max: 500000 },
    rewards: {
      type: "cashback",
      rate: 10,
      description:
        "10% cashback on Swiggy (Food, Instamart, Dineout, Genie); 5% cashback on online spends; 1% on other spends. Cashback as Swiggy Money."
    },
    benefits: [
      "10% cashback on Swiggy app: Food orders, Instamart, Dineout, Genie",
      "5% cashback on online spends across major merchants",
      "1% cashback on other spends",
      "Cashback credited as Swiggy Money (1 SM = ₹1 on Swiggy)",
      "Complimentary 3-month Swiggy One membership on activation",
      "Renewal fee waived on ₹2 lakh annual spend",
      "1% fuel surcharge waiver (max ₹250/cycle)",
      "Up to 50 days interest-free credit period",
      "Best for heavy Swiggy users (food + grocery + dining)"
    ],
    loungeAccess: null,
    welcomeBonus: "3-month Swiggy One Membership worth ₹1,199 on card activation",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 300000,
    rating: 4.5,
    reviewCount: 19654,
    imageUrl: "/cards/hdfc-swiggy.jpg",
    cardColor: "from-orange-500 via-amber-500 to-orange-600",
    featured: false,
    popular: true
  },

  {
    id: "hdfc-6e-rewards-xl",
    name: "6E Rewards XL — IndiGo HDFC Bank Credit Card",
    issuer: "HDFC Bank",
    network: "mastercard",
    category: ["travel", "rewards"],
    annualFee: 1500,
    joiningFee: 1500,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 80000, max: 800000 },
    rewards: {
      type: "points",
      rate: 5,
      description:
        "5% as 6E Rewards on IndiGo bookings; 3% on grocery/dining/entertainment; 2.5% on Tata CLiQ/BMS/Ola; 2% on other spends"
    },
    benefits: [
      "5% as 6E Rewards on spends on IndiGo website and app",
      "3% as 6E Rewards on Grocery, Dining and Entertainment",
      "2.5% as 6E Rewards on Tata CLiQ, BookMyShow, Ola Cabs",
      "2% as 6E Rewards on other spends",
      "Complimentary IndiGo flight ticket worth ₹3,000 on minimum 3 transactions in each of first 3 months",
      "1 complimentary 6E Prime add-on (free seat selection, priority check-in, meal, baggage)",
      "Voucher worth ₹500 on Tata CLiQ/BMS/Ola/Bata on monthly spend of ₹80,000",
      "8 complimentary lounge access worldwide annually (2/quarter)",
      "Lowest forex markup of 2%",
      "Renewal fee waiver on ₹2 lakh annual spend",
      "1 6E Reward = ₹1 redeemable on IndiGo website"
    ],
    loungeAccess: { domestic: 4, international: 4 },
    welcomeBonus: "₹3,000 IndiGo flight voucher + 6E Prime add-on on minimum 3 transactions in first 3 months",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 2,
    minIncome: 600000,
    rating: 4.4,
    reviewCount: 7654,
    imageUrl: "/cards/hdfc-6e-rewards-xl.jpg",
    cardColor: "from-indigo-700 via-blue-700 to-indigo-800",
    featured: false,
    popular: true
  },

  {
    id: "hdfc-diners-privilege",
    name: "HDFC Diners Club Privilege Credit Card",
    issuer: "HDFC Bank",
    network: "discover", // Diners Club International
    category: ["premium", "travel", "rewards"],
    annualFee: 2500,
    joiningFee: 2500,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 200000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 2.67,
      description:
        "4 RPs per ₹150 on retail; up to 10X via SmartBuy capped at 7,500 RPs/month; 5X on Swiggy/Zomato (capped 2,500/month); 1 RP = ₹0.50"
    },
    benefits: [
      "Welcome: Complimentary Swiggy One + Times Prime annual memberships",
      "4 reward points per ₹150 retail spend (~2.67% base value)",
      "Up to 10X reward points via SmartBuy (capped at 7,500 RPs/month)",
      "5X reward points on Swiggy and Zomato (capped at 2,500 RPs/month)",
      "8 complimentary domestic + international lounge visits worldwide per year",
      "Up to 2 complimentary golf games per month (24/year)",
      "Up to 7.5% off via Swiggy Dineout at 20K+ restaurants",
      "1% forex markup — among the lowest in this fee bracket",
      "Renewal fee waiver on ₹4 lakh annual spend",
      "Air accident cover ₹1 Cr; emergency overseas hospitalization ₹15 lakh",
      "Diners Club acceptance via Discover/JCB networks"
    ],
    loungeAccess: { domestic: 8, international: 8 },
    welcomeBonus: "Complimentary Swiggy One + Times Prime annual memberships",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1,
    minIncome: 1800000,
    rating: 4.6,
    reviewCount: 4321,
    imageUrl: "/cards/hdfc-diners-privilege.jpg",
    cardColor: "from-zinc-700 via-zinc-800 to-zinc-900",
    featured: false,
    popular: true
  },

  {
    id: "hdfc-pixel",
    name: "HDFC Pixel Play Credit Card",
    issuer: "HDFC Bank",
    network: "rupay",
    category: ["cashback", "shopping"],
    annualFee: 500,
    joiningFee: 500,
    interestRate: { min: 3.6, max: 3.6 },
    creditLimit: { min: 30000, max: 300000 },
    rewards: {
      type: "cashback",
      rate: 5,
      description:
        "5% cashback on 2 chosen categories; 3% on chosen e-commerce platform (Amazon/Flipkart/PayZapp); 1% on other spends"
    },
    benefits: [
      "RuPay card supporting UPI payments via PhonePe/GPay/Paytm",
      "Choose 2 categories for 5% cashback (dining, travel, grocery, fashion, etc.)",
      "Choose 1 e-commerce platform for 3% cashback (Amazon, Flipkart, or PayZapp)",
      "1% cashback on other spends",
      "Welcome 1,000 CashPoints on card activation",
      "Annual fee waiver on ₹2.5 lakh spend",
      "Customizable card image via app",
      "1% fuel surcharge waiver",
      "Best for users who want UPI + e-commerce cashback combination"
    ],
    loungeAccess: null,
    welcomeBonus: "1,000 CashPoints on card activation",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 360000,
    rating: 4.2,
    reviewCount: 2345,
    imageUrl: "/cards/hdfc-pixel.jpg",
    cardColor: "from-pink-500 via-fuchsia-600 to-violet-700",
    featured: false,
    popular: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // SBI CARD (5 cards)
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "sbi-simplyclick",
    name: "SimplyCLICK SBI Card",
    issuer: "SBI Card",
    network: "visa", // also Mastercard
    category: ["rewards", "shopping"],
    annualFee: 499,
    joiningFee: 499,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 50000, max: 500000 },
    rewards: {
      type: "points",
      rate: 1.25,
      description:
        "10X RPs on Apollo24x7, BookMyShow, Cleartrip, Domino's, Myntra, Netmeds, Swiggy, Yatra, IGP (~2.5% effective); 5X on other online; 1 RP/₹100 offline; 1 RP = ₹0.25"
    },
    benefits: [
      "10X reward points on partner brands: Apollo24x7, BookMyShow, Cleartrip, Domino's, IGP, Myntra, Netmeds, Swiggy, Yatra",
      "5X reward points on all other online purchases",
      "1 reward point per ₹100 on offline spends",
      "Welcome ₹500 Amazon e-gift voucher on fee realization",
      "Cleartrip/Yatra e-voucher worth ₹2,000 on annual spend of ₹1 lakh",
      "Additional ₹2,000 voucher on annual spend of ₹2 lakh (total ₹4,000)",
      "Annual fee waiver on ₹1 lakh annual spend",
      "1% fuel surcharge waiver (₹500-₹3,000, max ₹100/cycle)",
      "1 RP = ₹0.25 against statement",
      "No lounge access; no welcome bonus reward points"
    ],
    loungeAccess: null,
    welcomeBonus: "₹500 Amazon e-gift voucher on payment of joining fee",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 300000,
    rating: 4.3,
    reviewCount: 24567,
    imageUrl: "/cards/sbi-simplyclick.jpg",
    cardColor: "from-blue-600 via-blue-700 to-indigo-700",
    featured: false,
    popular: true
  },

  {
    id: "sbi-simplysave",
    name: "SimplySAVE SBI Card",
    issuer: "SBI Card",
    network: "visa", // also Mastercard, RuPay
    category: ["rewards", "shopping"],
    annualFee: 499,
    joiningFee: 499,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 30000, max: 400000 },
    rewards: {
      type: "points",
      rate: 1.25,
      description:
        "10 RPs per ₹150 on dining, movies, grocery, departmental stores; 1 RP/₹150 on others; RuPay variant supports UPI; 1 RP = ₹0.25"
    },
    benefits: [
      "10 reward points per ₹150 on dining, movies, departmental stores, grocery",
      "1 reward point per ₹150 on all other spends",
      "Welcome 2,000 reward points on spending ₹2,000 in first 60 days",
      "Annual fee waiver on ₹1 lakh annual spend",
      "1% fuel surcharge waiver (₹500-₹3,000, max ₹100/cycle)",
      "RuPay variant supports UPI payments via PhonePe/GPay",
      "Add-on cards free for family 18+",
      "Available at over 24 million outlets worldwide",
      "Best entry-level card for everyday offline spending"
    ],
    loungeAccess: null,
    welcomeBonus: "2,000 reward points on spending ₹2,000 within 60 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 240000,
    rating: 4.2,
    reviewCount: 31234,
    imageUrl: "/cards/sbi-simplysave.jpg",
    cardColor: "from-emerald-600 via-green-600 to-teal-700",
    featured: false,
    popular: true
  },

  {
    id: "sbi-bpcl",
    name: "BPCL SBI Card",
    issuer: "SBI Card",
    network: "visa",
    category: ["fuel", "rewards"],
    annualFee: 499,
    joiningFee: 499,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 50000, max: 500000 },
    rewards: {
      type: "points",
      rate: 4.25,
      description:
        "13X RPs (~3.25%) on BPCL fuel + 1% surcharge waiver = 4.25% value; 5X on dining/movies/grocery; 1 RP/₹100 on others; 1 RP = ₹0.25"
    },
    benefits: [
      "4.25% value back on BPCL fuel (3.25% rewards + 1% surcharge waiver)",
      "13 reward points per ₹100 on BPCL fuel and lubricants (max 1,300 RPs/billing cycle)",
      "5 reward points per ₹100 on dining, departmental stores, grocery, movies (max 5,000 RPs/month)",
      "1 reward point per ₹100 on all other retail purchases",
      "Welcome 2,000 bonus reward points worth ₹500",
      "1% fuel surcharge waiver at BPCL on transactions up to ₹4,000 (max ₹100/cycle)",
      "Annual fee waiver on ₹50,000 annual spend",
      "Add-on cards free for family",
      "Best for car owners using BPCL pumps"
    ],
    loungeAccess: null,
    welcomeBonus: "2,000 bonus reward points worth ₹500 on fee payment",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 300000,
    rating: 4.4,
    reviewCount: 8976,
    imageUrl: "/cards/sbi-bpcl.jpg",
    cardColor: "from-yellow-500 via-orange-500 to-red-600",
    featured: false,
    popular: false
  },

  {
    id: "sbi-pulse",
    name: "SBI Pulse Credit Card",
    issuer: "SBI Card",
    network: "rupay",
    category: ["rewards", "shopping"],
    annualFee: 1499,
    joiningFee: 1499,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 100000, max: 800000 },
    rewards: {
      type: "points",
      rate: 2.5,
      description:
        "10X RPs on chemists, pharmacy, dining, movies (~2.5%); 2 RPs/₹100 on other categories; 1 RP = ₹0.25"
    },
    benefits: [
      "Welcome benefits: Noise ColorFit Pulse 4 Pro Smart Watch worth ₹7,999 + 3-month FitPass Pro + 3-month Netmeds membership",
      "10 reward points per ₹100 on chemists, pharmacy, dining and movies",
      "2 reward points per ₹100 on all other retail purchases",
      "4 complimentary domestic airport lounge visits per year (1/quarter)",
      "Quarterly milestone benefit on ₹90,000 spend",
      "Health-focused features: pharmacy + fitness category emphasis",
      "1% fuel surcharge waiver",
      "RuPay variant supports UPI payments",
      "Annual fee waiver on ₹2 lakh annual spend"
    ],
    loungeAccess: { domestic: 4, international: 0 },
    welcomeBonus: "Noise smart watch worth ₹7,999 + FitPass Pro + Netmeds memberships",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 480000,
    rating: 4.2,
    reviewCount: 3456,
    imageUrl: "/cards/sbi-pulse.jpg",
    cardColor: "from-rose-500 via-pink-500 to-rose-600",
    featured: false,
    popular: false
  },

  {
    id: "sbi-reliance-prime",
    name: "Reliance SBI Card PRIME",
    issuer: "SBI Card",
    network: "visa",
    category: ["rewards", "shopping"],
    annualFee: 2999,
    joiningFee: 2999,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 150000, max: 1000000 },
    rewards: {
      type: "points",
      rate: 2.5,
      description:
        "10X RPs at Reliance Group (Trends, Digital, Smart, Centro, Footprint); 2 RPs/₹100 on others; 1 RP = ₹0.25"
    },
    benefits: [
      "Welcome ₹5,000 voucher from Bata, Hush Puppies, Pantaloons, Aditya Birla Fashion, Shoppers Stop, or Yatra",
      "5 reward points per ₹100 on dining, groceries, departmental stores",
      "2 reward points per ₹100 on all other categories",
      "2 free movie tickets worth ₹250 each per month from BookMyShow",
      "Complimentary Priority Pass + Club Vistara Silver memberships",
      "Up to 50,000 reward points worth ₹12,500/year on milestone spends",
      "Co-branded Reliance Group benefits across Reliance Trends, Reliance Digital, Reliance Smart, Reliance Centro, Reliance Footprint",
      "Quarterly milestone vouchers from Pizza Hut/Yatra/Pantaloons (₹50K and ₹5L spend)",
      "1.99% forex markup",
      "Concierge services"
    ],
    loungeAccess: { domestic: 8, international: 4 },
    welcomeBonus: "Welcome voucher worth ₹5,000 from Bata/Pantaloons/Aditya Birla/Shoppers Stop/Yatra",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.99,
    minIncome: 600000,
    rating: 4.3,
    reviewCount: 2987,
    imageUrl: "/cards/sbi-reliance-prime.jpg",
    cardColor: "from-blue-800 via-indigo-800 to-violet-900",
    featured: false,
    popular: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // ICICI BANK (5 cards) — Note: Major Jan-Feb 2026 devaluations
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "icici-coral",
    name: "ICICI Bank Coral Credit Card",
    issuer: "ICICI Bank",
    network: "visa", // also Mastercard, RuPay variant
    category: ["rewards", "shopping"],
    annualFee: 500,
    joiningFee: 500,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 30000, max: 400000 },
    rewards: {
      type: "points",
      rate: 0.5,
      description:
        "2 RPs per ₹100 on most spends; 1 RP/₹100 on utilities/insurance; 1 RP = ₹0.25. Transportation MCCs capped at ₹10K/month rewards (post Feb 2026)"
    },
    benefits: [
      "Entry-level Gemstone series card",
      "2 reward points per ₹100 on most retail spends",
      "1 reward point per ₹100 on utilities and insurance",
      "**Jan-Feb 2026 update:** Transportation rewards capped at ₹10,000/month",
      "**Jan-Feb 2026 update:** BookMyShow BOGO requires ₹25K spend in preceding quarter",
      "**Jan 2026 update:** 2% fee on gaming MCC 5816 (Dream11, MPL, Rummy)",
      "**Jan 2026 update:** 1% fee on wallet loads ≥ ₹5,000 (Amazon Pay, Paytm, MobiKwik)",
      "1 complimentary railway lounge visit per quarter (4/year)",
      "1% fuel surcharge waiver at HPCL pumps (₹400-₹4,000, on ICICI POS)",
      "Annual milestone: 2,000 RPs on ₹2L spend + 1,000 RPs per additional ₹1L (cap 10,000 RPs/year)",
      "Annual fee waiver on ₹1.5 lakh spend",
      "RuPay variant supports UPI"
    ],
    loungeAccess: null, // No airport lounges; only railway
    welcomeBonus: null,
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 300000,
    rating: 4.0,
    reviewCount: 15432,
    imageUrl: "/cards/icici-coral.jpg",
    cardColor: "from-orange-500 via-red-500 to-orange-600",
    featured: false,
    popular: true
  },

  {
    id: "icici-rubyx",
    name: "ICICI Bank Rubyx Credit Card",
    issuer: "ICICI Bank",
    network: "visa", // also Amex variant
    category: ["rewards", "travel"],
    annualFee: 3000,
    joiningFee: 3000,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 200000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 1,
      description:
        "4 RPs per ₹100 on Visa/Amex (international 6 RPs); 1 RP = ₹0.25; transportation MCCs capped at ₹20K/month (post Feb 2026)"
    },
    benefits: [
      "Welcome benefits worth ~₹5,000 (Tata CLiQ + Croma vouchers)",
      "4 reward points per ₹100 on Visa transactions (6 RPs on Amex variant)",
      "6 reward points per ₹100 on international spends",
      "**Jan-Feb 2026 update:** Transportation rewards capped at ₹20K/month",
      "Buy-1-Get-1 on BookMyShow (max ₹500 off, twice a month)",
      "4 complimentary domestic + 2 international airport lounge visits per year",
      "Up to 4 complimentary golf rounds per month on ₹50K monthly spend",
      "Air accident cover ₹3 Crore",
      "Up to 15% off via ICICI Culinary Treats at 2,500+ restaurants",
      "Annual fee waiver on ₹6 lakh spend",
      "1 RP = ₹0.25 against statement"
    ],
    loungeAccess: { domestic: 4, international: 2 },
    welcomeBonus: "Welcome vouchers worth ~₹5,000 (Tata CLiQ, Croma)",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 720000,
    rating: 4.2,
    reviewCount: 5432,
    imageUrl: "/cards/icici-rubyx.jpg",
    cardColor: "from-rose-700 via-red-700 to-pink-800",
    featured: false,
    popular: false
  },

  {
    id: "icici-platinum-chip",
    name: "ICICI Bank Platinum Chip Credit Card",
    issuer: "ICICI Bank",
    network: "visa",
    category: ["rewards", "shopping"],
    annualFee: 199,
    joiningFee: 0,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 25000, max: 250000 },
    rewards: {
      type: "points",
      rate: 0.5,
      description:
        "2 RPs per ₹100 on retail (excl. fuel); 1 RP = ₹0.25"
    },
    benefits: [
      "Entry-level card with embedded chip security",
      "2 reward points per ₹100 on retail transactions (excl. fuel)",
      "**Feb 2026 update:** BookMyShow BOGO benefit removed for Instant Platinum cards",
      "Annual fee of ₹199 waived on ₹50,000 spend in preceding year",
      "1% fuel surcharge waiver at HPCL pumps (₹400-₹4,000)",
      "Up to 50 days interest-free credit period",
      "Add-on cards available",
      "Best for first-time credit card users with low credit limit needs"
    ],
    loungeAccess: null,
    welcomeBonus: null,
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 200000,
    rating: 3.8,
    reviewCount: 8765,
    imageUrl: "/cards/icici-platinum-chip.jpg",
    cardColor: "from-slate-500 via-slate-600 to-slate-700",
    featured: false,
    popular: false
  },

  {
    id: "icici-mmt-signature",
    name: "MakeMyTrip ICICI Bank Signature Credit Card",
    issuer: "ICICI Bank",
    network: "visa",
    category: ["travel", "rewards"],
    annualFee: 0, // No annual fee
    joiningFee: 2500,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 150000, max: 1000000 },
    rewards: {
      type: "points",
      rate: 4,
      description:
        "MMT cards are MMT-loyalty focused; my Cash on hotels/flights via MMT app earn enhanced rates; 1.5 my Cash per ₹100 on retail; 0.99% DCC fee"
    },
    benefits: [
      "**Note: New applications no longer accepted as of late 2025; existing cardholders only**",
      "Welcome: MMTBLACK Platinum Membership + MakeMyTrip holiday voucher up to ₹2,500",
      "1 complimentary international airport lounge visit per quarter via Priority Pass (post 15 Nov 2024)",
      "8 complimentary domestic lounge visits per year (2/quarter)",
      "Reduced 0.99% Dynamic Currency Conversion (DCC) markup (post Jan 2026 update)",
      "Enhanced my Cash earnings on MakeMyTrip flights, hotels, holidays",
      "Discounts on partner hotels and flights via MMT app",
      "Best for frequent MMT users with high travel spend",
      "1% fuel surcharge waiver at HPCL pumps"
    ],
    loungeAccess: { domestic: 8, international: 4 }, // 1/quarter international
    welcomeBonus: "MMTBLACK Platinum membership + MMT holiday voucher up to ₹2,500",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 0.99, // post Jan 2026
    minIncome: 600000,
    rating: 4.1,
    reviewCount: 3210,
    imageUrl: "/cards/icici-mmt-signature.jpg",
    cardColor: "from-red-700 via-rose-700 to-red-800",
    featured: false,
    popular: false
  },

  {
    id: "icici-hpcl-supersaver",
    name: "ICICI Bank HPCL Super Saver Credit Card",
    issuer: "ICICI Bank",
    network: "visa",
    category: ["fuel", "rewards"],
    annualFee: 500,
    joiningFee: 500,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 50000, max: 500000 },
    rewards: {
      type: "points",
      rate: 4,
      description:
        "4% value back on HPCL fuel (cap ₹100/month cashback); 6 RPs/₹100 on grocery/dining/dept stores; 2 RPs/₹100 on others; 1 RP = ₹0.25"
    },
    benefits: [
      "4% value back on HPCL fuel: 5% cashback (capped ₹100/month) at HPCL on ICICI POS + IMSL machines",
      "6 reward points per ₹100 on grocery, dining, departmental stores, utilities",
      "2 reward points per ₹100 on other retail (excl. fuel)",
      "Welcome 2,000 reward points + ₹2,000 spend within 60 days",
      "**Jan 2026 update:** Reward points on insurance capped at ₹40,000/month",
      "**Jan 2026 update:** Complimentary BookMyShow benefit removed",
      "Annual fee waiver on ₹1.5 lakh spend",
      "1% fuel surcharge waiver at HPCL on transactions ₹400-₹4,000",
      "Best for HPCL fuel users with grocery/dining spend"
    ],
    loungeAccess: { domestic: 2, international: 0 }, // limited access
    welcomeBonus: "2,000 reward points on ₹2,000 spend within 60 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 360000,
    rating: 4.0,
    reviewCount: 4567,
    imageUrl: "/cards/icici-hpcl-supersaver.jpg",
    cardColor: "from-cyan-600 via-teal-600 to-cyan-700",
    featured: false,
    popular: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // AXIS BANK (8 cards)
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "axis-reserve",
    name: "Axis Bank Reserve Credit Card",
    issuer: "Axis Bank",
    network: "mastercard", // World Elite
    category: ["premium", "travel", "rewards"],
    annualFee: 50000,
    joiningFee: 50000,
    interestRate: { min: 3.0, max: 3.0 },
    creditLimit: { min: 1000000, max: 5000000 },
    rewards: {
      type: "points",
      rate: 7.5,
      description:
        "15 EDGE points per ₹200 on most spends; 50 EDGE points per ₹200 on Axis Travel EDGE; 1 EDGE point = ₹0.20-0.40"
    },
    benefits: [
      "Welcome: Choice of luxury vouchers + complimentary memberships worth ~₹50,000",
      "15 EDGE points per ₹200 on retail (~7.5% effective at premium redemption)",
      "50 EDGE points per ₹200 on Axis Travel EDGE portal",
      "Unlimited complimentary domestic airport lounge access",
      "Unlimited complimentary international airport lounge access via Priority Pass + 4 guest visits/year",
      "Complimentary unlimited golf games and lessons globally",
      "**Apr 2024 update:** Complimentary luxury airport transfers DISCONTINUED",
      "**Oct 2025 update:** Oberoi hotels offers DISCONTINUED",
      "Up to 50% off at 1,800+ partner restaurants in India",
      "Air accident cover ₹6 Crore",
      "24x7 dedicated luxury concierge service",
      "Forex markup of 1.5%",
      "Targeted at HNI customers"
    ],
    loungeAccess: { domestic: "unlimited", international: "unlimited" },
    welcomeBonus: "Luxury voucher choice + memberships worth ~₹50,000",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.5,
    minIncome: 4800000,
    rating: 4.5,
    reviewCount: 1432,
    imageUrl: "/cards/axis-reserve.jpg",
    cardColor: "from-stone-900 via-zinc-900 to-black",
    featured: true,
    popular: false
  },

  {
    id: "axis-vistara-signature",
    name: "Axis Bank Vistara Signature Credit Card",
    issuer: "Axis Bank",
    network: "visa",
    category: ["travel", "rewards"],
    annualFee: 3000,
    joiningFee: 3000,
    interestRate: { min: 3.0, max: 3.0 },
    creditLimit: { min: 200000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 2,
      description:
        "4 CV/Maharaja points per ₹200 (post Air India merger); 1 CV point ≈ ₹1 on flight redemption; new bookings now via Air India Maharaja Club"
    },
    benefits: [
      "**Post Vistara-Air India merger (Nov 2024):** Renamed to Maharaja Club, points convert to Maharaja points",
      "Welcome: Complimentary domestic Premium Economy ticket voucher",
      "4 Club Vistara/Maharaja points per ₹200 spend",
      "Up to 4 Premium Economy ticket vouchers on milestone spends",
      "Complimentary Club Vistara Silver/Maharaja Club membership (priority check-in, extra baggage)",
      "8 complimentary domestic airport lounge visits per year (subject to spend criteria)",
      "25% off (up to ₹800) at partner restaurants via EazyDiner",
      "3 complimentary golf rounds at picturesque courses in India",
      "Purchase Protection Cover up to ₹1 lakh + USD 300 for travel docs/baggage delay",
      "Annual fee waiver on ₹2 lakh annual spend"
    ],
    loungeAccess: { domestic: 8, international: 0 },
    welcomeBonus: "Complimentary Premium Economy ticket voucher on fee payment",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 600000,
    rating: 4.0,
    reviewCount: 6543,
    imageUrl: "/cards/axis-vistara-signature.jpg",
    cardColor: "from-violet-700 via-purple-800 to-violet-900",
    featured: false,
    popular: false
  },

  {
    id: "axis-privilege",
    name: "Axis Bank Privilege Credit Card",
    issuer: "Axis Bank",
    network: "visa",
    category: ["rewards", "travel"],
    annualFee: 1500,
    joiningFee: 1500,
    interestRate: { min: 3.0, max: 3.0 },
    creditLimit: { min: 150000, max: 1000000 },
    rewards: {
      type: "points",
      rate: 0.83,
      description:
        "10 EDGE Reward points per ₹200 spent; 1 EDGE point = ~₹0.20"
    },
    benefits: [
      "Welcome: 12,500 EDGE Reward Points worth ₹2,500 on activation",
      "Additional 10,000 EDGE Reward Points on ₹2.5 lakh annual spend",
      "10 EDGE points per ₹200 on retail spends",
      "8 complimentary domestic airport lounge visits per year (2/quarter)",
      "Up to 4 complimentary international lounge visits via Priority Pass",
      "Up to 25% off at 4,000+ partner restaurants via Axis Dining Delights",
      "Joining fee waived for Priority Banking customers",
      "Annual fee waiver on ₹2.5 lakh annual spend",
      "Concierge services for travel/dining bookings",
      "Best mid-tier card for moderate spenders"
    ],
    loungeAccess: { domestic: 8, international: 4 },
    welcomeBonus: "12,500 EDGE Reward Points worth ₹2,500 on activation",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 600000,
    rating: 4.2,
    reviewCount: 7654,
    imageUrl: "/cards/axis-privilege.jpg",
    cardColor: "from-indigo-700 via-blue-700 to-indigo-800",
    featured: false,
    popular: false
  },

  {
    id: "axis-select",
    name: "Axis Bank Select Credit Card",
    issuer: "Axis Bank",
    network: "visa",
    category: ["rewards", "travel"],
    annualFee: 3000,
    joiningFee: 3000,
    interestRate: { min: 3.0, max: 3.0 },
    creditLimit: { min: 200000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 1.6,
      description:
        "20 EDGE points per ₹200 on retail (until ₹20K monthly); 10 EDGE points per ₹200 thereafter; 1 EDGE point = ₹0.20"
    },
    benefits: [
      "Welcome: 10,000 EDGE Reward Points worth ₹2,000 on first transaction",
      "20 EDGE points per ₹200 on retail spends up to ₹20,000/month (~2% return)",
      "10 EDGE points per ₹200 on retail spends thereafter",
      "5,000 bonus EDGE Reward Points annually based on spends",
      "Complimentary movie tickets monthly via District app",
      "Exclusive discount on BigBasket and Swiggy",
      "Complimentary domestic airport lounge access",
      "Complimentary Priority Pass membership for international lounge visits",
      "Complimentary EazyDiner Prime + dining benefits",
      "Annual fee waiver on ₹6 lakh spend",
      "Best for lifestyle-focused users"
    ],
    loungeAccess: { domestic: 8, international: 8 },
    welcomeBonus: "10,000 EDGE Reward Points worth ₹2,000 on first transaction",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 720000,
    rating: 4.3,
    reviewCount: 5432,
    imageUrl: "/cards/axis-select.jpg",
    cardColor: "from-cyan-700 via-blue-700 to-cyan-800",
    featured: false,
    popular: false
  },

  {
    id: "axis-myzone",
    name: "Axis Bank MyZone Credit Card",
    issuer: "Axis Bank",
    network: "mastercard",
    category: ["rewards", "shopping"],
    annualFee: 500,
    joiningFee: 500,
    interestRate: { min: 3.4, max: 3.4 },
    creditLimit: { min: 30000, max: 400000 },
    rewards: {
      type: "points",
      rate: 0.4,
      description:
        "4 EDGE Reward points per ₹200 spent (~0.4% base rate); 1 EDGE point = ~₹0.20"
    },
    benefits: [
      "Welcome: SonyLIV Premium 12-month membership worth ₹999 on first spend within 30 days",
      "Buy-1-Get-1 on movie tickets via BookMyShow (max ₹200 off/month)",
      "4 EDGE Reward Points per ₹200 spend",
      "₹120 off on Swiggy orders, twice a month (max ₹240/month)",
      "4 complimentary domestic airport lounge visits per year (1/quarter)",
      "Up to 15% off at 4,000+ partner restaurants via Dining Delights",
      "1% fuel surcharge waiver",
      "Annual fee waiver on ₹50,000 annual spend",
      "Affordable entry-level lifestyle card"
    ],
    loungeAccess: { domestic: 4, international: 0 },
    welcomeBonus: "12-month SonyLIV Premium membership on first spend within 30 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 240000,
    rating: 4.1,
    reviewCount: 11234,
    imageUrl: "/cards/axis-myzone.jpg",
    cardColor: "from-fuchsia-600 via-pink-600 to-rose-700",
    featured: false,
    popular: true
  },

  {
    id: "axis-indianoil",
    name: "IndianOil Premium Axis Bank Credit Card",
    issuer: "Axis Bank",
    network: "visa",
    category: ["fuel", "rewards"],
    annualFee: 1000,
    joiningFee: 1000,
    interestRate: { min: 3.4, max: 3.4 },
    creditLimit: { min: 80000, max: 800000 },
    rewards: {
      type: "points",
      rate: 4,
      description:
        "6 EDGE Miles per ₹150 at IndianOil outlets (~6% fuel return); 2 EDGE Miles per ₹150 on grocery; 1 EDGE Mile per ₹150 on others; redeemable at IOCL"
    },
    benefits: [
      "**Post Citi-Axis migration:** IndianOil Citi → IndianOil Premium Axis (existing portfolio)",
      "Welcome 500 EDGE Miles on first transaction within 30 days",
      "6 EDGE Miles per ₹150 at IndianOil outlets (~4-6% effective fuel return)",
      "2 EDGE Miles per ₹150 on grocery spends",
      "1 EDGE Mile per ₹150 on all other eligible spends",
      "EDGE Miles redeemable at IOCL petrol pumps",
      "Quarterly complimentary domestic lounge access (4/year)",
      "Zomato discounts via card offer page",
      "1% fuel surcharge waiver at IOCL pumps",
      "Annual fee waiver on ₹1.5 lakh spend",
      "Best for car owners using IOCL pumps"
    ],
    loungeAccess: { domestic: 4, international: 0 },
    welcomeBonus: "500 EDGE Miles on first transaction within 30 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 360000,
    rating: 4.2,
    reviewCount: 4321,
    imageUrl: "/cards/axis-indianoil.jpg",
    cardColor: "from-red-700 via-orange-700 to-yellow-700",
    featured: false,
    popular: false
  },

  {
    id: "axis-horizon",
    name: "Axis Bank Horizon Credit Card",
    issuer: "Axis Bank",
    network: "visa",
    category: ["travel", "rewards"],
    annualFee: 3000,
    joiningFee: 3000,
    interestRate: { min: 3.0, max: 3.0 },
    creditLimit: { min: 200000, max: 2000000 },
    rewards: {
      type: "points",
      rate: 4,
      description:
        "(Formerly Citi PremierMiles) 4 EDGE Miles per ₹100 base; 8 EDGE Miles per ₹100 on travel; 1 EDGE Mile = ₹1 on flights/hotels"
    },
    benefits: [
      "**Post Citi-Axis migration:** Citi PremierMiles → Axis Horizon Credit Card",
      "Welcome 5,000 EDGE Miles on ₹1,000 spend within 30 days",
      "8 EDGE Miles per ₹100 on direct airline/hotel/travel",
      "4 EDGE Miles per ₹100 on other categories",
      "EDGE Miles transferable to 20+ partner airline/hotel programs",
      "Domestic + international lounge access via Priority Pass",
      "1% fuel surcharge waiver",
      "EazyDiner discounts at partner restaurants",
      "Annual fee waiver on ₹6 lakh spend",
      "Existing Citi miles converted to EDGE Miles at unchanged value"
    ],
    loungeAccess: { domestic: 8, international: 4 },
    welcomeBonus: "5,000 EDGE Miles on ₹1,000+ spend within 30 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.0,
    minIncome: 600000,
    rating: 4.2,
    reviewCount: 3210,
    imageUrl: "/cards/axis-horizon.jpg",
    cardColor: "from-sky-700 via-blue-700 to-sky-800",
    featured: false,
    popular: false
  },

  {
    id: "axis-samsung",
    name: "Samsung Axis Bank Infinite Credit Card",
    issuer: "Axis Bank",
    network: "visa",
    category: ["shopping", "rewards"],
    annualFee: 1500,
    joiningFee: 1500,
    interestRate: { min: 3.4, max: 3.4 },
    creditLimit: { min: 100000, max: 1000000 },
    rewards: {
      type: "cashback",
      rate: 10,
      description:
        "10% cashback on Samsung purchases (Samsung.com, Samsung Stores) capped per cycle; 7.5% on EMI; 5% on dining; 3% on others"
    },
    benefits: [
      "Welcome: 30,000 EDGE Reward Points + ₹2,000 Samsung voucher",
      "10% cashback on Samsung products (Samsung.com, Samsung Experience Stores)",
      "7.5% cashback on Samsung purchases via EMI",
      "5% cashback on dining at partner restaurants",
      "Up to 4 complimentary domestic airport lounge visits per year",
      "1% fuel surcharge waiver",
      "Convert purchases above ₹2,500 to EMI",
      "Annual fee waiver on ₹3 lakh annual spend",
      "Best for Samsung product buyers (phone, TV, fridge, washing machine)"
    ],
    loungeAccess: { domestic: 4, international: 0 },
    welcomeBonus: "30,000 EDGE Reward Points + ₹2,000 Samsung voucher",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 600000,
    rating: 4.1,
    reviewCount: 2345,
    imageUrl: "/cards/axis-samsung.jpg",
    cardColor: "from-blue-800 via-indigo-800 to-blue-900",
    featured: false,
    popular: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // AMERICAN EXPRESS (3 cards)
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "amex-platinum-travel",
    name: "American Express Platinum Travel Credit Card",
    issuer: "American Express",
    network: "amex",
    category: ["travel", "rewards"],
    annualFee: 5000,
    joiningFee: 3500,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 200000, max: 2000000 },
    rewards: {
      type: "points",
      rate: 2,
      description:
        "1 MR point per ₹50 base; milestone Travel Vouchers worth ₹14,500 on ₹4L spend or ₹40K Travel Voucher on ₹1.9L spend; 1 MR ≈ ₹0.50"
    },
    benefits: [
      "Welcome: 10,000 MR Points worth ₹3,000 on spending ₹15,000 within 90 days",
      "1 MR point per ₹50 spent (excl. fuel, insurance, utilities, cash)",
      "Milestone benefit: Travel Voucher worth ₹14,500 on ₹4 lakh annual spend",
      "Additional milestone: Travel Voucher worth ₹40,000 + Taj Voucher worth ₹10,000 on ₹1.9 lakh + ₹4L spend",
      "8 complimentary domestic airport lounge visits per year",
      "Up to 50% off at 1,800+ premium restaurants via Amex Dining",
      "Travel insurance up to ₹2 Crore",
      "Annual fee 5,000 from second year (joining fee 3,500 first year)",
      "MR points convertible to airline miles (Singapore Airlines, Marriott Bonvoy, etc.)",
      "Best for travel-focused milestone spenders"
    ],
    loungeAccess: { domestic: 8, international: 0 },
    welcomeBonus: "10,000 MR Points worth ₹3,000 on ₹15,000 spend within 90 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 600000,
    rating: 4.4,
    reviewCount: 5678,
    imageUrl: "/cards/amex-platinum-travel.jpg",
    cardColor: "from-zinc-400 via-zinc-500 to-zinc-700",
    featured: false,
    popular: true
  },

  {
    id: "amex-smart-earn",
    name: "American Express SmartEarn Credit Card",
    issuer: "American Express",
    network: "amex",
    category: ["rewards", "shopping"],
    annualFee: 495,
    joiningFee: 495,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 50000, max: 500000 },
    rewards: {
      type: "points",
      rate: 5,
      description:
        "10X MR points on Amazon, Flipkart, BookMyShow, Uber, Swiggy, Zomato, Tata CLiQ; 5X on others; 1 MR ≈ ₹0.50"
    },
    benefits: [
      "Welcome: 1,000 MR points + ₹500 Amazon voucher on activation + spending",
      "10X reward points on Amazon, Flipkart, BookMyShow, Uber, Swiggy, Zomato, Tata CLiQ",
      "5X reward points on all other retail spends",
      "Up to 50% off at 1,800+ premium restaurants via Amex Dining",
      "Annual fee waiver on ₹40,000 annual spend",
      "MR points redeemable for vouchers, statement credit, airline miles",
      "1% fuel surcharge waiver",
      "Best entry-level Amex card for online shoppers"
    ],
    loungeAccess: null,
    welcomeBonus: "1,000 MR points + ₹500 Amazon voucher on activation",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 360000,
    rating: 4.2,
    reviewCount: 7654,
    imageUrl: "/cards/amex-smart-earn.jpg",
    cardColor: "from-emerald-600 via-green-600 to-teal-700",
    featured: false,
    popular: true
  },

  {
    id: "amex-platinum-reserve",
    name: "American Express Platinum Reserve Credit Card",
    issuer: "American Express",
    network: "amex",
    category: ["premium", "rewards"],
    annualFee: 5000,
    joiningFee: 5000,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 300000, max: 2500000 },
    rewards: {
      type: "points",
      rate: 2,
      description:
        "1 MR per ₹50 base; monthly milestone 2% return + MR points on any spend up to ₹50K/month (~3% effective); 1 MR ≈ ₹0.50"
    },
    benefits: [
      "Welcome: 11,000 MR points worth ₹3,500 + Marvel/Disney+ Hotstar voucher",
      "1 MR per ₹50 spent + monthly milestone 2% return on spend up to ₹50K (any category)",
      "**Best monthly milestone among Amex India cards** — 2% return on any spend",
      "Complimentary Accor Plus membership for dining at Accor hotels in Asia",
      "8 complimentary domestic + 4 international lounge visits per year",
      "Up to 4 complimentary golf rounds per month at 90+ courses globally",
      "Up to 50% off at 1,800+ premium restaurants via Amex Dining",
      "Travel insurance up to ₹2 Crore air accident",
      "Annual fee 5,000 from year 1; spend ₹5L/year for retention",
      "MR points convertible to airline/hotel partners (Marriott, KrisFlyer, etc.)"
    ],
    loungeAccess: { domestic: 8, international: 4 },
    welcomeBonus: "11,000 MR points + Marvel/Disney+ Hotstar voucher",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 1500000,
    rating: 4.5,
    reviewCount: 2345,
    imageUrl: "/cards/amex-platinum-reserve.jpg",
    cardColor: "from-zinc-300 via-zinc-400 to-zinc-500",
    featured: false,
    popular: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // KOTAK MAHINDRA BANK (3 cards)
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "kotak-league-platinum",
    name: "Kotak League Platinum Credit Card",
    issuer: "Kotak Mahindra Bank",
    network: "visa",
    category: ["rewards", "shopping"],
    annualFee: 0, // Lifetime free variant
    joiningFee: 0,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 50000, max: 500000 },
    rewards: {
      type: "points",
      rate: 0.5,
      description:
        "8 RPs per ₹150 on Travel/Departmental/Durable Goods/Airlines; 4 RPs per ₹150 on others (capped); 1 RP = ₹0.07 cashback or ₹0.10 on catalogue"
    },
    benefits: [
      "Lifetime free variant available (also paid variant with welcome benefits)",
      "8 reward points per ₹150 on special categories: Travel Agencies, Tour Operators, Airlines, Electric Sales, Departmental Stores, Durable Goods",
      "8 reward points per ₹150 on others on reaching ₹2 lakh annual spend",
      "4 reward points per ₹150 on others before ₹2 lakh threshold",
      "Welcome: 5,000 reward points worth ₹500 (paid variant only)",
      "1% fuel surcharge waiver (₹500-₹4,000, capped at ₹3,500/year)",
      "Railway surcharge waiver up to ₹500/year",
      "Annual fee waiver on ₹50,000 annual spend (for paid variant)",
      "**June 2025 update:** No reward points on utility spends above ₹35,000/month",
      "1 RP = ₹0.07 cashback OR ₹0.10 against catalogue redemption"
    ],
    loungeAccess: null,
    welcomeBonus: "5,000 reward points worth ₹500 on joining (paid variant)",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 240000,
    rating: 4.0,
    reviewCount: 6543,
    imageUrl: "/cards/kotak-league-platinum.jpg",
    cardColor: "from-red-700 via-rose-700 to-red-800",
    featured: false,
    popular: false
  },

  {
    id: "kotak-indianoil",
    name: "IndianOil Kotak Credit Card",
    issuer: "Kotak Mahindra Bank",
    network: "visa",
    category: ["fuel", "rewards"],
    annualFee: 449,
    joiningFee: 0,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 30000, max: 300000 },
    rewards: {
      type: "points",
      rate: 4,
      description:
        "4% reward points at IndianOil outlets; 2% on dining/grocery; 0.5% on others; 1 RP = ₹1 at IOCL"
    },
    benefits: [
      "4% as reward points on fuel purchases at IndianOil outlets",
      "2% as reward points on dining and grocery spends",
      "0.5% as reward points on other categories",
      "Reward points redeemable as fuel at IndianOil pumps (1 RP = ₹1)",
      "Welcome benefits on activation",
      "1% fuel surcharge waiver at IndianOil",
      "Tap-and-pay contactless transactions",
      "Annual fee waiver on ₹50,000 annual spend",
      "Best for IndianOil-loyal car owners"
    ],
    loungeAccess: null,
    welcomeBonus: null,
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 240000,
    rating: 4.0,
    reviewCount: 4321,
    imageUrl: "/cards/kotak-indianoil.jpg",
    cardColor: "from-orange-500 via-red-500 to-orange-600",
    featured: false,
    popular: false
  },

  {
    id: "kotak-myntra",
    name: "Myntra Kotak Credit Card",
    issuer: "Kotak Mahindra Bank",
    network: "visa",
    category: ["cashback", "shopping"],
    annualFee: 500,
    joiningFee: 500,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 30000, max: 400000 },
    rewards: {
      type: "cashback",
      rate: 7.5,
      description:
        "7.5% cashback on Myntra; 5% cashback on Swiggy/Swiggy Instamart/PVR/Cleartrip/Urban Company; 1.25% on other online; 0.5% offline"
    },
    benefits: [
      "7.5% cashback on Myntra purchases",
      "5% cashback on Swiggy, Swiggy Instamart, PVR, Cleartrip, Urban Company",
      "1.25% cashback on other online spends",
      "Welcome ₹500 Myntra voucher on ₹500 spend within 30 days",
      "Cashback credited as Myntra Insider points or statement credit",
      "Annual fee waiver on ₹2 lakh spend",
      "1% fuel surcharge waiver",
      "Best for Myntra-heavy fashion shoppers"
    ],
    loungeAccess: null,
    welcomeBonus: "₹500 Myntra voucher on ₹500 spend within 30 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 240000,
    rating: 4.3,
    reviewCount: 3210,
    imageUrl: "/cards/kotak-myntra.jpg",
    cardColor: "from-rose-600 via-pink-600 to-fuchsia-700",
    featured: false,
    popular: true
  },

  // ═══════════════════════════════════════════════════════════════════
  // IDFC FIRST BANK (5 cards)
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "idfc-select",
    name: "IDFC FIRST Select Credit Card",
    issuer: "IDFC FIRST Bank",
    network: "visa",
    category: ["rewards", "travel", "shopping"],
    annualFee: 0,
    joiningFee: 0,
    interestRate: { min: 0.71, max: 3.85 },
    creditLimit: { min: 100000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 1.67,
      description:
        "10X RPs on incremental spend above ₹20K/month + birthday spends; 6X RPs up to ₹20K/month online; 3X on offline; 1X on utility/insurance; 1 RP = ₹0.25"
    },
    benefits: [
      "Lifetime free — no joining or annual fee",
      "10X reward points on incremental monthly spend above ₹20,000 + birthday spends",
      "6X reward points on online spends up to ₹20,000/month",
      "3X reward points on offline spends up to ₹20,000/month",
      "1X reward point per ₹150 on utilities, insurance, FASTag",
      "Reward points never expire; redeemable across catalogue",
      "Welcome: 5% cashback up to ₹1,000 on first EMI within 90 days",
      "4 complimentary domestic airport lounge visits per quarter (16/year)",
      "4 complimentary international lounge visits per year via Priority Pass",
      "25% off on movie tickets via District (max ₹100/month)",
      "Up to 20% off at 1,500+ partner restaurants",
      "Roadside assistance worth ₹1,399 (4/year)",
      "Personal accident cover ₹2 lakh",
      "Reward redemption fee ₹99 + GST per redemption"
    ],
    loungeAccess: { domestic: 16, international: 4 },
    welcomeBonus: "5% cashback up to ₹1,000 on first EMI within 90 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 480000,
    rating: 4.5,
    reviewCount: 12345,
    imageUrl: "/cards/idfc-select.jpg",
    cardColor: "from-rose-700 via-red-700 to-rose-800",
    featured: false,
    popular: true
  },

  {
    id: "idfc-wow",
    name: "IDFC FIRST WOW! Credit Card (FD-backed)",
    issuer: "IDFC FIRST Bank",
    network: "visa",
    category: ["rewards", "travel"],
    annualFee: 0,
    joiningFee: 0,
    interestRate: { min: 0.71, max: 3.85 },
    creditLimit: { min: 20000, max: 1000000 }, // 100% of FD value
    rewards: {
      type: "points",
      rate: 1,
      description:
        "4X RPs (1 per ₹50) on online, offline, international spends; 1X on utilities/FASTag/railway/insurance; 1 RP = ₹0.25"
    },
    benefits: [
      "Lifetime free FD-backed secured credit card",
      "Backed by Fixed Deposit of minimum ₹20,000 with IDFC FIRST Bank",
      "Credit limit: 100% of FD value",
      "**Zero forex markup fee** on international transactions — best for overseas spending",
      "4X reward points (1 RP per ₹50) on online, offline, international spends",
      "1X reward point per ₹200 on utilities, FASTag, railway, insurance bookings",
      "**Best for:** first-jobbers, no credit history, NRIs, students, secured rebuilders",
      "No income proof required",
      "1% fuel surcharge waiver (max ₹200/month)",
      "Personal accident cover ₹2 lakh",
      "1 RP = ₹0.25 against statement; ₹99 + GST redemption fee"
    ],
    loungeAccess: { domestic: 4, international: 0 }, // 1/quarter
    welcomeBonus: null,
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 0,
    minIncome: 0, // No income proof
    rating: 4.4,
    reviewCount: 6789,
    imageUrl: "/cards/idfc-wow.jpg",
    cardColor: "from-emerald-700 via-green-700 to-emerald-800",
    featured: false,
    popular: true
  },

  {
    id: "idfc-power",
    name: "IDFC FIRST Power Credit Card",
    issuer: "IDFC FIRST Bank",
    network: "rupay", // also Visa
    category: ["fuel", "rewards"],
    annualFee: 199,
    joiningFee: 199,
    interestRate: { min: 0.71, max: 3.85 },
    creditLimit: { min: 50000, max: 500000 },
    rewards: {
      type: "cashback",
      rate: 5,
      description:
        "5% cashback on HPCL fuel + grocery + bills; 2.5X RPs on others; 1 RP = ₹0.25; UPI supported on RuPay variant"
    },
    benefits: [
      "Co-branded HPCL fuel card",
      "5% cashback on HPCL fuel (capped ₹150/month)",
      "5% cashback on grocery and utility bill payments (₹150/month each)",
      "2.5X reward points on other spends",
      "Welcome HPCL HP Pay app vouchers worth ₹250",
      "Annual fee waiver on ₹50,000 annual spend",
      "1% fuel surcharge waiver at HPCL",
      "RuPay variant supports UPI payments",
      "Personal accident cover ₹2 lakh",
      "Best for HPCL fuel users"
    ],
    loungeAccess: { domestic: 4, international: 0 }, // 1/quarter
    welcomeBonus: "HPCL HP Pay vouchers worth ₹250",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 300000,
    rating: 4.2,
    reviewCount: 3456,
    imageUrl: "/cards/idfc-power.jpg",
    cardColor: "from-cyan-600 via-blue-600 to-cyan-700",
    featured: false,
    popular: false
  },

  {
    id: "idfc-power-plus",
    name: "IDFC FIRST Power+ Credit Card",
    issuer: "IDFC FIRST Bank",
    network: "rupay",
    category: ["fuel", "rewards"],
    annualFee: 499,
    joiningFee: 499,
    interestRate: { min: 0.71, max: 3.85 },
    creditLimit: { min: 80000, max: 800000 },
    rewards: {
      type: "cashback",
      rate: 6.5,
      description:
        "6.5% cashback on HPCL fuel (cap ₹250/month); 5% on grocery/bills (cap ₹150/month each); 3X RPs on others; 1 RP = ₹0.25"
    },
    benefits: [
      "Premium HPCL fuel card with higher caps than IDFC Power",
      "6.5% cashback on HPCL fuel via HP Pay app (capped ₹250/month)",
      "5% cashback on grocery and utility bill payments (₹150/month each)",
      "3X reward points on other spends",
      "Welcome 500 reward points + HPCL voucher",
      "Annual fee waiver on ₹1.5 lakh annual spend",
      "1% fuel surcharge waiver",
      "RuPay variant supports UPI payments",
      "Roadside assistance",
      "Personal accident cover ₹2 lakh"
    ],
    loungeAccess: { domestic: 8, international: 0 }, // 2/quarter
    welcomeBonus: "500 reward points + HPCL fuel voucher",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 360000,
    rating: 4.3,
    reviewCount: 2345,
    imageUrl: "/cards/idfc-power-plus.jpg",
    cardColor: "from-blue-700 via-indigo-700 to-blue-800",
    featured: false,
    popular: false
  },

  {
    id: "idfc-mayura",
    name: "IDFC FIRST Mayura Credit Card",
    issuer: "IDFC FIRST Bank",
    network: "visa",
    category: ["travel", "rewards"],
    annualFee: 5999,
    joiningFee: 5999,
    interestRate: { min: 0.71, max: 3.85 },
    creditLimit: { min: 200000, max: 2000000 },
    rewards: {
      type: "points",
      rate: 2.5,
      description:
        "10X RPs on monthly spends above ₹1L (~10% effective); 5X up to ₹1L; 1 RP = ₹0.25 base, ₹1 on Privilege program"
    },
    benefits: [
      "**Zero forex markup** on international transactions",
      "10X reward points on monthly spends above ₹1 lakh in any category",
      "5X reward points on monthly spends up to ₹1 lakh",
      "Welcome: complimentary flight & hotel vouchers worth ₹6,000",
      "Privilege Program: cardholders spending >₹1L/month for a quarter unlock 1 RP = ₹1 redemption",
      "Unlimited domestic + international airport lounge visits via Priority Pass",
      "Up to 4 complimentary golf rounds per month",
      "Travel insurance + lost card liability ₹50K",
      "**CardExpert note:** sweet spot card likely to be devalued soon; new issuer caveats apply",
      "Best for high-spending international travellers"
    ],
    loungeAccess: { domestic: "unlimited", international: "unlimited" },
    welcomeBonus: "Complimentary flight + hotel vouchers worth ₹6,000",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 0,
    minIncome: 1200000,
    rating: 4.4,
    reviewCount: 1876,
    imageUrl: "/cards/idfc-mayura.jpg",
    cardColor: "from-emerald-800 via-teal-800 to-emerald-900",
    featured: true,
    popular: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // YES BANK (2 cards)
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "yes-reserv",
    name: "YES Bank Reserv Credit Card",
    issuer: "YES Bank",
    network: "visa", // Visa Infinite
    category: ["premium", "travel", "rewards"],
    annualFee: 2000,
    joiningFee: 2000,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 200000, max: 2000000 },
    rewards: {
      type: "points",
      rate: 1.5,
      description:
        "3 RPs per ₹200 base; 6 RPs per ₹200 on dining/grocery/movies; 1 RP = ₹0.50 on travel redemption"
    },
    benefits: [
      "Welcome: 8,000 RPs worth ₹4,000 on ₹15,000 spend within 90 days",
      "3 reward points per ₹200 on retail",
      "6 reward points per ₹200 on dining, grocery, movies",
      "Complimentary domestic airport lounge access (8/year)",
      "Complimentary international lounge access via Priority Pass (4/year)",
      "Movie ticket BOGO via BookMyShow (max ₹250 off, twice/month)",
      "Up to 25% off on dining via EazyDiner Prime",
      "Annual fee waiver on ₹2 lakh annual spend",
      "1% fuel surcharge waiver",
      "Concierge service",
      "Forex markup of 3.5%"
    ],
    loungeAccess: { domestic: 8, international: 4 },
    welcomeBonus: "8,000 RPs worth ₹4,000 on ₹15,000 spend within 90 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 720000,
    rating: 4.1,
    reviewCount: 2876,
    imageUrl: "/cards/yes-reserv.jpg",
    cardColor: "from-blue-800 via-indigo-800 to-blue-900",
    featured: false,
    popular: false
  },

  {
    id: "yes-ace",
    name: "YES Bank ACE Credit Card",
    issuer: "YES Bank",
    network: "rupay", // also Mastercard
    category: ["rewards", "shopping"],
    annualFee: 499,
    joiningFee: 499,
    interestRate: { min: 3.49, max: 3.49 },
    creditLimit: { min: 50000, max: 500000 },
    rewards: {
      type: "points",
      rate: 0.5,
      description:
        "1 RP per ₹200 base; bonuses on online; UPI rewards on RuPay variant; 1 RP ≈ ₹0.50"
    },
    benefits: [
      "Welcome benefits on activation",
      "1 reward point per ₹200 on retail (low base rate)",
      "Bonus points on select online merchant categories",
      "UPI payment rewards on RuPay variant",
      "1% fuel surcharge waiver",
      "Annual fee waiver on ₹1.5 lakh annual spend",
      "Affordable entry-level card",
      "Best for occasional users wanting basic cashback structure"
    ],
    loungeAccess: null,
    welcomeBonus: null,
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 240000,
    rating: 3.9,
    reviewCount: 1543,
    imageUrl: "/cards/yes-ace.jpg",
    cardColor: "from-violet-700 via-purple-700 to-violet-800",
    featured: false,
    popular: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // INDUSIND BANK (3 cards)
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "indusind-pinnacle",
    name: "IndusInd Bank Pinnacle World Credit Card",
    issuer: "IndusInd Bank",
    network: "mastercard", // World
    category: ["premium", "travel", "rewards"],
    annualFee: 0, // No annual fee
    joiningFee: 15000,
    interestRate: { min: 3.83, max: 3.83 },
    creditLimit: { min: 500000, max: 3000000 },
    rewards: {
      type: "points",
      rate: 1.5,
      description:
        "2.5 RPs per ₹100 on e-commerce; 1.5 RPs per ₹100 on travel; 1 RP per ₹100 base; 0.7 RP on utilities/insurance; 1 RP = ₹0.75"
    },
    benefits: [
      "₹15,000 one-time joining fee, but **no annual or renewal fee** from year 2",
      "2.5 RPs per ₹100 on e-commerce transactions",
      "1.5 RPs per ₹100 on travel spends",
      "1 RP per ₹100 on base spends (no cap)",
      "0.7 RP per ₹100 on utilities, insurance, government, education, real estate, rental",
      "Welcome: choice of Montblanc/Postcard Hotels/Luxe gift card on fee payment",
      "**1 April 2026 update:** spends-based tracking begins; **July 2026 onwards** lounge access requires prior-quarter spend criteria",
      "1 complimentary international lounge visit per quarter via Priority Pass",
      "Complimentary Hole-in-One insurance worth ₹20,000",
      "BOGO movie tickets on BookMyShow thrice/month (capped ₹200/ticket)",
      "24x7 concierge service",
      "1 RP = ₹0.75 cash credit; 200 RPs = 100 KrisFlyer Miles",
      "Forex markup 3.5%"
    ],
    loungeAccess: { domestic: 8, international: 4 }, // post April 2026 conditional
    welcomeBonus: "Choice of Montblanc/Postcard Hotels/Luxe gift voucher",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 1200000,
    rating: 4.3,
    reviewCount: 2987,
    imageUrl: "/cards/indusind-pinnacle.jpg",
    cardColor: "from-amber-700 via-yellow-700 to-amber-800",
    featured: false,
    popular: false
  },

  {
    id: "indusind-tiger",
    name: "IndusInd Bank Tiger Credit Card",
    issuer: "IndusInd Bank",
    network: "visa",
    category: ["rewards", "travel"],
    annualFee: 0,
    joiningFee: 0,
    interestRate: { min: 3.83, max: 3.83 },
    creditLimit: { min: 100000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 3,
      description:
        "Tiered rewards: 1 RP/₹100 below ₹1L monthly; 2 RPs ₹1-2.5L; 4 RPs ₹2.5-5L; 6 RPs above ₹5L; 1 RP ≈ ₹0.50"
    },
    benefits: [
      "Lifetime free (CardExpert recommended for high-spending users)",
      "Tiered reward structure rewards high spenders:",
      "  • 1 RP per ₹100 on monthly spend below ₹1 lakh",
      "  • 2 RPs per ₹100 on spend ₹1 lakh to ₹2.5 lakh",
      "  • 4 RPs per ₹100 on spend ₹2.5 lakh to ₹5 lakh",
      "  • 6 RPs per ₹100 on spend above ₹5 lakh",
      "20,000 bonus reward points on ₹6 lakh annual spend",
      "Air India / Maharaja Club point transfer (post-Vistara merger)",
      "Roadside assistance",
      "Best for high-volume monthly spenders (₹2.5L+)",
      "1 RP = ₹0.50 redemption"
    ],
    loungeAccess: { domestic: 4, international: 0 },
    welcomeBonus: null,
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.99,
    minIncome: 480000,
    rating: 4.4,
    reviewCount: 1234,
    imageUrl: "/cards/indusind-tiger.jpg",
    cardColor: "from-orange-700 via-amber-700 to-orange-800",
    featured: false,
    popular: false
  },

  {
    id: "indusind-pioneer-heritage",
    name: "IndusInd Bank Pioneer Heritage Credit Card",
    issuer: "IndusInd Bank",
    network: "amex", // Amex variant
    category: ["premium", "travel", "rewards"],
    annualFee: 0, // Invite only via Pioneer Banking
    joiningFee: 0,
    interestRate: { min: 3.83, max: 3.83 },
    creditLimit: { min: 1000000, max: 5000000 },
    rewards: {
      type: "points",
      rate: 2,
      description:
        "2.5 RPs per ₹100 on weekday + 3.5 RPs weekend; 1 RP ≈ ₹1 on travel; transfer to KrisFlyer 1:1"
    },
    benefits: [
      "**Invite-only via IndusInd Pioneer Banking relationship** (₹50L+ AUM)",
      "Lifetime free for Pioneer Banking customers",
      "2.5 RPs per ₹100 on weekday spends",
      "3.5 RPs per ₹100 on weekend spends",
      "Unlimited complimentary domestic + international lounge access",
      "Complimentary golf games and lessons globally",
      "1:1 transfer to KrisFlyer Miles (Singapore Airlines)",
      "Air accident cover ₹3 Crore",
      "24x7 dedicated concierge",
      "Total Protect: ₹50 lakh fraud protection",
      "Travel insurance (lost baggage, passport, trip delay)",
      "Best HNI card on Amex network (apart from Amex Platinum)"
    ],
    loungeAccess: { domestic: "unlimited", international: "unlimited" },
    welcomeBonus: "Pioneer Banking exclusive welcome benefits",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.8,
    minIncome: 5000000,
    rating: 4.6,
    reviewCount: 543,
    imageUrl: "/cards/indusind-pioneer-heritage.jpg",
    cardColor: "from-zinc-800 via-stone-900 to-zinc-900",
    featured: false,
    popular: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // RBL BANK (3 cards)
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "rbl-insignia",
    name: "RBL Bank Insignia Preferred Banking Credit Card",
    issuer: "RBL Bank",
    network: "mastercard", // World Elite
    category: ["premium", "travel", "rewards"],
    annualFee: 0, // For Preferred Banking customers
    joiningFee: 0,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 500000, max: 3000000 },
    rewards: {
      type: "points",
      rate: 1,
      description:
        "5 RPs per ₹100 on retail; 10 RPs per ₹100 on overseas; 5X on dining/grocery; 1 RP = ₹0.40"
    },
    benefits: [
      "**Invite-only via RBL Preferred Banking relationship**",
      "5 reward points per ₹100 on retail spends",
      "10 reward points per ₹100 on overseas/international spends",
      "5X reward points on dining and grocery",
      "Unlimited complimentary domestic and international airport lounge access",
      "Complimentary golf rounds globally",
      "**Strong movie benefits** — multiple complimentary tickets and BOGO offers",
      "Air accident cover up to ₹2 Crore",
      "Travel insurance + emergency medical cover",
      "24x7 concierge service",
      "1 RP = ₹0.40 redemption"
    ],
    loungeAccess: { domestic: "unlimited", international: "unlimited" },
    welcomeBonus: "Preferred Banking welcome benefits",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.5,
    minIncome: 5000000,
    rating: 4.4,
    reviewCount: 876,
    imageUrl: "/cards/rbl-insignia.jpg",
    cardColor: "from-stone-800 via-zinc-900 to-stone-900",
    featured: false,
    popular: false
  },

  {
    id: "rbl-icon",
    name: "RBL Bank Icon Credit Card",
    issuer: "RBL Bank",
    network: "mastercard",
    category: ["rewards", "travel"],
    annualFee: 5000,
    joiningFee: 5000,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 300000, max: 2000000 },
    rewards: {
      type: "points",
      rate: 1.5,
      description:
        "3 RPs per ₹100 base; 5 RPs per ₹100 on Sat/Sun; 1 RP = ₹0.50; transfer partners available"
    },
    benefits: [
      "Welcome 8,000 RPs worth ₹4,000 + ₹4,000 voucher",
      "3 reward points per ₹100 on retail",
      "5 reward points per ₹100 on Saturday and Sunday spends",
      "Complimentary international airport lounge access via Priority Pass (8/year)",
      "Domestic airport lounge access (8/year)",
      "Up to 4 complimentary golf rounds per quarter",
      "Movie BOGO via BookMyShow (max 2 tickets/month at ₹500 each)",
      "Travel insurance + lost card liability",
      "Concierge service",
      "Annual fee waiver on ₹5 lakh spend",
      "1.5% forex markup"
    ],
    loungeAccess: { domestic: 8, international: 8 },
    welcomeBonus: "8,000 RPs worth ₹4,000 + ₹4,000 voucher",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.5,
    minIncome: 1200000,
    rating: 4.2,
    reviewCount: 1543,
    imageUrl: "/cards/rbl-icon.jpg",
    cardColor: "from-purple-800 via-violet-800 to-purple-900",
    featured: false,
    popular: false
  },

  {
    id: "rbl-shoprite",
    name: "RBL Bank Shoprite Credit Card",
    issuer: "RBL Bank",
    network: "mastercard",
    category: ["rewards", "shopping"],
    annualFee: 500,
    joiningFee: 500,
    interestRate: { min: 3.99, max: 3.99 },
    creditLimit: { min: 30000, max: 300000 },
    rewards: {
      type: "points",
      rate: 1.25,
      description:
        "20 RPs per ₹100 on grocery (capped); 2 RPs per ₹100 on others; 1 RP = ₹0.25"
    },
    benefits: [
      "20 reward points per ₹100 on grocery and supermarket spends (capped 1,000 RPs/month)",
      "2 reward points per ₹100 on all other retail",
      "1% fuel surcharge waiver",
      "5% rebate on movie tickets",
      "Annual fee waiver on ₹75,000 annual spend",
      "Welcome bonus reward points on activation",
      "Best for grocery-heavy households",
      "1 RP = ₹0.25"
    ],
    loungeAccess: null,
    welcomeBonus: "Welcome bonus reward points on card activation",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 240000,
    rating: 3.9,
    reviewCount: 2345,
    imageUrl: "/cards/rbl-shoprite.jpg",
    cardColor: "from-orange-600 via-amber-600 to-orange-700",
    featured: false,
    popular: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // FEDERAL BANK (1 card) - Co-branded with Scapia
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "federal-scapia",
    name: "Scapia Federal Bank Credit Card",
    issuer: "Federal Bank",
    network: "visa", // also RuPay
    category: ["travel", "rewards"],
    annualFee: 0,
    joiningFee: 0,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 50000, max: 1000000 },
    rewards: {
      type: "points",
      rate: 2,
      description:
        "10% Scapia Coins on Scapia app travel bookings; 2% on all other spends; 1 Scapia Coin = ₹1 on bookings"
    },
    benefits: [
      "Lifetime free travel credit card by Scapia app + Federal Bank",
      "10% rewards as Scapia Coins on flights/hotels booked via Scapia app",
      "2% rewards on all other retail spends",
      "**Zero forex markup** on international transactions",
      "Welcome 1,000 Scapia Coins on ₹2,000 spend within 30 days",
      "Unlimited complimentary domestic airport lounge access",
      "4 complimentary international airport lounge visits per year via LoungeKey",
      "1 Scapia Coin = ₹1 on travel bookings",
      "Lounge access requires ₹5,000 monthly spend",
      "Best digital-first travel card for occasional travellers"
    ],
    loungeAccess: { domestic: "unlimited", international: 4 },
    welcomeBonus: "1,000 Scapia Coins on ₹2,000 spend within 30 days",
    fuelSurchargeWaiver: false,
    foreignTransactionFee: 0,
    minIncome: 300000,
    rating: 4.3,
    reviewCount: 4567,
    imageUrl: "/cards/federal-scapia.jpg",
    cardColor: "from-indigo-700 via-blue-700 to-indigo-800",
    featured: false,
    popular: true
  },

  // ═══════════════════════════════════════════════════════════════════
  // BANK OF BARODA (2 cards)
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "bob-eterna",
    name: "BOBCARD Eterna Credit Card",
    issuer: "Bank of Baroda",
    network: "visa", // Visa Signature
    category: ["premium", "rewards", "travel"],
    annualFee: 2499,
    joiningFee: 2499,
    interestRate: { min: 3.49, max: 3.49 },
    creditLimit: { min: 200000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 1.25,
      description:
        "5 RPs per ₹100 on travel/dining/shopping/utility/international; 1 RP per ₹100 on others; 1 RP = ₹0.25"
    },
    benefits: [
      "Welcome 7,500 reward points on ₹25,000 spend within 60 days",
      "5 reward points per ₹100 on travel, dining, shopping, utility, international",
      "1 reward point per ₹100 on other spends",
      "8 complimentary domestic airport lounge visits per year (2/quarter)",
      "4 complimentary international lounge visits per year via Priority Pass",
      "Movie ticket BOGO on BookMyShow (max ₹250)",
      "Complimentary insurance: travel ₹50 lakh, air accident ₹1 Cr",
      "Annual fee waiver on ₹2.5 lakh annual spend",
      "1.99% forex markup",
      "Best PSU bank premium card"
    ],
    loungeAccess: { domestic: 8, international: 4 },
    welcomeBonus: "7,500 reward points on ₹25,000 spend within 60 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.99,
    minIncome: 600000,
    rating: 4.0,
    reviewCount: 1876,
    imageUrl: "/cards/bob-eterna.jpg",
    cardColor: "from-emerald-700 via-teal-700 to-emerald-800",
    featured: false,
    popular: false
  },

  {
    id: "bob-premier",
    name: "BOBCARD Premier Credit Card",
    issuer: "Bank of Baroda",
    network: "visa",
    category: ["rewards", "shopping"],
    annualFee: 1000,
    joiningFee: 1000,
    interestRate: { min: 3.49, max: 3.49 },
    creditLimit: { min: 100000, max: 800000 },
    rewards: {
      type: "points",
      rate: 0.75,
      description:
        "3 RPs per ₹100 on travel/dining/grocery; 1 RP per ₹100 on others; 1 RP = ₹0.25"
    },
    benefits: [
      "Welcome reward points on activation",
      "3 reward points per ₹100 on travel, dining, grocery, utility",
      "1 reward point per ₹100 on other spends",
      "4 complimentary domestic airport lounge visits per year (1/quarter)",
      "Movie discounts on BookMyShow",
      "Annual fee waiver on ₹1.5 lakh annual spend",
      "1% fuel surcharge waiver",
      "Travel insurance",
      "Mid-tier card for moderate spenders"
    ],
    loungeAccess: { domestic: 4, international: 0 },
    welcomeBonus: "Welcome reward points on card activation",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 480000,
    rating: 3.9,
    reviewCount: 1234,
    imageUrl: "/cards/bob-premier.jpg",
    cardColor: "from-cyan-700 via-blue-700 to-cyan-800",
    featured: false,
    popular: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // HSBC BANK (1 card) - Live+
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "hsbc-live-plus",
    name: "HSBC Live+ Credit Card",
    issuer: "HSBC Bank",
    network: "visa",
    category: ["cashback", "shopping"],
    annualFee: 999,
    joiningFee: 999,
    interestRate: { min: 1.99, max: 3.49 },
    creditLimit: { min: 100000, max: 1000000 },
    rewards: {
      type: "cashback",
      rate: 10,
      description:
        "10% cashback on dining + food delivery + grocery (capped ₹1,000/month); 1.5% unlimited on other spends"
    },
    benefits: [
      "Welcome: 2,000 reward points + ₹1,000 Amazon voucher on first transaction",
      "**10% cashback on dining, food delivery, and grocery** (capped at ₹1,000/month)",
      "1.5% unlimited cashback on all other spends (no cap)",
      "Cashback credited as statement credit automatically",
      "4 complimentary domestic airport lounge visits per year (1/quarter)",
      "Annual fee waiver on ₹4 lakh annual spend",
      "Available in select metros (Chennai, Delhi NCR, Mumbai, Bengaluru, Hyderabad, Pune, etc.)",
      "Up to 50 days interest-free credit period",
      "Best simple cashback card for foodies and online shoppers",
      "**CardExpert recommended** for beginners with ₹1L+ monthly spend"
    ],
    loungeAccess: { domestic: 4, international: 0 },
    welcomeBonus: "2,000 reward points + ₹1,000 Amazon voucher on first transaction",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 600000,
    rating: 4.5,
    reviewCount: 3456,
    imageUrl: "/cards/hsbc-live-plus.jpg",
    cardColor: "from-red-700 via-rose-700 to-red-800",
    featured: true,
    popular: true
  },

  // ═══════════════════════════════════════════════════════════════════
  // AU SMALL FINANCE BANK (1 card) - Ixigo
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "au-ixigo",
    name: "AU Bank Ixigo Credit Card",
    issuer: "AU Small Finance Bank",
    network: "rupay", // Co-brand with ixigo
    category: ["travel", "rewards"],
    annualFee: 1500,
    joiningFee: 1500,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 50000, max: 600000 },
    rewards: {
      type: "points",
      rate: 4,
      description:
        "10% as ixigo money on flight/hotel/bus bookings (capped ₹1K/month each); 1% on other spends; 1 ixigo money = ₹1"
    },
    benefits: [
      "RuPay co-branded card supporting UPI payments",
      "10% as ixigo money on flight bookings (capped ₹1,000/month)",
      "10% as ixigo money on hotel bookings (capped ₹1,000/month)",
      "10% as ixigo money on bus & train bookings (capped ₹1,000/month)",
      "1% as ixigo money on other spends",
      "Welcome ixigo Plus 1-year membership worth ₹1,400",
      "Up to 8 complimentary domestic airport lounge visits per year (₹10K spend each quarter)",
      "Up to 4 complimentary railway lounge visits per quarter",
      "Travel insurance + roadside assistance",
      "Annual fee waiver on ₹2 lakh spend",
      "Best for travel + UPI combo users (CardExpert favorite over IDFC Mayura for UPI use case)"
    ],
    loungeAccess: { domestic: 8, international: 0 },
    welcomeBonus: "ixigo Plus 1-year membership worth ₹1,400",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 360000,
    rating: 4.3,
    reviewCount: 2345,
    imageUrl: "/cards/au-ixigo.jpg",
    cardColor: "from-orange-600 via-red-600 to-orange-700",
    featured: false,
    popular: true
  }
]
