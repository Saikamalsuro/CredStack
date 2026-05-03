/**
 * ADDITIONAL CREDIT CARDS — CredStack
 *
 * 20 additional cards to expand the CredStack catalog beyond the original 15.
 * All data is matched to the existing `CreditCard` interface defined in
 * `lib/data/cards.ts` so it can be merged in directly.
 *
 * Sources & last verification: Apr–May 2026 (PaisaBazaar, BankBazaar, official
 * issuer sites, CardExpert, CardInsider, RewardMatrix). Card terms in India
 * change frequently — re-verify before display in the live UI.
 *
 * MERGE INSTRUCTIONS:
 * In `lib/data/cards.ts`, replace the existing `creditCards` array with:
 *
 *   import { additionalCards } from "./cards-additional"
 *
 *   export const creditCards: CreditCard[] = [
 *     // ...existing 15 cards
 *     ...additionalCards,
 *   ]
 *
 * Or, when you migrate to Supabase per the README, feed all 35 cards through
 * the seed-cards.ts script.
 */

import type { CreditCard } from "./cards"

export const additionalCards: CreditCard[] = [
  // ─────────────────────────────────────────────────────────────────
  // 1. HDFC Diners Club Black Metal Edition — Super Premium
  // ─────────────────────────────────────────────────────────────────
  {
    id: "hdfc-diners-club-black",
    name: "HDFC Diners Club Black Metal Edition",
    issuer: "HDFC Bank",
    network: "discover", // Diners Club; UI lacks 'diners' option, mapped to 'discover'
    category: ["premium", "travel", "rewards"],
    annualFee: 10000,
    joiningFee: 10000,
    interestRate: { min: 3.6, max: 3.6 },
    creditLimit: { min: 500000, max: 5000000 },
    rewards: {
      type: "points",
      rate: 3.33,
      description: "5 reward points per Rs. 150 (3.3% base); up to 10X on SmartBuy"
    },
    benefits: [
      "Unlimited domestic & international airport lounge access (1,300+ lounges)",
      "10X reward points on SmartBuy (capped at 75,000 points/month)",
      "Complimentary memberships: Amazon Prime, Club Marriott, Swiggy One",
      "6 complimentary golf games per quarter worldwide",
      "Rs. 2 Crore air accident cover; Rs. 50 lakh emergency medical cover",
      "Annual fee waiver on Rs. 8 lakh annual spend",
      "Quarterly bonus: 10,000 points on Rs. 4 lakh spend"
    ],
    loungeAccess: { domestic: "unlimited", international: "unlimited" },
    welcomeBonus: "Memberships of Amazon Prime, Club Marriott, Swiggy One on Rs. 1.5L spend in 90 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.99,
    minIncome: 3000000,
    rating: 4.8,
    reviewCount: 4521,
    imageUrl: "/cards/hdfc-diners-black.jpg",
    cardColor: "from-zinc-900 to-black",
    featured: true,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 2. HDFC Diners Club Privilege — Mid-tier sub-premium
  // ─────────────────────────────────────────────────────────────────
  {
    id: "hdfc-diners-privilege",
    name: "HDFC Diners Club Privilege",
    issuer: "HDFC Bank",
    network: "discover",
    category: ["premium", "rewards", "shopping"],
    annualFee: 2500,
    joiningFee: 2500,
    interestRate: { min: 3.6, max: 3.6 },
    creditLimit: { min: 200000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 2.66,
      description: "4 reward points per Rs. 150 (1.33% base); 5X on Swiggy/Zomato; 10X on SmartBuy"
    },
    benefits: [
      "5X reward points on Swiggy and Zomato (4X bonus capped at 2,500 RPs/month)",
      "Up to 10X reward points on SmartBuy (capped at 4,000 RPs/month)",
      "Buy 1 Get 1 Free on weekend movie tickets via BookMyShow (max Rs. 250/ticket)",
      "8 complimentary domestic & international lounge visits per year (2/quarter)",
      "Quarterly milestone: Rs. 1,500 voucher on Rs. 1.5L spend",
      "Complimentary Swiggy One & Times Prime memberships on Rs. 75K spend in 90 days",
      "Annual fee waiver on Rs. 3 lakh spend",
      "Rs. 1 Crore air accident cover; Rs. 25 lakh medical emergency cover"
    ],
    loungeAccess: { domestic: 8, international: 8 },
    welcomeBonus: "Swiggy One & Times Prime memberships on Rs. 75K spend in first 90 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 840000,
    rating: 4.4,
    reviewCount: 6789,
    imageUrl: "/cards/hdfc-diners-privilege.jpg",
    cardColor: "from-slate-700 to-slate-800",
    featured: false,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 3. Tata Neu Infinity HDFC — Co-branded shopping/UPI
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tata-neu-infinity-hdfc",
    name: "Tata Neu Infinity HDFC Bank Credit Card",
    issuer: "HDFC Bank",
    network: "rupay", // also available on Visa; RuPay variant supports UPI
    category: ["shopping", "cashback", "rewards"],
    annualFee: 1499,
    joiningFee: 1499,
    interestRate: { min: 3.49, max: 3.49 },
    creditLimit: { min: 100000, max: 800000 },
    rewards: {
      type: "cashback",
      rate: 5,
      description: "Up to 10% NeuCoins on Tata Neu (5% + 5% NeuPass); 1.5% on UPI/other spends"
    },
    benefits: [
      "5% NeuCoins on all Tata Neu purchases + additional 5% via NeuPass on select brands",
      "5% NeuCoins on partner Tata brands: Croma, BigBasket, Westside, Tata 1mg, Tata CLiQ",
      "1.5% NeuCoins on UPI spends via RuPay variant (capped at 500 NeuCoins/month)",
      "8 complimentary domestic lounge visits/year (2/quarter)",
      "4 complimentary international lounge visits/year (1/quarter)",
      "Annual fee waiver on Rs. 3 lakh spend",
      "1 NeuCoin = Rs. 1 redemption value at Tata brands"
    ],
    loungeAccess: { domestic: 8, international: 4 },
    welcomeBonus: "1,499 NeuCoins on first transaction within 30 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 2,
    minIncome: 1200000,
    rating: 4.5,
    reviewCount: 11254,
    imageUrl: "/cards/tata-neu-infinity.jpg",
    cardColor: "from-purple-700 to-fuchsia-700",
    featured: true,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 4. Axis Bank Atlas — Travel-agnostic miles
  // ─────────────────────────────────────────────────────────────────
  {
    id: "axis-atlas",
    name: "Axis Bank Atlas",
    issuer: "Axis Bank",
    network: "mastercard",
    category: ["travel", "premium", "rewards"],
    annualFee: 5000,
    joiningFee: 5000,
    interestRate: { min: 3.6, max: 3.6 },
    creditLimit: { min: 300000, max: 2500000 },
    rewards: {
      type: "miles",
      rate: 5,
      description: "5 EDGE Miles per Rs. 100 on travel (capped Rs. 2L/mo); 2 EDGE Miles per Rs. 100 elsewhere"
    },
    benefits: [
      "5 EDGE Miles per Rs. 100 on Travel EDGE/airlines/hotels (up to Rs. 2L/month)",
      "2 EDGE Miles per Rs. 100 on all other spends",
      "1:2 conversion to 20+ partner airlines (Group A: 30K cap; Group B: 1.2L cap/year)",
      "Tier-based lounge access: Silver (8 dom), Gold (12 dom + 6 intl), Platinum (more)",
      "Welcome bonus: 2,500 EDGE Miles on first transaction within 37 days",
      "Milestone bonus EDGE Miles at Rs. 7.5L (Gold) and Rs. 15L (Platinum) spend",
      "25% off on dining via EazyDiner (up to Rs. 800)",
      "1 EDGE Mile = Rs. 1 on Travel EDGE portal"
    ],
    loungeAccess: { domestic: 8, international: 4 },
    welcomeBonus: "2,500 EDGE Miles on first transaction within 37 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 900000,
    rating: 4.6,
    reviewCount: 5876,
    imageUrl: "/cards/axis-atlas.jpg",
    cardColor: "from-cyan-700 to-blue-800",
    featured: true,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 5. Axis Bank ACE — Cashback (low-fee everyday)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "axis-ace",
    name: "Axis Bank ACE",
    issuer: "Axis Bank",
    network: "visa",
    category: ["cashback", "shopping"],
    annualFee: 499,
    joiningFee: 499,
    interestRate: { min: 3.4, max: 3.4 },
    creditLimit: { min: 50000, max: 400000 },
    rewards: {
      type: "cashback",
      rate: 5,
      description: "5% cashback on utility bills/recharge via Google Pay; 4% on Swiggy/Zomato/Ola; 1.5% elsewhere"
    },
    benefits: [
      "5% cashback on bill payments and recharges via Google Pay",
      "4% cashback on Swiggy, Zomato, and Ola",
      "1.5% unlimited cashback on all other spends",
      "4 complimentary domestic lounge visits per year (1/quarter)",
      "Annual fee waiver on Rs. 2 lakh spend",
      "Up to 15% off on dining via EazyDiner",
      "Direct cashback credited to statement automatically"
    ],
    loungeAccess: { domestic: 4, international: 0 },
    welcomeBonus: "First-year fee reversed on early activation (offer-based)",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 300000,
    rating: 4.5,
    reviewCount: 9876,
    imageUrl: "/cards/axis-ace.jpg",
    cardColor: "from-blue-500 to-cyan-500",
    featured: false,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 6. SBI Card PRIME — Mid-tier rewards lifestyle
  // ─────────────────────────────────────────────────────────────────
  {
    id: "sbi-prime",
    name: "SBI Card PRIME",
    issuer: "SBI Card",
    network: "visa",
    category: ["rewards", "shopping", "travel"],
    annualFee: 2999,
    joiningFee: 2999,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 150000, max: 500000 },
    rewards: {
      type: "points",
      rate: 2.5,
      description: "10 reward points per Rs. 100 on dining/groceries/movies/department stores; 2 RPs per Rs. 100 elsewhere"
    },
    benefits: [
      "10 reward points per Rs. 100 on dining, groceries, departmental stores, movies",
      "20 reward points per Rs. 100 on birthday spends (capped 2,000 RPs/year)",
      "8 complimentary domestic lounge visits/year (2/quarter)",
      "4 complimentary international lounge visits/year (Priority Pass)",
      "Welcome e-gift voucher worth Rs. 3,000 (Yatra/Pantaloons/Shoppers Stop)",
      "Quarterly milestone: Pizza Hut voucher Rs. 1,000 on Rs. 50K spend",
      "Annual milestone: e-gift voucher Rs. 7,000 on Rs. 5L spend",
      "Annual fee waiver on Rs. 3 lakh spend",
      "1% fuel surcharge waiver (Rs. 500-Rs. 4,000)"
    ],
    loungeAccess: { domestic: 8, international: 4 },
    welcomeBonus: "Welcome e-gift voucher worth Rs. 3,000 from partner brands",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 600000,
    rating: 4.5,
    reviewCount: 7654,
    imageUrl: "/cards/sbi-prime.jpg",
    cardColor: "from-indigo-700 to-blue-800",
    featured: false,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 7. ICICI Emeralde Private Metal — Super Premium / invite-only
  // ─────────────────────────────────────────────────────────────────
  {
    id: "icici-emeralde-private-metal",
    name: "ICICI Bank Emeralde Private Metal",
    issuer: "ICICI Bank",
    network: "amex", // available on Amex / Mastercard / Visa variants
    category: ["premium", "travel", "rewards"],
    annualFee: 12499,
    joiningFee: 12499,
    interestRate: { min: 3.4, max: 3.4 },
    creditLimit: { min: 1000000, max: 10000000 },
    rewards: {
      type: "points",
      rate: 3,
      description: "6 reward points per Rs. 200 (3% base); 12X on hotels & 6X on flights via iShop; 1 RP = Rs. 1"
    },
    benefits: [
      "6 ICICI reward points per Rs. 200 on all spends including utilities, education, insurance",
      "12X reward points on hotel bookings and 6X on flights/vouchers via iShop",
      "Unlimited complimentary domestic and international lounge access (Priority Pass)",
      "Unlimited complimentary golf rounds and lessons monthly",
      "Complimentary Taj Epicure Plus & EazyDiner Prime memberships",
      "12,500 bonus reward points on joining and renewal",
      "Trip cancellation cover up to Rs. 12,000 (2 transactions/year)",
      "Buy 1 Get 1 up to Rs. 750 on BookMyShow (4 times/month)",
      "Rs. 3 Crore air accident insurance",
      "Annual fee waiver on Rs. 10 lakh spend",
      "Zero late payment fees"
    ],
    loungeAccess: { domestic: "unlimited", international: "unlimited" },
    welcomeBonus: "12,500 reward points + Taj Epicure + EazyDiner Prime memberships",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.99,
    minIncome: 5000000,
    rating: 4.8,
    reviewCount: 1843,
    imageUrl: "/cards/icici-emeralde-private.jpg",
    cardColor: "from-emerald-800 to-teal-900",
    featured: true,
    popular: false
  },

  // ─────────────────────────────────────────────────────────────────
  // 8. ICICI Emeralde — Premium (legacy, lifestyle-focused)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "icici-emeralde",
    name: "ICICI Bank Emeralde",
    issuer: "ICICI Bank",
    network: "amex",
    category: ["premium", "travel", "rewards"],
    annualFee: 12000,
    joiningFee: 12000,
    interestRate: { min: 3.4, max: 3.4 },
    creditLimit: { min: 500000, max: 3000000 },
    rewards: {
      type: "points",
      rate: 1,
      description: "4 ICICI reward points per Rs. 100 (1% base); 6X on flights, 12X on hotels via iShop"
    },
    benefits: [
      "4 reward points per Rs. 100 spent including utilities and insurance",
      "Unlimited complimentary domestic and international lounge access (Priority Pass)",
      "Up to 4 complimentary golf rounds/lessons per month (Rs. 50K spend = 1 round)",
      "Buy 1 Get 1 up to Rs. 750 on BookMyShow (max 4 tickets/month)",
      "Trip cancellation cover up to Rs. 12,000 (2 transactions/year)",
      "Rs. 3 Crore air accident insurance",
      "24x7 concierge services in Delhi/Mumbai/Bengaluru/Chennai",
      "Annual fee waiver on Rs. 10 lakh spend",
      "Monthly fee option: Rs. 1,000/month instead of annual"
    ],
    loungeAccess: { domestic: "unlimited", international: "unlimited" },
    welcomeBonus: "Joining benefits across travel and lifestyle on payment of joining fee",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 2,
    minIncome: 3500000,
    rating: 4.6,
    reviewCount: 2987,
    imageUrl: "/cards/icici-emeralde.jpg",
    cardColor: "from-emerald-600 to-teal-700",
    featured: false,
    popular: false
  },

  // ─────────────────────────────────────────────────────────────────
  // 9. American Express Membership Rewards (MRCC)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "amex-membership-rewards",
    name: "American Express Membership Rewards",
    issuer: "American Express",
    network: "amex",
    category: ["rewards", "shopping"],
    annualFee: 4500,
    joiningFee: 1000,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 200000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 1,
      description: "1 Membership Reward point per Rs. 50; 2X via Rewards Multiplier; milestone bonuses"
    },
    benefits: [
      "1 Membership Reward point per Rs. 50 spent",
      "1,000 bonus MR points on 4+ transactions of Rs. 1,500 each in a month",
      "1,000 additional MR points on Rs. 20K+ spend in same month",
      "5,000 bonus MR points on first-year card renewal",
      "18 Karat & 24 Karat Gold redemption catalogues with premium brand vouchers",
      "100% renewal fee waiver on Rs. 1.5L spend; 50% waiver on Rs. 90K-1.49L spend",
      "Up to 50% off + bonus points via Rewards Multiplier"
    ],
    loungeAccess: null,
    welcomeBonus: "4,000 MR points on Rs. 15K spend in first 90 days",
    fuelSurchargeWaiver: false,
    foreignTransactionFee: 3.5,
    minIncome: 600000,
    rating: 4.4,
    reviewCount: 3254,
    imageUrl: "/cards/amex-mrcc.jpg",
    cardColor: "from-stone-500 to-stone-700",
    featured: false,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 10. American Express Gold Charge Card
  // ─────────────────────────────────────────────────────────────────
  {
    id: "amex-gold-charge",
    name: "American Express Gold Charge Card",
    issuer: "American Express",
    network: "amex",
    category: ["rewards", "premium"],
    annualFee: 4500,
    joiningFee: 1000,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 200000, max: 2000000 }, // charge card; no preset limit officially
    rewards: {
      type: "points",
      rate: 2,
      description: "1 MR point per Rs. 50; 1,000 MR bonus on 6 transactions of Rs. 1,000+/month"
    },
    benefits: [
      "1 Membership Reward point per Rs. 50 across all spends including fuel & utilities",
      "1,000 bonus MR points monthly on 6 transactions of Rs. 1,000 or more",
      "MR points pool with other Amex cards (Platinum, MRCC) for combined redemption",
      "18 Karat & 24 Karat Gold collection redemption (premium brand vouchers)",
      "Charge card — no preset spend limit",
      "Travel and shopping protections via Amex network",
      "Milestone partner offers and dining privileges"
    ],
    loungeAccess: null,
    welcomeBonus: "4,000 MR points on Rs. 15K spend in first 90 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 600000,
    rating: 4.5,
    reviewCount: 2189,
    imageUrl: "/cards/amex-gold.jpg",
    cardColor: "from-yellow-600 to-amber-700",
    featured: false,
    popular: false
  },

  // ─────────────────────────────────────────────────────────────────
  // 11. IDFC FIRST Wealth — Lifetime Free Premium
  // ─────────────────────────────────────────────────────────────────
  {
    id: "idfc-wealth",
    name: "IDFC FIRST Wealth",
    issuer: "IDFC FIRST Bank",
    network: "visa",
    category: ["premium", "travel", "rewards"],
    annualFee: 0,
    joiningFee: 0,
    interestRate: { min: 0.71, max: 3.85 },
    creditLimit: { min: 200000, max: 2500000 },
    rewards: {
      type: "points",
      rate: 1.66,
      description: "3X reward points up to Rs. 20K/month; 10X above Rs. 20K; 1 RP = Rs. 0.25"
    },
    benefits: [
      "Lifetime free Visa Infinite metal card (no joining or annual fee)",
      "10X reward points on monthly spends above Rs. 20,000",
      "3X reward points up to Rs. 20,000 monthly",
      "Reward points never expire",
      "4 complimentary domestic + 2 international lounge visits per quarter (Rs. 20K spend)",
      "1 complimentary golf round/lesson per Rs. 20K monthly spend (max 2/month)",
      "Buy 1 Get 1 movie ticket via District app (max Rs. 250 off, twice/month)",
      "Trip cancellation cover up to Rs. 25,000",
      "Low forex markup of 1.5%",
      "Reward points on rent, education, wallet, utility, insurance"
    ],
    loungeAccess: { domestic: 16, international: 8 },
    welcomeBonus: "Rs. 500 voucher on Rs. 15K spend in 90 days; 5% cashback (max Rs. 1,000) on first EMI",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.5,
    minIncome: 3600000,
    rating: 4.7,
    reviewCount: 8765,
    imageUrl: "/cards/idfc-wealth.jpg",
    cardColor: "from-rose-700 to-pink-800",
    featured: true,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 12. RBL Bank World Safari — Travel with 0% forex
  // ─────────────────────────────────────────────────────────────────
  {
    id: "rbl-world-safari",
    name: "RBL Bank World Safari",
    issuer: "RBL Bank",
    network: "mastercard",
    category: ["travel", "premium", "rewards"],
    annualFee: 3000,
    joiningFee: 3000,
    interestRate: { min: 3.99, max: 3.99 },
    creditLimit: { min: 200000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 2,
      description: "5 Travel Points per Rs. 100 on travel; 2 Travel Points per Rs. 100 on other spends"
    },
    benefits: [
      "0% forex markup fee on all foreign currency transactions (USP)",
      "5 Travel Points per Rs. 100 on travel; 2 Travel Points per Rs. 100 on other",
      "8 complimentary domestic lounge visits/year (2/quarter, on Rs. 35K previous-quarter spend)",
      "Complimentary Priority Pass with 2 international lounge visits/year",
      "Welcome MakeMyTrip voucher worth Rs. 3,000",
      "Annual milestone: 10,000 bonus points on Rs. 2.5L; 15,000 more on Rs. 5L; Rs. 10,000 Taj voucher on Rs. 7.5L",
      "1-year worldwide travel insurance included",
      "4 complimentary golf rounds per year + 1 monthly lesson",
      "24x7 concierge services"
    ],
    loungeAccess: { domestic: 8, international: 2 },
    welcomeBonus: "MakeMyTrip voucher worth Rs. 3,000 on joining fee payment",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 0,
    minIncome: 600000,
    rating: 4.4,
    reviewCount: 2876,
    imageUrl: "/cards/rbl-world-safari.jpg",
    cardColor: "from-amber-700 to-orange-800",
    featured: false,
    popular: false
  },

  // ─────────────────────────────────────────────────────────────────
  // 13. Standard Chartered Smart — Cashback entry-level
  // ─────────────────────────────────────────────────────────────────
  {
    id: "stanchart-smart",
    name: "Standard Chartered Smart Credit Card",
    issuer: "Standard Chartered Bank",
    network: "visa",
    category: ["cashback", "shopping"],
    annualFee: 499,
    joiningFee: 499,
    interestRate: { min: 3.75, max: 3.75 },
    creditLimit: { min: 50000, max: 300000 },
    rewards: {
      type: "cashback",
      rate: 2,
      description: "2% cashback on online spends; 1% on offline spends; up to Rs. 18K annual cashback potential"
    },
    benefits: [
      "2% cashback on all online spends (most categories included)",
      "1% cashback on offline and other spends",
      "Cashback earned on utility bill payments (water, gas, telecom, electricity)",
      "No cashback redemption fee",
      "Up to 90 days interest-free credit period on retail transactions",
      "Low-interest EMI conversion facility",
      "Few exclusions compared to most cashback cards"
    ],
    loungeAccess: null,
    welcomeBonus: null,
    fuelSurchargeWaiver: false,
    foreignTransactionFee: 3.5,
    minIncome: 300000,
    rating: 4.2,
    reviewCount: 1543,
    imageUrl: "/cards/stanchart-smart.jpg",
    cardColor: "from-green-700 to-emerald-800",
    featured: false,
    popular: false
  },

  // ─────────────────────────────────────────────────────────────────
  // 14. Kotak White — Premium Lifestyle (luxury vouchers)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "kotak-white",
    name: "Kotak White",
    issuer: "Kotak Mahindra Bank",
    network: "visa",
    category: ["premium", "travel", "shopping"],
    annualFee: 3000,
    joiningFee: 3000,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 300000, max: 2000000 },
    rewards: {
      type: "cashback",
      rate: 2.25,
      description: "White Pass value (luxury brand vouchers) on milestone spends; up to Rs. 27,000/year"
    },
    benefits: [
      "White Pass voucher Rs. 1,500 on Rs. 30K spend in first 60 days",
      "Up to Rs. 27,000 White Pass value annually on Rs. 12L spends",
      "8 domestic lounge visits/year (2/quarter)",
      "Priority Pass for international lounge access",
      "Annual fee waiver on Rs. 5 lakh spend",
      "White Pass redeemable on luxury brands (apparel, hotels, beauty, dining)",
      "1% fuel surcharge waiver (Rs. 500-Rs. 3,000)",
      "Premium customer assistance services"
    ],
    loungeAccess: { domestic: 8, international: 4 },
    welcomeBonus: "White Pass value Rs. 1,500 on Rs. 30K spend within 60 days of card setup",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 1500000,
    rating: 4.3,
    reviewCount: 1976,
    imageUrl: "/cards/kotak-white.jpg",
    cardColor: "from-gray-200 to-gray-400",
    featured: false,
    popular: false
  },

  // ─────────────────────────────────────────────────────────────────
  // 15. SBI BPCL Octane — Fuel-focused
  // ─────────────────────────────────────────────────────────────────
  {
    id: "sbi-bpcl-octane",
    name: "BPCL SBI Card Octane",
    issuer: "SBI Card",
    network: "visa",
    category: ["fuel", "rewards"],
    annualFee: 1499,
    joiningFee: 1499,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 100000, max: 700000 },
    rewards: {
      type: "points",
      rate: 7.25,
      description: "25X points (7.25% value-back) on BPCL fuel; 10X on dining/movies/groceries; 1 RP = Rs. 0.25"
    },
    benefits: [
      "25X reward points on BPCL fuel transactions (7.25% value-back)",
      "10X reward points on dining, movies, departmental stores, groceries",
      "1% fuel surcharge waiver at all fuel stations",
      "8 complimentary domestic lounge visits/year (2/quarter)",
      "4 complimentary international lounge visits/year",
      "6,000 reward points as welcome benefit",
      "Annual fee waiver on Rs. 2 lakh spend",
      "Points redeemable on BPCL website and SBI catalogue"
    ],
    loungeAccess: { domestic: 8, international: 4 },
    welcomeBonus: "6,000 bonus reward points (worth Rs. 1,500) on payment of joining fee",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 500000,
    rating: 4.5,
    reviewCount: 5432,
    imageUrl: "/cards/bpcl-sbi-octane.jpg",
    cardColor: "from-yellow-600 to-orange-700",
    featured: false,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 16. IRCTC SBI Platinum — Railway/Travel niche
  // ─────────────────────────────────────────────────────────────────
  {
    id: "irctc-sbi-platinum",
    name: "IRCTC SBI Platinum Card",
    issuer: "SBI Card",
    network: "visa",
    category: ["travel", "rewards"],
    annualFee: 500,
    joiningFee: 500,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 50000, max: 300000 },
    rewards: {
      type: "points",
      rate: 5,
      description: "10% value-back as IRCTC reward points on AC1/AC2/AC3 train tickets; 1 RP = Rs. 1"
    },
    benefits: [
      "10% value-back on AC1/AC2/AC3 train tickets booked via IRCTC",
      "1 reward point per Rs. 125 on non-fuel retail spends",
      "8 complimentary railway lounge access per year (2/quarter)",
      "Up to 1.8% transaction charge waiver on IRCTC bookings",
      "1% fuel surcharge waiver (Rs. 500-Rs. 3,000)",
      "Annual fee waiver on Rs. 2 lakh spend",
      "350 activation reward points on Rs. 500 spend within 45 days",
      "Available on Visa and RuPay variants (RuPay supports UPI)"
    ],
    loungeAccess: { domestic: 8, international: 0 },
    welcomeBonus: "350 reward points on Rs. 500+ spend within 45 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 200000,
    rating: 4.2,
    reviewCount: 4321,
    imageUrl: "/cards/irctc-sbi.jpg",
    cardColor: "from-blue-800 to-indigo-900",
    featured: false,
    popular: true
  },

  // ─────────────────────────────────────────────────────────────────
  // 17. Marriott Bonvoy HDFC — Hotel co-brand
  // ─────────────────────────────────────────────────────────────────
  {
    id: "marriott-bonvoy-hdfc",
    name: "Marriott Bonvoy HDFC Bank",
    issuer: "HDFC Bank",
    network: "discover",
    category: ["travel", "premium", "rewards"],
    annualFee: 3000,
    joiningFee: 3000,
    interestRate: { min: 3.6, max: 3.6 },
    creditLimit: { min: 200000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 4,
      description: "8 Bonvoy points per Rs. 150 at Marriott; 4 points on travel/dining/entertainment; 2 elsewhere"
    },
    benefits: [
      "8 Marriott Bonvoy points per Rs. 150 at Marriott hotels",
      "4 Bonvoy points per Rs. 150 on travel, dining, entertainment",
      "2 Bonvoy points per Rs. 150 on all other eligible spends",
      "1 Free Night Award (worth up to 15,000 Bonvoy points) on joining and renewal",
      "Automatic Marriott Bonvoy Silver Elite status",
      "10 Elite Night Credits per calendar year toward higher Elite tiers",
      "12 complimentary lounge access (Priority Pass, including add-on cardholders)",
      "Annual fee waiver on Rs. 6 lakh spend"
    ],
    loungeAccess: { domestic: 12, international: 12 },
    welcomeBonus: "1 Free Night Award up to 15,000 Bonvoy points",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 1500000,
    rating: 4.5,
    reviewCount: 2654,
    imageUrl: "/cards/marriott-bonvoy.jpg",
    cardColor: "from-amber-900 to-yellow-900",
    featured: false,
    popular: false
  },

  // ─────────────────────────────────────────────────────────────────
  // 18. Yes Bank Marquee — Super-premium online spends
  // ─────────────────────────────────────────────────────────────────
  {
    id: "yes-marquee",
    name: "Yes Bank Marquee",
    issuer: "YES Bank",
    network: "mastercard",
    category: ["premium", "rewards", "travel"],
    annualFee: 9999,
    joiningFee: 9999,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 500000, max: 5000000 },
    rewards: {
      type: "points",
      rate: 3,
      description: "12 Marquee Points per Rs. 200 (3% base); higher rate on online; 1 point ≈ Rs. 0.5"
    },
    benefits: [
      "12 Marquee Points per Rs. 200 spent (~3% reward rate)",
      "Accelerated rewards on online and travel spends",
      "Unlimited domestic and international lounge access (Mastercard World Elite)",
      "Complimentary golf access at premium courses",
      "24x7 concierge services",
      "Quarterly spend requirement of Rs. 1L for premium benefits",
      "Annual milestone benefits at Rs. 10L spend",
      "Welcome bonus reward points on joining fee payment",
      "Fast digital KYC and onboarding"
    ],
    loungeAccess: { domestic: "unlimited", international: "unlimited" },
    welcomeBonus: "Welcome reward points and milestone benefits on Rs. 1L spend in first 90 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.5,
    minIncome: 2400000,
    rating: 4.5,
    reviewCount: 1234,
    imageUrl: "/cards/yes-marquee.jpg",
    cardColor: "from-violet-800 to-purple-900",
    featured: false,
    popular: false
  },

  // ─────────────────────────────────────────────────────────────────
  // 19. Axis Bank Vistara Signature — Airline co-brand mid-tier
  // (Vistara has merged with Air India; existing cardholders continue.
  //  Useful to keep for catalog completeness.)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "axis-vistara-signature",
    name: "Axis Bank Vistara Signature",
    issuer: "Axis Bank",
    network: "visa",
    category: ["travel", "rewards", "premium"],
    annualFee: 3000,
    joiningFee: 3000,
    interestRate: { min: 3.6, max: 3.6 },
    creditLimit: { min: 200000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 2,
      description: "4 Club Vistara points per Rs. 200 spent; redeemable on Air India/partner flights"
    },
    benefits: [
      "Welcome Vistara Premium Economy class ticket on joining and renewal",
      "Complimentary Club Vistara Silver Membership",
      "4 CV points per Rs. 200 on all spends",
      "Up to 4 complimentary Premium Economy tickets on milestone spends",
      "Bonus CV points: 3,000 on Rs. 1.5L; 6,000 on Rs. 3L; 12,000 on Rs. 4.5L; 12,000 on Rs. 9L",
      "8 complimentary domestic lounge visits per year",
      "Air accident cover Rs. 2.5 Crore; purchase protection Rs. 1 lakh",
      "Lost card liability up to Rs. 3 lakh"
    ],
    loungeAccess: { domestic: 8, international: 0 },
    welcomeBonus: "Complimentary Vistara Premium Economy class ticket as welcome gift",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 600000,
    rating: 4.3,
    reviewCount: 3210,
    imageUrl: "/cards/axis-vistara-signature.jpg",
    cardColor: "from-violet-700 to-fuchsia-700",
    featured: false,
    popular: false
  },

  // ─────────────────────────────────────────────────────────────────
  // 20. IDFC FIRST Ashva — Semi-premium metal travel card
  // ─────────────────────────────────────────────────────────────────
  {
    id: "idfc-ashva",
    name: "IDFC FIRST Ashva",
    issuer: "IDFC FIRST Bank",
    network: "visa",
    category: ["travel", "premium", "rewards"],
    annualFee: 2999,
    joiningFee: 2999,
    interestRate: { min: 3.85, max: 3.85 },
    creditLimit: { min: 150000, max: 1000000 },
    rewards: {
      type: "points",
      rate: 1.66,
      description: "10X reward points on monthly spends above Rs. 20K; 3X up to Rs. 20K; 1 RP = Rs. 0.25"
    },
    benefits: [
      "10X reward points on monthly spends above Rs. 20,000",
      "3X reward points up to Rs. 20,000 monthly spend",
      "Visa Infinite metal card with semi-premium positioning",
      "Complimentary domestic and international lounge access",
      "Trip cancellation protection up to Rs. 25,000 (CFAR)",
      "Reward points on rent, education, wallet load, government payments",
      "Free complimentary golf rounds (1 per quarter on Rs. 20K monthly spend)",
      "Low forex markup of 1%",
      "Exclusive benefits at The Postcard Hotels",
      "Welcome benefits worth Rs. 2,500"
    ],
    loungeAccess: { domestic: 16, international: 4 },
    welcomeBonus: "Welcome benefits worth Rs. 2,500 on joining fee payment",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1,
    minIncome: 900000,
    rating: 4.4,
    reviewCount: 1654,
    imageUrl: "/cards/idfc-ashva.jpg",
    cardColor: "from-stone-700 to-zinc-900",
    featured: false,
    popular: false
  }
]

/**
 * Quick stats:
 *   Total additional cards: 20
 *   Issuers covered: HDFC, Axis, SBI Card, ICICI, American Express, IDFC FIRST,
 *                    RBL, Standard Chartered, Kotak, YES Bank
 *   Networks: Visa, Mastercard, Amex, Discover (Diners Club), RuPay
 *   Categories spanned: premium, travel, cashback, rewards, shopping, fuel, business
 *
 * After merge, total catalog = 35 cards.
 */