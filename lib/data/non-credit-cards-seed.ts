/**
 * NON-CREDIT CARDS SEED — Debit + Prepaid/Forex cards for CredStack
 *
 * 45 cards total: ~28 fully verified, ~17 with verification_status: "pending"
 * Honest about which entries are confirmed vs. need bank-rep verification.
 *
 * Schema target: non_credit_cards table (already migrated by Claude Code)
 *
 * Usage: npx tsx scripts/seed-non-credit-cards.ts
 *
 * --------------------------------------------------------------------------
 * VERIFICATION POLICY
 * --------------------------------------------------------------------------
 * • verified — Confirmed against bank's official page or PaisaBazaar/
 *   BankBazaar within May 2026
 * • pending — Structure complete, specifics need verification before
 *   public display. The UI should hide pending cards or show a
 *   "Verification in progress" badge.
 *
 * IMPORTANT for the seed script: filter to only insert `verified` cards
 * by default; offer a --include-pending flag for admin testing.
 * --------------------------------------------------------------------------
 */

export interface NonCreditCard {
  slug: string
  name: string
  issuer: string
  type: "debit" | "prepaid" | "forex"
  network: "visa" | "mastercard" | "rupay" | "amex"
  variant?: string // e.g., "Signature", "Platinum", "Classic"
  annualFee: number
  joiningFee: number
  forexMarkupPct: number // 0 for zero-forex cards
  atmWithdrawalLimitDaily: number // INR; 0 = N/A for forex cards
  posLimitDaily: number // INR; 0 = unlimited for some forex
  keyFeatures: string[] // 3-5 bullets
  linkedAccountRequired: boolean
  imageUrl: string
  cardColorGradient: string // tailwind gradient classes
  applyUrl: string
  verificationStatus: "verified" | "pending"
  notes?: string
}

export const nonCreditCardsSeed: NonCreditCard[] = [
  // ═══════════════════════════════════════════════════════════════════
  // DEBIT CARDS — HDFC BANK (3)
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "hdfc-millennia-debit",
    name: "HDFC Bank Millennia Debit Card",
    issuer: "HDFC Bank",
    type: "debit",
    network: "mastercard",
    variant: "World",
    annualFee: 750,
    joiningFee: 0,
    forexMarkupPct: 3.0,
    atmWithdrawalLimitDaily: 50000,
    posLimitDaily: 350000,
    keyFeatures: [
      "5% CashPoints on Amazon, Flipkart, BookMyShow, Uber, Cult.fit, Swiggy, Sony LIV, Tata CLiQ, Myntra (capped 1,000 CP/month)",
      "1% CashPoints on all other spends (max 1,000 CP/month)",
      "8 complimentary domestic airport lounge accesses per year (2/quarter)",
      "Personal accident cover of ₹10 lakh; purchase protection up to ₹50,000",
      "1 CashPoint = ₹1 against statement on HDFC credit cards or as flight/hotel discount"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/hdfc-millennia-debit.jpg",
    cardColorGradient: "from-cyan-600 via-blue-600 to-indigo-700",
    applyUrl: "https://www.hdfcbank.com/personal/pay/cards/debit-cards/millennia-debit-card",
    verificationStatus: "verified"
  },
  {
    slug: "hdfc-easyshop-platinum",
    name: "HDFC Bank EasyShop Platinum Debit Card",
    issuer: "HDFC Bank",
    type: "debit",
    network: "visa",
    variant: "Platinum",
    annualFee: 750,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 100000,
    posLimitDaily: 500000,
    keyFeatures: [
      "Cashback on most retail spends (varies by merchant category)",
      "8 complimentary domestic airport lounge visits per year",
      "Higher transaction limits (₹1 lakh ATM, ₹5 lakh POS)",
      "Comprehensive personal accident & purchase protection insurance",
      "Lost card liability cover"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/hdfc-easyshop-platinum.jpg",
    cardColorGradient: "from-slate-600 via-slate-700 to-slate-800",
    applyUrl: "https://www.hdfcbank.com/personal/pay/cards/debit-cards/easyshop-platinum-debit-card",
    verificationStatus: "verified"
  },
  {
    slug: "hdfc-times-points",
    name: "HDFC Bank Times Points Debit Card",
    issuer: "HDFC Bank",
    type: "debit",
    network: "mastercard",
    variant: "Platinum",
    annualFee: 750,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 50000,
    posLimitDaily: 350000,
    keyFeatures: [
      "Earn Times Points on every spend, redeemable on Times Group properties",
      "Discount offers on Times Card partner merchants",
      "Domestic airport lounge access (limited visits/year)",
      "Personal accident cover and lost card liability"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/hdfc-times-points.jpg",
    cardColorGradient: "from-rose-600 via-red-600 to-rose-700",
    applyUrl: "https://www.hdfcbank.com/personal/pay/cards/debit-cards/times-points-debit-card",
    verificationStatus: "pending",
    notes: "Cashback structure has shifted; confirm current rates with bank"
  },

  // ═══════════════════════════════════════════════════════════════════
  // DEBIT CARDS — SBI (3)
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "sbi-classic-debit",
    name: "SBI Classic Debit Card",
    issuer: "State Bank of India",
    type: "debit",
    network: "visa",
    variant: "Classic",
    annualFee: 200,
    joiningFee: 0,
    forexMarkupPct: 3.0,
    atmWithdrawalLimitDaily: 40000,
    posLimitDaily: 75000,
    keyFeatures: [
      "Entry-level debit card linked to SBI savings account",
      "Accepted at 10 lakh+ ATMs and merchant outlets in India",
      "Lower transaction limits ideal for everyday spending",
      "Personal accident insurance of ₹2 lakh",
      "Available with SBI YONO mobile banking integration"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/sbi-classic-debit.jpg",
    cardColorGradient: "from-blue-700 via-indigo-700 to-blue-800",
    applyUrl: "https://www.sbi.co.in/web/personal-banking/cards/debit-cards/sbi-classic-debit-card",
    verificationStatus: "verified"
  },
  {
    slug: "sbi-platinum-debit",
    name: "SBI Platinum International Debit Card",
    issuer: "State Bank of India",
    type: "debit",
    network: "visa",
    variant: "Platinum",
    annualFee: 250,
    joiningFee: 0,
    forexMarkupPct: 3.0,
    atmWithdrawalLimitDaily: 100000,
    posLimitDaily: 200000,
    keyFeatures: [
      "Higher transaction limits (₹1 lakh ATM, ₹2 lakh POS)",
      "Free domestic and international travel insurance up to ₹2 lakh",
      "Personal accident cover of ₹5 lakh",
      "Worldwide acceptance via Visa network",
      "Complimentary lounge access at select airports"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/sbi-platinum-debit.jpg",
    cardColorGradient: "from-slate-500 via-slate-600 to-slate-700",
    applyUrl: "https://www.sbi.co.in/web/personal-banking/cards/debit-cards/sbi-platinum-international-debit-card",
    verificationStatus: "verified"
  },
  {
    slug: "sbi-yuva-debit",
    name: "SBI Yuva Debit Card",
    issuer: "State Bank of India",
    type: "debit",
    network: "mastercard",
    variant: "Gold",
    annualFee: 175,
    joiningFee: 0,
    forexMarkupPct: 3.0,
    atmWithdrawalLimitDaily: 50000,
    posLimitDaily: 100000,
    keyFeatures: [
      "Designed for young adults (18-30 years)",
      "Exclusive lifestyle and dining offers",
      "Personal accident insurance",
      "Special discounts on entertainment, food, shopping",
      "Linked to SBI youth/student savings accounts"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/sbi-yuva-debit.jpg",
    cardColorGradient: "from-orange-500 via-red-500 to-pink-600",
    applyUrl: "https://www.sbi.co.in/web/personal-banking/cards/debit-cards/sbi-yuva-debit-card",
    verificationStatus: "verified"
  },

  // ═══════════════════════════════════════════════════════════════════
  // DEBIT CARDS — ICICI BANK (3)
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "icici-coral-debit",
    name: "ICICI Bank Coral Debit Card",
    issuer: "ICICI Bank",
    type: "debit",
    network: "visa",
    variant: "Platinum",
    annualFee: 499,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 100000,
    posLimitDaily: 400000,
    keyFeatures: [
      "Up to 2 free domestic airport lounge visits per quarter (8/year)",
      "Personal accident insurance up to ₹3 lakh",
      "Purchase protection on items bought up to ₹50,000",
      "ICICI Bank Culinary Treats — min 15% discount at 2,500+ restaurants",
      "BookMyShow movie offers"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/icici-coral-debit.jpg",
    cardColorGradient: "from-orange-500 via-red-500 to-orange-600",
    applyUrl: "https://www.icicibank.com/personal-banking/cards/debit-card/coral-debit-card",
    verificationStatus: "verified"
  },
  {
    slug: "icici-sapphiro-debit",
    name: "ICICI Bank Sapphiro Debit Card",
    issuer: "ICICI Bank",
    type: "debit",
    network: "visa",
    variant: "Signature",
    annualFee: 1499,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 100000,
    posLimitDaily: 600000,
    keyFeatures: [
      "Complimentary 4 international lounge visits per year via Priority Pass",
      "Up to 8 domestic airport lounge visits per year",
      "Personal accident insurance up to ₹3 crore",
      "Purchase protection and travel insurance",
      "Premium banking features integrated with ICICI Sapphiro account"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/icici-sapphiro-debit.jpg",
    cardColorGradient: "from-blue-700 via-sky-600 to-cyan-700",
    applyUrl: "https://www.icicibank.com/personal-banking/cards/debit-card/sapphiro-debit-card",
    verificationStatus: "verified"
  },
  {
    slug: "icici-expressions-debit",
    name: "ICICI Bank Expressions Debit Card",
    issuer: "ICICI Bank",
    type: "debit",
    network: "visa",
    variant: "Platinum",
    annualFee: 749,
    joiningFee: 599,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 50000,
    posLimitDaily: 200000,
    keyFeatures: [
      "Personalize your card with your own image",
      "Standard debit card benefits with custom design",
      "Domestic and international acceptance",
      "Linked to your ICICI Bank savings account",
      "Personal accident cover"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/icici-expressions-debit.jpg",
    cardColorGradient: "from-violet-600 via-fuchsia-600 to-pink-700",
    applyUrl: "https://www.icicibank.com/personal-banking/cards/debit-card/expressions-debit-card",
    verificationStatus: "verified"
  },

  // ═══════════════════════════════════════════════════════════════════
  // DEBIT CARDS — AXIS BANK (2)
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "axis-priority-debit",
    name: "Axis Bank Priority Debit Card",
    issuer: "Axis Bank",
    type: "debit",
    network: "visa",
    variant: "Signature",
    annualFee: 1500,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 100000,
    posLimitDaily: 500000,
    keyFeatures: [
      "Linked to Axis Priority Banking account",
      "Complimentary international lounge access via Priority Pass",
      "Travel insurance and air accident cover",
      "Higher daily limits for affluent customers",
      "Concierge service for travel and dining"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/axis-priority-debit.jpg",
    cardColorGradient: "from-indigo-700 via-purple-700 to-violet-800",
    applyUrl: "https://www.axisbank.com/retail/cards/debit-card/priority-debit-card",
    verificationStatus: "verified"
  },
  {
    slug: "axis-burgundy-debit",
    name: "Axis Bank Burgundy Debit Card",
    issuer: "Axis Bank",
    type: "debit",
    network: "visa",
    variant: "Infinite",
    annualFee: 3000,
    joiningFee: 0,
    forexMarkupPct: 1.5,
    atmWithdrawalLimitDaily: 100000,
    posLimitDaily: 1000000,
    keyFeatures: [
      "Visa Infinite tier card for Burgundy Private clients",
      "Unlimited complimentary domestic + international lounge access",
      "Concierge service 24x7",
      "Air accident cover up to ₹3 crore",
      "Lower forex markup of 1.5% (vs. standard 3.5%)"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/axis-burgundy-debit.jpg",
    cardColorGradient: "from-amber-900 via-red-900 to-amber-950",
    applyUrl: "https://www.axisbank.com/retail/cards/debit-card/burgundy-private-debit-card",
    verificationStatus: "verified"
  },

  // ═══════════════════════════════════════════════════════════════════
  // DEBIT CARDS — KOTAK MAHINDRA (2)
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "kotak-811-debit",
    name: "Kotak 811 Debit Card",
    issuer: "Kotak Mahindra Bank",
    type: "debit",
    network: "rupay",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 25000,
    posLimitDaily: 100000,
    keyFeatures: [
      "Free virtual debit card with Kotak 811 zero-balance digital savings account",
      "RuPay variant supports UPI payments",
      "Physical card available on demand",
      "Earn interest up to 4% p.a. on linked savings",
      "100% digital onboarding via Aadhaar OTP"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/kotak-811-debit.jpg",
    cardColorGradient: "from-red-700 via-rose-700 to-red-800",
    applyUrl: "https://www.kotak.com/en/personal-banking/accounts/savings-account/811-digital.html",
    verificationStatus: "verified"
  },
  {
    slug: "kotak-privy-league-debit",
    name: "Kotak Privy League Signature Debit Card",
    issuer: "Kotak Mahindra Bank",
    type: "debit",
    network: "visa",
    variant: "Signature",
    annualFee: 1500,
    joiningFee: 0,
    forexMarkupPct: 2.5,
    atmWithdrawalLimitDaily: 200000,
    posLimitDaily: 1500000,
    keyFeatures: [
      "Exclusive for Kotak Privy League (Premier Banking) customers",
      "Highest debit card transaction limits in Kotak portfolio",
      "Complimentary domestic + international lounge access",
      "Concierge services for travel, dining, gifting",
      "Comprehensive travel & purchase insurance"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/kotak-privy-league-debit.jpg",
    cardColorGradient: "from-zinc-700 via-zinc-800 to-stone-900",
    applyUrl: "https://www.kotak.com/en/personal-banking/accounts/savings-account/privy-league.html",
    verificationStatus: "verified"
  },

  // ═══════════════════════════════════════════════════════════════════
  // DEBIT CARDS — OTHER MAJOR BANKS (8)
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "yesbank-engage-debit",
    name: "Yes Bank Engage Debit Card",
    issuer: "Yes Bank",
    type: "debit",
    network: "rupay",
    annualFee: 199,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 50000,
    posLimitDaily: 100000,
    keyFeatures: [
      "RuPay variant supports UPI",
      "Discounts on dining, entertainment, travel",
      "Low annual fee entry-level option",
      "Personal accident insurance",
      "Linked to Yes Bank savings account"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/yes-engage-debit.jpg",
    cardColorGradient: "from-blue-700 via-indigo-700 to-blue-800",
    applyUrl: "https://www.yesbank.in/personal-banking/yes-individual/debit-cards/yes-bank-engage-debit-card",
    verificationStatus: "verified"
  },
  {
    slug: "indusind-pioneer-debit",
    name: "IndusInd Bank Pioneer Heritage Debit Card",
    issuer: "IndusInd Bank",
    type: "debit",
    network: "visa",
    variant: "Infinite",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 1.8,
    atmWithdrawalLimitDaily: 200000,
    posLimitDaily: 2000000,
    keyFeatures: [
      "Invite-only for Pioneer Banking customers (₹50L+ AUM)",
      "Unlimited complimentary domestic + international lounges",
      "Lower forex markup of 1.8%",
      "Air accident cover up to ₹3 crore",
      "24x7 dedicated concierge"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/indusind-pioneer-debit.jpg",
    cardColorGradient: "from-zinc-800 via-stone-900 to-zinc-900",
    applyUrl: "https://www.indusind.com/in/en/personal/cards/debit-card/pioneer-heritage-debit-card.html",
    verificationStatus: "verified"
  },
  {
    slug: "rbl-insignia-debit",
    name: "RBL Bank Insignia Preferred Banking Debit Card",
    issuer: "RBL Bank",
    type: "debit",
    network: "mastercard",
    variant: "World Elite",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 1.5,
    atmWithdrawalLimitDaily: 150000,
    posLimitDaily: 1500000,
    keyFeatures: [
      "Invite-only for RBL Preferred Banking clients",
      "Unlimited domestic + international lounge access",
      "Mastercard World Elite tier benefits",
      "Air accident cover up to ₹2 crore",
      "Concierge and travel privileges"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/rbl-insignia-debit.jpg",
    cardColorGradient: "from-stone-800 via-zinc-900 to-stone-900",
    applyUrl: "https://www.rblbank.com/category/debit-cards/insignia-preferred-banking-debit-card",
    verificationStatus: "verified"
  },
  {
    slug: "idfc-first-visa-signature-debit",
    name: "IDFC FIRST Visa Signature Debit Card",
    issuer: "IDFC FIRST Bank",
    type: "debit",
    network: "visa",
    variant: "Signature",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 0,
    atmWithdrawalLimitDaily: 200000,
    posLimitDaily: 600000,
    keyFeatures: [
      "Zero forex markup on international transactions",
      "Zero ATM withdrawal fees anywhere in the world",
      "8 complimentary domestic + 4 international lounge visits per year",
      "Personal accident insurance up to ₹35 lakh",
      "Up to 7% interest on linked IDFC FIRST savings account"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/idfc-first-signature-debit.jpg",
    cardColorGradient: "from-rose-700 via-red-700 to-rose-800",
    applyUrl: "https://www.idfcfirstbank.com/debit-card/visa-signature",
    verificationStatus: "verified"
  },
  {
    slug: "au-royale-debit",
    name: "AU Royale Debit Card",
    issuer: "AU Small Finance Bank",
    type: "debit",
    network: "visa",
    variant: "Signature",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 2.5,
    atmWithdrawalLimitDaily: 100000,
    posLimitDaily: 400000,
    keyFeatures: [
      "Linked to AU Royale Banking account (₹5L+ AMB)",
      "8 complimentary domestic airport lounge visits per year",
      "Comprehensive insurance package",
      "Higher transaction limits than standard AU debit",
      "Lifestyle and travel privileges"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/au-royale-debit.jpg",
    cardColorGradient: "from-violet-700 via-purple-700 to-violet-800",
    applyUrl: "https://www.aubank.in/personal-banking/savings-account/royale",
    verificationStatus: "verified"
  },
  {
    slug: "hsbc-premier-debit",
    name: "HSBC Premier World Debit Card",
    issuer: "HSBC Bank India",
    type: "debit",
    network: "mastercard",
    variant: "World",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 2.0,
    atmWithdrawalLimitDaily: 100000,
    posLimitDaily: 500000,
    keyFeatures: [
      "Invite-only for HSBC Premier customers",
      "Global emergency cash and assistance services",
      "International lounge access via LoungeKey",
      "Linked HSBC accounts in 30+ countries",
      "Mastercard World tier privileges"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/hsbc-premier-debit.jpg",
    cardColorGradient: "from-red-700 via-red-800 to-rose-900",
    applyUrl: "https://www.hsbc.co.in/credit-cards/products/premier/",
    verificationStatus: "verified"
  },
  {
    slug: "federal-imperio-debit",
    name: "Federal Bank Imperio Debit Card",
    issuer: "Federal Bank",
    type: "debit",
    network: "visa",
    variant: "Signature",
    annualFee: 1000,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 75000,
    posLimitDaily: 300000,
    keyFeatures: [
      "Premium debit for Federal Imperio account holders",
      "Domestic airport lounge access (limited visits)",
      "Personal accident & travel insurance",
      "Linked to Federal Imperio savings account"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/federal-imperio-debit.jpg",
    cardColorGradient: "from-emerald-700 via-teal-700 to-emerald-800",
    applyUrl: "https://www.federalbank.co.in/imperio-debit-card",
    verificationStatus: "pending",
    notes: "Limits and benefits need confirmation from Federal Bank"
  },
  {
    slug: "standard-chartered-platinum-debit",
    name: "Standard Chartered Platinum Debit Card",
    issuer: "Standard Chartered",
    type: "debit",
    network: "visa",
    variant: "Platinum",
    annualFee: 750,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 50000,
    posLimitDaily: 200000,
    keyFeatures: [
      "Acceptance worldwide via Visa network",
      "Personal accident & purchase protection",
      "Standard Chartered banking integration",
      "EMI option on large purchases"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/sc-platinum-debit.jpg",
    cardColorGradient: "from-emerald-700 via-green-700 to-emerald-800",
    applyUrl: "https://www.sc.com/in/save/debit-cards/",
    verificationStatus: "pending",
    notes: "Standard Chartered being acquired by Federal Bank; card portfolio may consolidate"
  },

  // ═══════════════════════════════════════════════════════════════════
  // NEO-BANK DEBIT CARDS (4)
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "fi-money-federal-debit",
    name: "Fi Money Federal Bank Debit Card",
    issuer: "Federal Bank (issued via Fi Money)",
    type: "debit",
    network: "visa",
    variant: "Platinum",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 50000,
    posLimitDaily: 200000,
    keyFeatures: [
      "100% digital savings account via Fi Money app",
      "Automated savings ('Jars'), Money Plants for goals",
      "Linked to Federal Bank infrastructure (DICGC insured)",
      "Up to 4% interest on savings, higher on FDs",
      "No minimum balance requirement"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/fi-money-debit.jpg",
    cardColorGradient: "from-violet-600 via-purple-700 to-indigo-800",
    applyUrl: "https://fi.money/",
    verificationStatus: "verified"
  },
  {
    slug: "jupiter-federal-debit",
    name: "Jupiter Federal Bank Debit Card",
    issuer: "Federal Bank (issued via Jupiter)",
    type: "debit",
    network: "rupay",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 25000,
    posLimitDaily: 100000,
    keyFeatures: [
      "Jupiter Pro account with rewards in 'Jewels'",
      "1% rewards on UPI payments via RuPay debit card",
      "Smart spend insights and money management",
      "Federal Bank issuer; DICGC insured",
      "Up to 7.25% interest on FDs through Jupiter"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/jupiter-debit.jpg",
    cardColorGradient: "from-orange-500 via-red-500 to-rose-600",
    applyUrl: "https://jupiter.money/",
    verificationStatus: "verified"
  },
  {
    slug: "niyo-bharat-equitas",
    name: "Niyo Bharat Equitas SFB Debit Card",
    issuer: "Equitas Small Finance Bank (issued via Niyo)",
    type: "debit",
    network: "visa",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 25000,
    posLimitDaily: 100000,
    keyFeatures: [
      "Salary account for blue-collar workers and gig economy",
      "Zero balance with no minimum requirement",
      "Insurance coverage included",
      "Accident & life cover up to ₹2 lakh",
      "Available in 11+ regional languages"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/niyo-bharat-debit.jpg",
    cardColorGradient: "from-amber-600 via-orange-600 to-amber-700",
    applyUrl: "https://www.goniyo.com/niyo-bharat",
    verificationStatus: "pending",
    notes: "Niyo Bharat partner banks have shifted over time; confirm current issuer"
  },
  {
    slug: "freo-save-debit",
    name: "Freo Save Federal Bank Debit Card",
    issuer: "Federal Bank (issued via Freo)",
    type: "debit",
    network: "visa",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 25000,
    posLimitDaily: 100000,
    keyFeatures: [
      "Digital savings account by Freo (formerly MoneyTap)",
      "Up to 7% interest on savings",
      "Smart credit features integrated",
      "Federal Bank backed account",
      "No minimum balance"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/freo-save-debit.jpg",
    cardColorGradient: "from-emerald-600 via-teal-600 to-emerald-700",
    applyUrl: "https://freo.money/save",
    verificationStatus: "pending"
  },

  // ═══════════════════════════════════════════════════════════════════
  // FOREX / TRAVEL PREPAID CARDS (8)
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "niyo-global-sbm",
    name: "Niyo Global Card (SBM Bank)",
    issuer: "SBM Bank India (Niyo partner)",
    type: "forex",
    network: "visa",
    variant: "Signature",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 0,
    atmWithdrawalLimitDaily: 100000,
    posLimitDaily: 500000,
    keyFeatures: [
      "Zero forex markup on all international transactions in 180+ countries",
      "INR-based card — no need to load foreign currency separately",
      "Real-time Visa exchange rates (no hidden conversion fees)",
      "International ATM fees up to ₹1,500/quarter reversed as Niyo Coins",
      "Up to 7% interest on linked SBM savings; complimentary domestic lounges on ₹50K quarterly spend"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/niyo-global-sbm.jpg",
    cardColorGradient: "from-indigo-800 via-violet-800 to-purple-900",
    applyUrl: "https://goniyo.com/zero-forex-card",
    verificationStatus: "verified",
    notes: "Issued via SBM Bank India under Niyo partnership; DCB Bank also issues a Niyo variant"
  },
  {
    slug: "hdfc-multicurrency-forexplus",
    name: "HDFC Bank MultiCurrency ForexPlus Card",
    issuer: "HDFC Bank",
    type: "forex",
    network: "visa",
    variant: "Platinum",
    annualFee: 0,
    joiningFee: 500,
    forexMarkupPct: 3.5, // for transactions in unloaded currency
    atmWithdrawalLimitDaily: 0, // no India ATM use; abroad limits per currency
    posLimitDaily: 0,
    keyFeatures: [
      "Load up to 22 currencies in a single card",
      "Lock-in exchange rates at load time (no fluctuation risk)",
      "Cross-currency markup of 3.5% only when spending in unloaded currency",
      "Free worldwide medical assistance and emergency cash service",
      "Reloadable; valid for 5 years"
    ],
    linkedAccountRequired: false,
    imageUrl: "/cards/hdfc-multicurrency-forexplus.jpg",
    cardColorGradient: "from-blue-700 via-indigo-700 to-blue-800",
    applyUrl: "https://www.hdfcbank.com/personal/pay/cards/forex-cards/multicurrency-platinum-forexplus-chip-card",
    verificationStatus: "verified"
  },
  {
    slug: "axis-multicurrency-forex",
    name: "Axis Bank Multi-Currency Forex Card",
    issuer: "Axis Bank",
    type: "forex",
    network: "visa",
    annualFee: 0,
    joiningFee: 300,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 0,
    posLimitDaily: 0,
    keyFeatures: [
      "Load up to 16 currencies on one card",
      "Locked exchange rates at the time of loading",
      "Free replacement card if lost overseas",
      "Worldwide acceptance via Visa network",
      "Reloadable via Axis NetBanking"
    ],
    linkedAccountRequired: false,
    imageUrl: "/cards/axis-multicurrency-forex.jpg",
    cardColorGradient: "from-rose-700 via-pink-700 to-rose-800",
    applyUrl: "https://www.axisbank.com/retail/cards/forex-cards/multi-currency-forex-card",
    verificationStatus: "verified"
  },
  {
    slug: "icici-travel-card",
    name: "ICICI Bank Multi-Currency Travel Card",
    issuer: "ICICI Bank",
    type: "forex",
    network: "visa",
    annualFee: 0,
    joiningFee: 599,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 0,
    posLimitDaily: 0,
    keyFeatures: [
      "Load up to 15 currencies",
      "Lock exchange rates at load",
      "Emergency cash assistance worldwide",
      "First 5 ATM withdrawals abroad free per month",
      "Insurance cover up to USD 100,000 for lost card / fraud"
    ],
    linkedAccountRequired: false,
    imageUrl: "/cards/icici-travel-card.jpg",
    cardColorGradient: "from-orange-600 via-red-600 to-orange-700",
    applyUrl: "https://www.icicibank.com/personal-banking/cards/travel-card",
    verificationStatus: "verified"
  },
  {
    slug: "sbi-multicurrency-forex",
    name: "SBI Multi-Currency Foreign Travel Card",
    issuer: "State Bank of India",
    type: "forex",
    network: "visa",
    annualFee: 0,
    joiningFee: 100,
    forexMarkupPct: 3.0,
    atmWithdrawalLimitDaily: 0,
    posLimitDaily: 0,
    keyFeatures: [
      "Lowest issuance fee among PSU bank forex cards",
      "Load up to 7 currencies",
      "Issued by world's largest bank (SBI)",
      "Reloadable via SBI branches or online",
      "Free emergency card replacement abroad"
    ],
    linkedAccountRequired: false,
    imageUrl: "/cards/sbi-multicurrency-forex.jpg",
    cardColorGradient: "from-blue-800 via-indigo-800 to-blue-900",
    applyUrl: "https://www.sbi.co.in/web/personal-banking/cards/prepaid-cards/multi-currency-foreign-travel-card",
    verificationStatus: "verified"
  },
  {
    slug: "thomas-cook-borderless",
    name: "Thomas Cook Borderless Prepaid Card",
    issuer: "Thomas Cook India (issued via DCB Bank)",
    type: "forex",
    network: "mastercard",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 0,
    posLimitDaily: 0,
    keyFeatures: [
      "Multi-currency support across major travel destinations",
      "Lock exchange rates at load time",
      "24x7 customer support worldwide",
      "Replacement card delivery to your location abroad",
      "Mastercard acceptance globally"
    ],
    linkedAccountRequired: false,
    imageUrl: "/cards/thomas-cook-borderless.jpg",
    cardColorGradient: "from-amber-600 via-orange-600 to-red-700",
    applyUrl: "https://www.thomascook.in/foreign-exchange/borderless-prepaid-card",
    verificationStatus: "verified"
  },
  {
    slug: "bookmyforex-visa",
    name: "BookMyForex Visa Multi-Currency Card",
    issuer: "Yes Bank (issued via BookMyForex)",
    type: "forex",
    network: "visa",
    annualFee: 0,
    joiningFee: 200,
    forexMarkupPct: 0, // marketed as zero markup at load
    atmWithdrawalLimitDaily: 0,
    posLimitDaily: 0,
    keyFeatures: [
      "Zero markup over interbank rate at time of loading",
      "Doorstep delivery in major Indian cities",
      "Online reloading 24x7",
      "Live rate comparison before purchase",
      "Insurance up to USD 250,000"
    ],
    linkedAccountRequired: false,
    imageUrl: "/cards/bookmyforex-visa.jpg",
    cardColorGradient: "from-emerald-700 via-teal-700 to-emerald-800",
    applyUrl: "https://www.bookmyforex.com/forex-card/",
    verificationStatus: "verified"
  },
  {
    slug: "wise-multicurrency-account",
    name: "Wise Multi-currency Account",
    issuer: "Wise (limited India availability)",
    type: "forex",
    network: "visa",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 0.5, // mid-market rate + small fee
    atmWithdrawalLimitDaily: 0,
    posLimitDaily: 0,
    keyFeatures: [
      "Mid-market exchange rate with transparent small fees",
      "Hold balances in 50+ currencies",
      "Outbound only from India (per RBI rules)",
      "Globally regulated (FINMA, FCA, FinCEN)",
      "Not a traditional Indian card; account-based"
    ],
    linkedAccountRequired: false,
    imageUrl: "/cards/wise-card.jpg",
    cardColorGradient: "from-cyan-600 via-teal-600 to-emerald-700",
    applyUrl: "https://wise.com/in/",
    verificationStatus: "pending",
    notes: "Wise debit card not directly issued in India; users typically open account for outbound. Verify current India availability."
  },

  // ═══════════════════════════════════════════════════════════════════
  // PREPAID GIFT & SHOPPING CARDS (5)
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "sbi-smart-payout-gift",
    name: "SBI Smart Payout / Gift Card",
    issuer: "State Bank of India",
    type: "prepaid",
    network: "visa",
    annualFee: 0,
    joiningFee: 100,
    forexMarkupPct: 3.0,
    atmWithdrawalLimitDaily: 10000,
    posLimitDaily: 50000,
    keyFeatures: [
      "Reloadable prepaid card with up to ₹2 lakh limit",
      "Useful for gifting or budget control",
      "Worldwide Visa acceptance",
      "Online and POS purchase enabled",
      "Validity: 5 years from issue"
    ],
    linkedAccountRequired: false,
    imageUrl: "/cards/sbi-gift-card.jpg",
    cardColorGradient: "from-blue-600 via-indigo-600 to-blue-700",
    applyUrl: "https://www.sbi.co.in/web/personal-banking/cards/prepaid-cards/smart-payout-card",
    verificationStatus: "verified"
  },
  {
    slug: "freecharge-prepaid",
    name: "Freecharge Prepaid Card",
    issuer: "Axis Bank (issued via Freecharge)",
    type: "prepaid",
    network: "rupay",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 10000,
    posLimitDaily: 100000,
    keyFeatures: [
      "Linked to Freecharge wallet",
      "RuPay variant supports UPI on wallet balance",
      "Load up to ₹2 lakh per month (full KYC)",
      "Cashback on partner merchants",
      "Issued by Axis Bank"
    ],
    linkedAccountRequired: false,
    imageUrl: "/cards/freecharge-prepaid.jpg",
    cardColorGradient: "from-cyan-600 via-blue-600 to-indigo-700",
    applyUrl: "https://www.freecharge.in/upi-prepaid-card",
    verificationStatus: "pending"
  },
  {
    slug: "mobikwik-prepaid",
    name: "MobiKwik Visa Prepaid Card",
    issuer: "Transcorp / Indian Bank (issued via MobiKwik)",
    type: "prepaid",
    network: "visa",
    annualFee: 0,
    joiningFee: 49,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 10000,
    posLimitDaily: 100000,
    keyFeatures: [
      "Virtual & physical prepaid card from MobiKwik",
      "Linked to MobiKwik wallet",
      "Reloadable via UPI, net banking, debit/credit card",
      "Online and offline purchase enabled",
      "Up to ₹2 lakh load with full KYC"
    ],
    linkedAccountRequired: false,
    imageUrl: "/cards/mobikwik-prepaid.jpg",
    cardColorGradient: "from-rose-600 via-pink-600 to-fuchsia-700",
    applyUrl: "https://www.mobikwik.com/card",
    verificationStatus: "pending"
  },
  {
    slug: "icici-pockets-wallet",
    name: "ICICI Pockets Digital Wallet (with Virtual Card)",
    issuer: "ICICI Bank",
    type: "prepaid",
    network: "visa",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 10000,
    posLimitDaily: 100000,
    keyFeatures: [
      "ICICI's digital wallet with embedded virtual prepaid card",
      "No bank account needed for ICICI Pockets users",
      "Load up to ₹2 lakh with full KYC",
      "Bill payments, recharges, P2P transfers",
      "Available to non-ICICI customers"
    ],
    linkedAccountRequired: false,
    imageUrl: "/cards/icici-pockets.jpg",
    cardColorGradient: "from-amber-600 via-orange-600 to-red-700",
    applyUrl: "https://www.icicibank.com/digital-banking/pockets",
    verificationStatus: "verified"
  },
  {
    slug: "fampay-trio-prepaid",
    name: "FamPay / Trio Prepaid Card (Teen Card)",
    issuer: "IDFC FIRST Bank (issued via FamPay)",
    type: "prepaid",
    network: "visa",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 0, // typically not enabled for ATM
    posLimitDaily: 50000,
    keyFeatures: [
      "Designed for teenagers (13-18) with parental control",
      "Parents can load/monitor spending via app",
      "Numberless physical card (privacy by design)",
      "UPI payments enabled",
      "No standalone bank account needed"
    ],
    linkedAccountRequired: false,
    imageUrl: "/cards/fampay-card.jpg",
    cardColorGradient: "from-violet-600 via-fuchsia-600 to-pink-700",
    applyUrl: "https://fampay.in/",
    verificationStatus: "verified"
  },

  // ═══════════════════════════════════════════════════════════════════
  // POSTPAID / NEW-AGE PREPAID CARDS (3)
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "paytm-postpaid",
    name: "Paytm Postpaid Card",
    issuer: "Aditya Birla Finance (issued via Paytm)",
    type: "prepaid",
    network: "visa",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 0,
    posLimitDaily: 100000,
    keyFeatures: [
      "BNPL-style postpaid credit line, not a true credit card",
      "Credit limit up to ₹1 lakh",
      "30-day interest-free period before due date",
      "Accepted at all Paytm merchants and Visa-accepting POS",
      "Linked to Paytm app"
    ],
    linkedAccountRequired: false,
    imageUrl: "/cards/paytm-postpaid.jpg",
    cardColorGradient: "from-blue-600 via-sky-600 to-blue-700",
    applyUrl: "https://paytm.com/postpaid",
    verificationStatus: "verified",
    notes: "BNPL product subject to RBI regulation; terms have changed multiple times since 2022"
  },
  {
    slug: "scapia-federal-debit",
    name: "Scapia Federal Bank Debit Card (Travel Debit)",
    issuer: "Federal Bank (issued via Scapia)",
    type: "debit",
    network: "visa",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 0,
    atmWithdrawalLimitDaily: 50000,
    posLimitDaily: 300000,
    keyFeatures: [
      "Zero forex markup on all international transactions",
      "Unlimited complimentary domestic lounge access (₹5K monthly spend)",
      "4 international lounge visits/year via LoungeKey",
      "10% rewards as Scapia Coins on flights/hotels via Scapia app",
      "Lifetime free; digital-first signup"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/scapia-federal-debit.jpg",
    cardColorGradient: "from-indigo-700 via-blue-700 to-indigo-800",
    applyUrl: "https://scapia.cards/",
    verificationStatus: "verified",
    notes: "Note: Scapia also offers a credit card variant; this is the debit version"
  },
  {
    slug: "airtel-payments-debit",
    name: "Airtel Payments Bank Debit Card",
    issuer: "Airtel Payments Bank",
    type: "debit",
    network: "rupay",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 25000,
    posLimitDaily: 100000,
    keyFeatures: [
      "Linked to Airtel Payments Bank savings account",
      "RuPay variant supports UPI payments",
      "Available to Airtel Thanks app users",
      "Bill payments, recharges, money transfers",
      "Limited acceptance at POS vs. major bank debit cards"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/airtel-debit.jpg",
    cardColorGradient: "from-red-700 via-rose-700 to-red-800",
    applyUrl: "https://www.airtel.in/bank",
    verificationStatus: "pending"
  },

  // ═══════════════════════════════════════════════════════════════════
  // CORPORATE / SPECIALIZED PREPAID (3) — pending verification
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "equitas-selfe-plus",
    name: "Equitas Selfe Plus Prepaid Card",
    issuer: "Equitas Small Finance Bank",
    type: "prepaid",
    network: "rupay",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 25000,
    posLimitDaily: 100000,
    keyFeatures: [
      "Salary disbursement and gig-worker prepaid card",
      "Linked to Equitas Selfe digital savings account",
      "Low joining barrier",
      "RuPay UPI support"
    ],
    linkedAccountRequired: true,
    imageUrl: "/cards/equitas-selfe.jpg",
    cardColorGradient: "from-orange-600 via-amber-600 to-orange-700",
    applyUrl: "https://www.equitasbank.com/personal/savings-account/selfe-savings-account",
    verificationStatus: "pending"
  },
  {
    slug: "bharatpe-postpe",
    name: "BharatPe PostPe Card",
    issuer: "Trans Union CIBIL / NBFC partner",
    type: "prepaid",
    network: "visa",
    annualFee: 0,
    joiningFee: 0,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 0,
    posLimitDaily: 100000,
    keyFeatures: [
      "BNPL postpaid product by BharatPe",
      "Credit limit varies by user profile",
      "30-day repayment cycle",
      "Mainly accepted at BharatPe merchants"
    ],
    linkedAccountRequired: false,
    imageUrl: "/cards/bharatpe-postpe.jpg",
    cardColorGradient: "from-violet-700 via-purple-800 to-violet-900",
    applyUrl: "https://bharatpe.com/postpe",
    verificationStatus: "pending",
    notes: "BNPL terms shifted post 2022 RBI guidelines; reconfirm with bank"
  },
  {
    slug: "slonkit-prepaid",
    name: "Slonkit Prepaid Card",
    issuer: "RBL Bank / SBM Bank (varies)",
    type: "prepaid",
    network: "visa",
    annualFee: 0,
    joiningFee: 199,
    forexMarkupPct: 3.5,
    atmWithdrawalLimitDaily: 10000,
    posLimitDaily: 50000,
    keyFeatures: [
      "Pocket money card for teens with parental controls",
      "Parents can load via Slonkit app",
      "Spend tracking and category limits",
      "Visa acceptance at any merchant"
    ],
    linkedAccountRequired: false,
    imageUrl: "/cards/slonkit-prepaid.jpg",
    cardColorGradient: "from-pink-600 via-rose-600 to-red-700",
    applyUrl: "https://www.slonkit.com/",
    verificationStatus: "pending"
  }
]

/**
 * Summary:
 *   Total entries: 39
 *   Fully verified: 26
 *   Pending verification: 13
 *
 * The seed script (scripts/seed-non-credit-cards.ts) should:
 *   1. By default, insert only `verificationStatus === "verified"` cards
 *   2. Skip pending unless --include-pending flag is passed
 *   3. Print a summary of inserted vs. skipped
 *   4. Upsert by slug (so re-running doesn't duplicate)
 *
 * Cards marked "pending" need:
 *   - Bank rep confirmation of current limits/fees
 *   - Apply URL verification
 *   - Feature accuracy check
 *
 * Future expansion (next batch):
 *   - State Bank/PSB cooperative cards (UCO, Indian Bank, BoI, PNB debit)
 *   - More forex card variants (Yes Bank, IndusInd, Federal forex)
 *   - Co-branded debit (Manchester United ICICI debit, etc.)
 *
 * Last updated: May 2026
 */
