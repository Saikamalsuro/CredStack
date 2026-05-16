/**
 * Major Indian credit card rewards programmes. Used by /learn/rewards hub
 * and per-programme detail pages.
 */

export interface RedemptionOption {
  type: string
  rate: string
  notes?: string
}

export interface TransferPartner {
  name: string
  ratio: string
}

export interface RewardProgram {
  slug: string
  name: string
  issuer: string
  blurb: string
  baseEarn: string
  topCategories: string
  expiryRule: string
  redemptionOptions: RedemptionOption[]
  transferPartners?: TransferPartner[]
  bestUses: string[]
  watchOuts: string[]
  cardSlugs: string[]
}

export const REWARD_PROGRAMS: RewardProgram[] = [
  {
    slug: 'hdfc-reward-points',
    name: 'HDFC Reward Points (CashPoints, RPs)',
    issuer: 'HDFC Bank',
    blurb:
      'HDFC runs two parallel currencies: CashPoints (Millennia, MoneyBack+, Pixel) and Reward Points (Infinia, Diners, Regalia). Both redeem via NetBanking and SmartBuy.',
    baseEarn: '1 RP per ₹150 base; 5 RPs per ₹150 on premium cards (Infinia, Diners Black).',
    topCategories: 'SmartBuy partners (Flipkart, Amazon, MakeMyTrip), dining, travel.',
    expiryRule: '3 years from accrual date. Visible on monthly statement.',
    redemptionOptions: [
      { type: 'SmartBuy flights/hotels', rate: '1 RP ≈ ₹1', notes: 'Best value tier. Capped per-card per-month.' },
      { type: 'Catalogue products', rate: '1 RP ≈ ₹0.50' },
      { type: '1:1 airline / hotel transfer (Infinia/Diners Black only)', rate: '1 RP ≈ ₹1+', notes: 'Marriott Bonvoy, British Airways, ITC Green Points' },
      { type: 'Statement credit', rate: '1 RP ≈ ₹0.30' },
      { type: 'Voucher catalogue (Amazon, Flipkart, BookMyShow)', rate: '1 RP ≈ ₹0.50' },
    ],
    transferPartners: [
      { name: 'Marriott Bonvoy', ratio: '1:1' },
      { name: 'British Airways Avios', ratio: '1:1' },
      { name: 'ITC Green Points', ratio: '1:1' },
    ],
    bestUses: [
      'Redeem via SmartBuy at 1:1 for flights/hotels — that is the floor; airline transfers can exceed it.',
      'Stack with merchant promos (Flipkart 10% bank offer + SmartBuy + RPs).',
      'On Infinia/Diners Black, transfer to Marriott or ITC for vacation stays.',
    ],
    watchOuts: [
      'CashPoints (Millennia, MoneyBack+) only redeem at ₹0.25/CashPoint as statement credit. They are NOT 1 RP = ₹1.',
      'SmartBuy redemption capped at 50,000 RPs/month on Infinia (post-Aug 2023).',
      'No transfer partners on Regalia / Regalia Gold — only catalogue + voucher.',
    ],
    cardSlugs: ['hdfc-infinia', 'hdfc-diners-club-black', 'hdfc-diners-privilege', 'hdfc-regalia-gold', 'hdfc-millennia', 'hdfc-moneyback-plus'],
  },
  {
    slug: 'amex-membership-rewards',
    name: 'American Express Membership Rewards (MR)',
    issuer: 'American Express',
    blurb:
      'Most flexible currency among Indian issuers. Points transfer to 12+ airline and hotel partners at competitive ratios.',
    baseEarn: '1 MR per ₹50 spent (excl. fuel, insurance, utilities).',
    topCategories: 'Dining (Amex Dining 50% off partners), travel, monthly milestone (Platinum Reserve).',
    expiryRule: 'Do not expire as long as account is open and in good standing.',
    redemptionOptions: [
      { type: 'Airline transfers', rate: '1 MR ≈ ₹0.50 - ₹1+', notes: 'Singapore KrisFlyer, British Airways, Marriott' },
      { type: 'Hotel partners', rate: '1 MR ≈ ₹0.50', notes: 'Hilton Honors, Marriott Bonvoy' },
      { type: 'Travel Voucher (milestone)', rate: '1 MR ≈ ₹0.50' },
      { type: 'Statement credit', rate: '1 MR ≈ ₹0.30' },
      { type: 'Amazon / Flipkart vouchers', rate: '1 MR ≈ ₹0.40 - ₹0.50' },
    ],
    transferPartners: [
      { name: 'Singapore KrisFlyer', ratio: '2:1 (rounded down)' },
      { name: 'British Airways Avios', ratio: '2:1' },
      { name: 'Marriott Bonvoy', ratio: '2:1' },
      { name: 'Hilton Honors', ratio: '1:2 (Hilton heavy)' },
    ],
    bestUses: [
      'Singapore Airlines business class redemptions via KrisFlyer offer 2-3× rupee value.',
      'Stack monthly milestone bonus on Platinum Reserve (2% return on any spend up to ₹50K/month).',
      'Lock annual milestone Travel Vouchers from Platinum Travel — ₹14.5K + ₹40K + Taj voucher.',
    ],
    watchOuts: [
      'Airline transfers take 3-5 business days, sometimes a week. Plan ahead.',
      'Limited acceptance in tier-3 cities; carry a Visa/Mastercard backup.',
      'Forex markup 3.5% on most variants (excl. some Charge cards which have lower).',
    ],
    cardSlugs: ['amex-platinum', 'amex-platinum-travel', 'amex-platinum-reserve', 'amex-gold-charge', 'amex-smart-earn', 'amex-membership-rewards'],
  },
  {
    slug: 'icici-reward-points',
    name: 'ICICI Reward Points',
    issuer: 'ICICI Bank',
    blurb:
      'Simple programme: 1 RP redeems at face value on Emeralde Private Metal; tapered down on lower tiers.',
    baseEarn: '2 RPs per ₹100 on most cards; 4-6 RPs per ₹100 on Rubyx/Sapphiro for international.',
    topCategories: 'International spend (2x), dining, departmental stores.',
    expiryRule: '2 years from date of accrual.',
    redemptionOptions: [
      { type: 'Statement credit (Emeralde Private Metal)', rate: '1 RP = ₹1', notes: 'Strongest 1:1 redemption in India' },
      { type: 'Statement credit (other cards)', rate: '1 RP = ₹0.25' },
      { type: 'Voucher catalogue', rate: '1 RP = ₹0.25 - ₹0.50' },
      { type: 'iShop catalogue', rate: '1 RP = ₹0.40' },
    ],
    bestUses: [
      'Emeralde Private Metal holders: 1 RP = ₹1 on anything makes redemption trivial.',
      'Amazon Pay ICICI: cashback credits as Amazon Pay balance, effectively 1:1 on Amazon spend.',
    ],
    watchOuts: [
      'Jan-Feb 2026 devaluation hit Coral, Rubyx, Sapphiro, Emeralde, MMT, Adani One, HPCL Super Saver. Verify caps per card.',
      'Transportation MCC caps capped at ₹10K-20K/month rewards.',
      '2% fee on gaming MCC 5816 (Dream11, MPL).',
    ],
    cardSlugs: ['icici-emeralde-private-metal', 'icici-emeralde', 'icici-sapphiro', 'icici-rubyx', 'icici-coral', 'icici-platinum-chip', 'icici-amazon-pay', 'icici-hpcl-supersaver'],
  },
  {
    slug: 'sbi-reward-points',
    name: 'SBI Reward Points',
    issuer: 'SBI Card',
    blurb:
      'Voucher-heavy programme. Best value comes from BMS, Yatra, Cleartrip, Flipkart vouchers — not statement credit.',
    baseEarn: '2 RPs per ₹100 base; 10 RPs per ₹100 on PRIME/ELITE category bonuses.',
    topCategories: 'Dining, movies, grocery, departmental stores, partner brands (Apollo24x7, Cleartrip, Yatra).',
    expiryRule: '2 years from accrual on most cards; 3 years on ELITE.',
    redemptionOptions: [
      { type: 'Voucher catalogue (Flipkart, Amazon, BMS, Yatra)', rate: '1 RP = ₹0.25', notes: 'Most direct value' },
      { type: 'Statement credit', rate: '1 RP = ₹0.25' },
      { type: 'iGift catalogue', rate: '1 RP = ₹0.25 - ₹0.30' },
    ],
    bestUses: [
      'Stack 10X RPs on SimplyCLICK partner brands with merchant promos for compound discount.',
      'Use ELITE milestone benefits (50K spend = ₹1500 voucher) on Yatra or Cleartrip for travel.',
    ],
    watchOuts: [
      'No 1:1 redemption — 1 RP = ₹0.25 is the ceiling.',
      'No airline / hotel transfer partners.',
      'Welcome bonus often delayed 60-90 days post fee realisation.',
    ],
    cardSlugs: ['sbi-elite', 'sbi-prime', 'sbi-simplyclick', 'sbi-simplysave', 'sbi-pulse'],
  },
  {
    slug: 'axis-edge-points',
    name: 'Axis EDGE Reward Points / EDGE Miles',
    issuer: 'Axis Bank',
    blurb:
      'Two parallel programmes: EDGE Reward Points (Magnus, Privilege, Select, MyZone) and EDGE Miles (Atlas, Horizon). Miles are travel-only.',
    baseEarn: '4 EDGE Miles / ₹100 (Horizon) or 10 EDGE RPs / ₹200 (Privilege).',
    topCategories: 'Travel via Axis Travel EDGE portal (Atlas, Reserve), direct flights/hotels (Horizon).',
    expiryRule: 'EDGE RPs: 3 years. EDGE Miles: 12 months on Atlas, 24 months on Horizon.',
    redemptionOptions: [
      { type: 'Direct flights via Atlas portal', rate: '1 EDGE Mile = ₹1' },
      { type: 'Airline transfers', rate: '1 EDGE Mile = 1-2 partner miles', notes: 'Marriott 1:5, Air India 1:2, Singapore 1:1' },
      { type: 'EDGE RP statement credit', rate: '1 EDGE RP = ₹0.20' },
      { type: 'EDGE RP voucher catalogue', rate: '1 EDGE RP = ₹0.20 - ₹0.25' },
    ],
    transferPartners: [
      { name: 'Marriott Bonvoy', ratio: '1:5 (Atlas only)' },
      { name: 'Air India Maharaja Club', ratio: '1:2' },
      { name: 'Singapore KrisFlyer', ratio: '1:1' },
    ],
    bestUses: [
      'Atlas EDGE Miles + Marriott transfer is the best Indian travel hack right now.',
      'Magnus retains value if you redeem via Axis Travel EDGE (1 EDGE Mile = ₹1).',
      'Post Citi-Axis migration, Horizon inherits the PremierMiles transfer ratios.',
    ],
    watchOuts: [
      'EDGE Miles aren\'t redeemable for statement credit — travel only.',
      'Axis Magnus has been devalued multiple times; verify current rates before applying.',
      'Vistara cards rebadged to Maharaja Club post Nov 2024 — points convert 1:1 but redemption catalogue changed.',
    ],
    cardSlugs: ['axis-magnus', 'axis-atlas', 'axis-reserve', 'axis-horizon', 'axis-privilege', 'axis-select', 'axis-myzone', 'axis-vistara-signature'],
  },
  {
    slug: 'tata-neucoins',
    name: 'Tata NeuCoins',
    issuer: 'HDFC Bank (Tata co-brand)',
    blurb:
      'Co-branded programme tied to Tata Neu app. Coins are pure-play 1:1 on Tata ecosystem (Westside, BigBasket, Croma, Tanishq, Air India).',
    baseEarn: '1.5% NeuCoins on non-Tata, 5% on Tata Neu app/website (capped 500/mo on Plus, 2,500/mo on Infinity).',
    topCategories: 'Tata Neu app spends, Westside, BigBasket, Croma, Tanishq, Air India.',
    expiryRule: 'NeuCoins expire 365 days after issuance; rolling expiry per coin.',
    redemptionOptions: [
      { type: 'Tata Neu ecosystem', rate: '1 NeuCoin = ₹1', notes: 'Westside, BigBasket, Air India, Croma, Tanishq, IHCL hotels' },
      { type: 'Statement credit', rate: 'Not supported' },
    ],
    bestUses: [
      'Maximum value if you genuinely shop the Tata ecosystem monthly.',
      'Stack Air India redemption with Maharaja Club status (post Vistara merger).',
      'Pay Tanishq via NeuCoins to bypass jewellery GST friction.',
    ],
    watchOuts: [
      'NeuCoins are NOT transferable to airline partners.',
      'Outside Tata, the 1.5% base on Plus is weaker than HDFC Infinia / Diners.',
      'Expiry is rolling — track via Tata Neu app to avoid loss.',
    ],
    cardSlugs: ['tata-neu-infinity-hdfc', 'hdfc-tata-neu-plus'],
  },
  {
    slug: 'indigo-6e-rewards',
    name: 'IndiGo 6E Rewards',
    issuer: 'IndiGo (HDFC + Kotak co-brands)',
    blurb:
      'IndiGo airline currency. Most direct value when redeemed on IndiGo flights.',
    baseEarn: '2-5% as 6E Rewards on retail; 5% on IndiGo direct bookings.',
    topCategories: 'IndiGo flights, grocery, dining, entertainment, Tata CLiQ, BookMyShow, Ola.',
    expiryRule: '36 months from earn date; redeemable on IndiGo within validity.',
    redemptionOptions: [
      { type: 'IndiGo flights', rate: '1 6E Reward = ₹1', notes: 'Lowest forex markup of 2% pairs well' },
      { type: 'Statement credit / vouchers', rate: 'Not supported on co-brand cards' },
    ],
    bestUses: [
      'If you fly IndiGo more than twice a year, 6E Rewards XL pays for itself.',
      'Complimentary 6E Prime add-on (free seat, priority check-in, meal) unlocks at higher tiers.',
    ],
    watchOuts: [
      '6E Rewards do NOT transfer to other airlines.',
      'No statement credit option — value is locked to IndiGo ecosystem.',
      'IndiGo policies change frequently; verify current redemption value.',
    ],
    cardSlugs: ['hdfc-6e-rewards-xl'],
  },
  {
    slug: 'maharaja-club',
    name: 'Air India Maharaja Club',
    issuer: 'Air India (post Vistara merger)',
    blurb:
      'Combined Vistara Club + Air India FFP post Nov 2024 merger. Status tiers carried forward 1:1.',
    baseEarn: 'Earned per Air India flight + on co-branded credit cards (Axis Vistara variants, ICICI Air India variants).',
    topCategories: 'Air India direct flights, partner flight redemptions, Tata ecosystem partner perks.',
    expiryRule: '24 months from earn date; resets with any qualifying activity.',
    redemptionOptions: [
      { type: 'Air India flights', rate: '1 mile ≈ ₹0.50 - ₹1+', notes: 'Best on long-haul business' },
      { type: 'Partner flight redemptions (Star Alliance)', rate: 'Varies', notes: 'Post Star Alliance entry expected 2026' },
      { type: 'Maharaja Club upgrades', rate: 'Status-tier based' },
    ],
    bestUses: [
      'Status match from any other airline programme via Vistara legacy account.',
      'Pair with Axis Vistara card milestones — Premium Economy ticket vouchers stack.',
    ],
    watchOuts: [
      'Programme still consolidating; redemption catalogue changes monthly.',
      'Vistara Infinite Axis no longer accepting new applications.',
      'Long-haul Air India service quality is improving but not yet at Vistara levels.',
    ],
    cardSlugs: ['axis-vistara-signature'],
  },
]

export function getRewardProgram(slug: string): RewardProgram | undefined {
  return REWARD_PROGRAMS.find((p) => p.slug === slug)
}
