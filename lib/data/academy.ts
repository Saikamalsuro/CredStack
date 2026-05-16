/**
 * Credit Academy articles. Markdown-lite body — each section is a paragraph
 * or list. Designed for SEO + linkability; expand the corpus over time.
 */

export interface ArticleSection {
  heading?: string
  body?: string
  list?: string[]
}

export interface AcademyArticle {
  slug: string
  level: 'beginner' | 'intermediate' | 'advanced'
  title: string
  excerpt: string
  readMinutes: number
  publishedAt: string
  sections: ArticleSection[]
  relatedLinks: { href: string; label: string }[]
}

export const ARTICLES: AcademyArticle[] = [
  {
    slug: 'how-credit-cards-work',
    level: 'beginner',
    title: 'How credit cards actually work (India edition)',
    excerpt:
      'A credit card is a short-term loan with a 45-day interest-free window — if you pay in full. Miss that, and 36-42% APR kicks in. Here is the full mechanic.',
    readMinutes: 7,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'A credit card lets you spend money the bank lends you, on a rolling line of credit. You repay the borrowed amount monthly. The bank profits when you delay repayment — interest is charged at 3.0-3.5% per month on the unpaid portion, which annualises to 36-42%.',
      },
      {
        heading: 'The 45-day interest-free trick',
        body:
          'Most cards offer an interest-free period of roughly 45-50 days. This is the window from the first day of your billing cycle to the payment due date.',
        list: [
          'Day 1: Billing cycle starts (e.g. April 1).',
          'Day 30: Cycle ends, statement is generated.',
          'Day 45-50: Payment due date.',
        ],
      },
      {
        body:
          'If you swipe on Day 1, you have ~45 days to repay interest-free. If you swipe on Day 29, you have only ~16 days. Most users don\'t time this consciously — but the closer your spend is to the statement date, the shorter the free window.',
      },
      {
        heading: 'What happens if you only pay the minimum',
        body:
          'The "minimum amount due" (typically 5% of outstanding) keeps you out of default but the remaining 95% starts attracting 3-3.5% monthly interest. Worse, every new purchase you make also stops getting the grace period — interest accrues from day one until you clear the full balance.',
      },
      {
        heading: 'The three numbers that matter',
        body: 'Forget rewards programmes for a minute. These three drive whether a card is good for you:',
        list: [
          'Annual fee — fixed cost, often waived on a spend threshold.',
          'Forex markup — extra cost on every international transaction (1-3.5%).',
          'Interest rate (APR) — only matters if you ever carry a balance. If you always pay in full, it\'s 0.',
        ],
      },
      {
        heading: 'How to win',
        body:
          'Pay the full statement balance every month, never the minimum. Keep utilisation under 30% (outstanding / credit limit) to protect your CIBIL. Use the card as a payment medium, not a loan medium.',
      },
    ],
    relatedLinks: [
      { href: '/learn/first-credit-card', label: 'Your first credit card guide' },
      { href: '/tools/interest-calculator', label: 'See what carrying a balance costs' },
      { href: '/safety/fraud-guide', label: 'What to do if compromised' },
    ],
  },
  {
    slug: 'cibil-score-explained',
    level: 'beginner',
    title: 'CIBIL score explained — what moves it, what doesn\'t',
    excerpt:
      'CIBIL is the only credit score Indian banks really care about. Range 300-900. Above 750 = easy approvals. Here is what actually moves the needle.',
    readMinutes: 6,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'CIBIL TransUnion runs the dominant credit bureau in India. Banks pull your CIBIL report when you apply for any credit product. Score lives in 300-900. Most lenders treat 750+ as "auto-approve", 700-749 as "needs review", below 700 as "high friction".',
      },
      {
        heading: 'What CIBIL weighs (rough breakdown)',
        body: 'CIBIL doesn\'t publish exact weights, but lender feedback consistently shows:',
        list: [
          '35% — payment history (have you ever missed an EMI / card payment?)',
          '30% — credit utilisation (how much of your total limit are you using right now?)',
          '15% — credit age (how old is your oldest account?)',
          '10% — credit mix (cards + loans, or only one type?)',
          '10% — new applications (hard enquiries in last 6-12 months)',
        ],
      },
      {
        heading: 'The fastest way to move the needle',
        body:
          'If your score is below 700, the quickest fix is utilisation. Drop it below 30% and your score typically lifts within 30-60 days. Other levers (payment history, credit age) take years to fix.',
      },
      {
        heading: 'Common myths',
        list: [
          '"Checking my own CIBIL score lowers it" — false. Soft enquiries don\'t affect score. Only hard enquiries from lenders.',
          '"Closing my oldest card is fine" — false. Average credit age drops; score takes a hit.',
          '"Paying minimum due keeps my score safe" — true for payment history, false for utilisation. Outstanding balance still hurts.',
          '"Multiple cards drag down my score" — false, provided utilisation stays low. Multiple cards usually help by spreading utilisation.',
        ],
      },
      {
        heading: 'When to check',
        body:
          'You\'re entitled to one free credit report per credit bureau per year. CIBIL Lite (via cibil.com) is free. Most banks now offer monthly credit score peeks via NetBanking / mobile app. Check yours quarterly — once a month is over-monitoring.',
      },
    ],
    relatedLinks: [
      { href: '/eligibility', label: 'Check approval odds for your CIBIL band' },
      { href: '/dashboard/health-score', label: 'Your financial health score' },
      { href: '/learn/how-credit-cards-work', label: 'How credit cards actually work' },
    ],
  },
  {
    slug: 'reading-your-statement',
    level: 'beginner',
    title: 'Reading your credit card statement (line by line)',
    excerpt:
      'Every statement hides 5-6 numbers most users skip. Knowing what they mean prevents surprise charges and unlocks reward optimisation.',
    readMinutes: 5,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'A credit card statement is dense by design — banks would rather you focus only on the "total amount due" number. Pull up your latest statement before reading on. Every field below appears in one form or another.',
      },
      {
        heading: 'Top-of-statement fields',
        list: [
          'Statement date — the day this cycle\'s spending was captured.',
          'Payment due date — usually 18-21 days after statement date.',
          'Total amount due — full balance the bank wants. Pay this.',
          'Minimum amount due — typically 5% of total. Avoid paying only this.',
          'Credit limit — your overall ceiling.',
          'Available credit — limit minus current outstanding.',
        ],
      },
      {
        heading: 'Transaction list — what to watch',
        list: [
          'Foreign currency conversions — should be at issuer\'s rate + forex markup (1-3.5%). Compare against the XE rate; > 4% gap = report it.',
          'Reversed / refunded transactions — appear with a CR marker. Verify each shows up against the original.',
          'Subscription auto-debits — Netflix, Spotify, Prime. Audit yearly. Most users pay for services they no longer use.',
          'Convenience fees on UPI / Rent / Wallet — banks have been adding these silently in 2024-2026.',
        ],
      },
      {
        heading: 'Bottom-of-statement fields',
        list: [
          'Reward points earned this cycle — your tracker for redemption.',
          'Reward points expiring next — act before the deadline.',
          'Annual fee / GST — appears once a year; check if waiver criteria was met.',
          'Late payment fee — should be zero. If not, dispute or pay immediately to protect CIBIL.',
        ],
      },
      {
        heading: 'The audit habit',
        body:
          'Spend five minutes per statement, every month. Cross-check disputed charges within 3 working days for zero-liability protection under RBI rules. Cards you never check are cards you lose money on.',
      },
    ],
    relatedLinks: [
      { href: '/dashboard/tax-export', label: 'Export annual transaction summary' },
      { href: '/safety/fraud-guide', label: 'Dispute a fraudulent charge' },
      { href: '/learn/how-credit-cards-work', label: 'How credit cards work' },
    ],
  },
  {
    slug: 'annual-fee-vs-lifetime-free',
    level: 'beginner',
    title: 'Annual fee vs lifetime free — when to pay',
    excerpt:
      'A ₹2,500 annual fee can save you ₹30,000 a year — or cost you that much for nothing. Here is the decision framework.',
    readMinutes: 4,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'Lifetime-free (LTF) cards have no annual fee. Ever. Sounds great. But the highest-earning Indian cards all charge fees — Infinia (₹12,500), Axis Reserve (₹50,000), Amex Platinum (₹66,000). The fee buys you a better reward floor.',
      },
      {
        heading: 'The break-even formula',
        body:
          'A paid card is worth it if (your annual reward earn) > (annual fee + opportunity cost of not having LTF). Rough rule:',
        list: [
          'Annual spend < ₹3L → almost always pick LTF. The reward differential rarely covers the fee.',
          'Annual spend ₹3-8L → ₹500-2,500 fee cards (HDFC Millennia, Axis ACE) usually win.',
          'Annual spend ₹8-20L → premium fee cards (₹2,500-7,000) start covering themselves on category multipliers.',
          'Annual spend > ₹20L → super-premium (₹10,000+) wins on lounge + concierge + transferable points value.',
        ],
      },
      {
        heading: 'Hidden ways a paid card is "actually free"',
        list: [
          'Annual fee waiver on spend threshold (e.g. spend ₹2L → fee waived next year).',
          'Welcome bonus often exceeds the joining fee (Amex Platinum Reserve: 11K MR ≈ ₹3,500 on ₹5K fee).',
          'Lounge visits priced at ₹2,000/visit at airport gates. Two visits = annual fee paid on most ₹2K-fee cards.',
          'Milestone vouchers (Amex Platinum Travel: ₹14.5K + ₹40K + Taj ₹10K on ₹4L spend).',
        ],
      },
      {
        heading: 'Watch-outs',
        list: [
          'Annual fee waiver criteria change. HDFC moved Regalia waiver from ₹3L to ₹5L in 2024.',
          'Welcome bonuses are one-time. After year 1, your retention case must rest on ongoing earn.',
          'Bank "retention offers" exist — call before paying renewal fee on premium cards. Bonus offers happen ~70% of the time on Infinia, Diners Black, Amex Plat Reserve.',
        ],
      },
      {
        body:
          'Bottom line: don\'t default to LTF. Don\'t default to the most expensive card. Pick the band that matches your annual spend, and renew only if the math still works.',
      },
    ],
    relatedLinks: [
      { href: '/tools/points-converter', label: 'Calculate your reward value' },
      { href: '/advisor', label: 'AI advisor — best card for your spend' },
      { href: '/cards', label: 'Browse cards by tier' },
    ],
  },
  {
    slug: 'utilization-and-credit-score',
    level: 'intermediate',
    title: 'Credit utilisation — the single most controllable CIBIL lever',
    excerpt:
      'Utilisation is the fastest way to move your CIBIL score in either direction. 90 seconds of action can lift it 30-50 points within 30 days.',
    readMinutes: 5,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'Credit utilisation = (current outstanding across all cards) / (total credit limit). CIBIL weighs it ~30% of your score. It is the only major factor you can move within a single month.',
      },
      {
        heading: 'The thresholds',
        list: [
          '< 10% — Excellent. CIBIL treats you as cash-rich.',
          '10-30% — Healthy. Most lenders auto-approve in this band.',
          '30-50% — Yellow flag. Mortgage / loan approvals start asking questions.',
          '50-80% — Red flag. Credit appetite signal.',
          '> 80% — Distress signal. Score drops sharply.',
        ],
      },
      {
        heading: 'Per-card vs aggregate',
        body:
          'CIBIL looks at both overall utilisation AND per-card utilisation. A single card maxed out at 95% hurts even if your aggregate is 20%. Spread big purchases across cards.',
      },
      {
        heading: 'Three legal moves to drop utilisation',
        list: [
          'Pay before statement generation, not after. The reported balance is your statement balance, not your due balance. Pay down on day 25 of the cycle.',
          'Request a limit increase. Bank says yes → utilisation drops automatically. Most issuers raise limits without a hard enquiry after 12 months of good payment.',
          'Add a second card. Total limit goes up; if you don\'t increase spend, utilisation drops.',
        ],
      },
      {
        heading: 'What not to do',
        body:
          'Don\'t close a card to "simplify" your portfolio if it has a meaningful limit. Closing destroys both your aggregate limit (raising utilisation overnight) and your credit age (a separate CIBIL factor).',
      },
    ],
    relatedLinks: [
      { href: '/dashboard/health-score', label: 'Your utilisation-driven score' },
      { href: '/learn/cibil-score-explained', label: 'CIBIL score explained' },
      { href: '/dashboard/cards', label: 'Add cards to your portfolio' },
    ],
  },
  {
    slug: 'forex-markup-explained',
    level: 'intermediate',
    title: 'Forex markup — the silent 3.5% tax on international spend',
    excerpt:
      'Every international swipe carries a forex fee. Default cards charge 3.5%. The best ones charge 0%. The maths over ₹2L of foreign spend is brutal.',
    readMinutes: 4,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'When you spend in a non-INR currency, your bank converts at the issuer\'s mid-market rate, then adds a forex markup. This is a percentage fee on top of the FX conversion.',
      },
      {
        heading: 'Typical Indian forex markup rates',
        list: [
          '3.5% — Default for most cards (HDFC Millennia, SBI ELITE, ICICI Coral, Axis MyZone).',
          '2.0-3.0% — Mid-tier cards (HDFC Regalia, Amex Platinum).',
          '1.99-2% — Premium (HDFC 6E Rewards XL, Reliance SBI PRIME, Axis Atlas).',
          '1.0-1.5% — Super premium (HDFC Infinia, Diners Black, Axis Reserve).',
          '0% — IDFC FIRST WOW, Federal Scapia. Best-in-class.',
        ],
      },
      {
        heading: 'Real cost of 3.5% vs 0%',
        body:
          'If you spend ₹2 lakh internationally per year (typical for someone with 1-2 overseas trips), 3.5% markup is ₹7,000 in pure fee. 0% is ₹0. The IDFC FIRST WOW is lifetime-free; it pays for itself instantly for any international spender.',
      },
      {
        heading: 'DCC trap — Dynamic Currency Conversion',
        body:
          'When you swipe abroad, the merchant may offer to bill you in INR instead of the local currency. NEVER accept this. DCC layers an extra 3-5% markup on top of your card\'s forex fee. Always pay in the local currency and let your card handle conversion.',
      },
      {
        heading: 'The optimal portfolio for travel',
        list: [
          'Primary: 0% forex card (IDFC FIRST WOW or Scapia) for everyday spend.',
          'Backup: Amex Platinum or HDFC Infinia for premium category multipliers + lounge.',
          'Cash: Forex card / Wise / Revolut for emergency local currency.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/cards', label: 'Browse cards by forex markup' },
      { href: '/learn/rewards', label: 'Reward programmes for travel' },
      { href: '/learn/annual-fee-vs-lifetime-free', label: 'When to pay annual fee' },
    ],
  },
  {
    slug: 'optimising-across-multiple-cards',
    level: 'intermediate',
    title: 'Optimising spend across multiple cards',
    excerpt:
      'Two well-chosen cards beat one premium card. Three is usually the ceiling. Here is how to assign each card a job.',
    readMinutes: 5,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'The single-card maximalist mindset is a trap. Indian credit card rewards are heavily category-locked. The best earner on dining is rarely the best on fuel. Splitting spend across 2-3 cards earns 1.5-2× what a single card can.',
      },
      {
        heading: 'The 3-card archetype',
        list: [
          'Workhorse — broad-category earn (HDFC Diners Black, ICICI Emeralde, Axis Atlas). Covers everything not specifically routed.',
          'Cashback specialist — flat % on online (Axis ACE 5% on bill pay, Cashback SBI 5% on online). Used for utilities + subscriptions.',
          'Travel forex zero — IDFC FIRST WOW or Scapia. Triggers only on international + airline bookings.',
        ],
      },
      {
        heading: 'Routing rules to bake into your wallet',
        list: [
          'Amazon → ICICI Amazon Pay or Flipkart Axis (depending on which platform).',
          'Swiggy / Zomato → Swiggy HDFC (10% in-app) or Amex SmartEarn (10X).',
          'Fuel → BPCL Octane SBI or IndianOil HDFC. Generic cards lose 4-6%.',
          'International → 0% forex card always. 3.5% markup eats every reward.',
          'Insurance / utilities → cashback card (Axis ACE, Cashback SBI). Most rewards programmes exclude these.',
        ],
      },
      {
        heading: 'Why three is the ceiling',
        body:
          'Past three cards: mental overhead exceeds reward gain for most users. Tracking due dates, milestones, and category caps becomes a part-time job. Four+ only makes sense if you have automation (CredStack dashboard, app reminders).',
      },
      {
        heading: 'Common mistake',
        body:
          'Applying for a 4th card chasing welcome bonus, then forgetting it. Inactive cards still impact CIBIL credit-age scoring. Either use it monthly or close it after 12 months.',
      },
    ],
    relatedLinks: [
      { href: '/optimizer', label: 'Best card per transaction tool' },
      { href: '/dashboard/cards', label: 'Manage your portfolio' },
      { href: '/learn/utilization-and-credit-score', label: 'Why utilisation matters' },
    ],
  },
  {
    slug: 'emi-on-credit-cards',
    level: 'intermediate',
    title: 'EMI on credit cards — when it makes sense, when it does not',
    excerpt:
      '"No-cost EMI" rarely is. Convert-to-EMI on existing balance can be a debt trap. Here is how to read the fine print.',
    readMinutes: 5,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'Credit card EMI converts a single purchase into 3-24 monthly instalments. Three flavours exist: no-cost EMI (merchant subsidised), interest-bearing EMI (set rate), and convert-to-EMI (after the fact on outstanding).',
      },
      {
        heading: 'No-cost EMI mechanics',
        body:
          'The "no-cost" claim is true on the interest line — but processing fee (1-2% of purchase value) + 18% GST on that fee is added at the start. Effective interest rate on a 6-month no-cost EMI is typically 4-8% p.a.',
        list: [
          'Better than carrying balance at 36-42% APR.',
          'Worse than paying upfront if you have the cash.',
          'Usually disables reward points on the EMI portion. Verify before opting in.',
        ],
      },
      {
        heading: 'Interest-bearing EMI',
        body:
          'Charged at 13-16% p.a. on flat-rate basis (lower effective rate than carrying full balance). Use when the purchase is essential and you genuinely cannot pay in full. Never use to fund discretionary spend.',
      },
      {
        heading: 'Convert-to-EMI trap',
        body:
          'Banks SMS you "convert your ₹50K bill to EMI" after the statement generates. Rates are 14-18% p.a. flat. This locks you into a multi-month debt repayment. It is better than minimum-due interest (36-42%) but far worse than a personal loan (10-13%).',
      },
      {
        heading: 'Pre-closure',
        body:
          'Most card EMIs can be pre-closed. Foreclosure fee is typically 2-3% of outstanding. Always check terms before opting in — pre-close ability is what separates a forgivable EMI from a debt trap.',
      },
    ],
    relatedLinks: [
      { href: '/tools/emi-calculator', label: 'EMI calculator — no-cost vs interest' },
      { href: '/tools/interest-calculator', label: 'Carry-balance simulator' },
      { href: '/learn/how-credit-cards-work', label: 'How interest is charged' },
    ],
  },
  {
    slug: 'rupay-visa-mastercard-amex',
    level: 'intermediate',
    title: 'RuPay vs Visa vs Mastercard vs Amex — which network actually matters',
    excerpt:
      'The network on the back of your card decides acceptance, forex behaviour, and UPI support. Pick deliberately, not by default.',
    readMinutes: 4,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'A card has two faces: the issuer (bank) and the network. The network handles payment routing. In India, four networks dominate, and they are not interchangeable.',
      },
      {
        heading: 'RuPay',
        list: [
          'Domestic payment network run by NPCI.',
          'Only network with UPI support on credit cards.',
          'International acceptance limited — works in UAE, Singapore, Nepal, Bhutan; spotty elsewhere.',
          'Lower interchange fees, which means lower rewards in many cases.',
          'Best for: domestic-only spenders who want UPI on credit card.',
        ],
      },
      {
        heading: 'Visa',
        list: [
          'Global default. Acceptance virtually everywhere except a few US-only merchants.',
          'Most Indian premium cards (HDFC Infinia, Axis Reserve) issue on Visa Signature/Infinite tiers.',
          'Strong fraud protection programmes.',
          'Best for: travellers and global e-commerce.',
        ],
      },
      {
        heading: 'Mastercard',
        list: [
          'Parity with Visa in most respects.',
          'Slightly better acceptance in Europe, slightly weaker in some emerging markets.',
          'World Elite tier rivals Visa Infinite for perks.',
          'Best for: indistinguishable from Visa for most users. Tiebreaker.',
        ],
      },
      {
        heading: 'American Express',
        list: [
          'Issued directly by Amex (no separate bank in most cases) or as co-brand.',
          'High discount rates → fewer merchants accept it. ~85% in Tier 1, ~50% in Tier 2.',
          'Strongest dining programme (50% off at partner restaurants).',
          'Membership Rewards points among most flexible.',
          'Best for: secondary card for premium spenders. Always carry a Visa/MC backup.',
        ],
      },
      {
        heading: 'How to pick',
        body:
          'If you want UPI on credit + only domestic spend, pick RuPay. If you travel or shop globally, pick Visa or MC. If you spend on dining + want best transferable points, add Amex as second card. Default cards are now offered with choice of network at issuance — exercise it.',
      },
    ],
    relatedLinks: [
      { href: '/cards', label: 'Browse cards by network' },
      { href: '/learn/forex-markup-explained', label: 'Why forex markup matters' },
      { href: '/learn/rewards', label: 'Reward programmes by issuer' },
    ],
  },
  {
    slug: 'insurance-benefits-on-cards',
    level: 'intermediate',
    title: 'Insurance benefits on credit cards — what is real, what is theatre',
    excerpt:
      'Premium cards advertise ₹3 Crore air accident cover. In practice, payouts require the ticket be bought on the card. Here is the actual coverage map.',
    readMinutes: 4,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'Most premium Indian credit cards bundle insurance: air accident, travel inconvenience, purchase protection. The sum-insured numbers are eye-catching. The terms are restrictive.',
      },
      {
        heading: 'Air accident insurance',
        body:
          'Cards advertise ₹1-6 Crore. The catch:',
        list: [
          'Ticket must be bought using the card.',
          'Death must occur within 90-180 days of accident.',
          'Beneficiary needs to file claim with airline FIR + bank docs within the deadline (varies 90-180 days).',
          'Coverage doesn\'t stack — if you have three cards with ₹1 Cr each, you don\'t get ₹3 Cr. Most insurers pay the highest single policy.',
        ],
      },
      {
        heading: 'Travel inconvenience',
        body:
          'Covers baggage delay, lost baggage, missed connection. Typical limits:',
        list: [
          'Baggage delay > 4 hours: ₹10K-25K.',
          'Lost baggage: ₹50K-2L.',
          'Trip cancellation due to medical emergency: ₹1-3L.',
          'Always read sum-insured + deductible. Many require flight delay > 6 hours to trigger.',
        ],
      },
      {
        heading: 'Purchase protection',
        body:
          'Covers damage / theft of items bought on card. Usually 90-day window. Excludes consumables, jewellery, cash. Real value: <₹50K range items.',
      },
      {
        heading: 'What is theatre',
        list: [
          'Cyber fraud cover — RBI zero-liability already covers this if reported in 3 working days.',
          'Credit shield (loan death cover) — overlaps with most term policies. Don\'t pay extra for it.',
          'Lost card liability — also covered by RBI rules.',
        ],
      },
      {
        heading: 'How to file',
        body:
          'Card insurance claims go through the bank\'s nodal insurance partner (usually ICICI Lombard, Tata AIG, or HDFC Ergo). Bank customer service can route you. Start within 7 days of incident; collect doctor reports, FIR, original tickets.',
      },
    ],
    relatedLinks: [
      { href: '/cards', label: 'Browse cards with insurance' },
      { href: '/safety/fraud-guide', label: 'RBI zero-liability rules' },
      { href: '/learn/annual-fee-vs-lifetime-free', label: 'When to pay premium fee' },
    ],
  },
  {
    slug: 'optimal-portfolio-high-spend',
    level: 'advanced',
    title: 'Optimal credit card portfolio for high spenders (₹15L+/year)',
    excerpt:
      'At ₹15L+ annual spend, single-card optimisation breaks down. The right 3-4 card stack pulls 5-7% effective return. Here is the architecture.',
    readMinutes: 6,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'Above ₹15L annual spend you hit category caps on most premium cards (Infinia caps at 50K RPs/month on SmartBuy, Magnus capped at ₹1L/month airline transfers). Single card maxes around 3.5%. A 3-4 card portfolio can sustain 5-7%.',
      },
      {
        heading: 'The premium stack',
        list: [
          'Anchor: HDFC Infinia or Amex Platinum Reserve — covers premium category multipliers + lounge + concierge.',
          'Travel: Axis Atlas or Amex Platinum Travel — milestone vouchers + transferable miles.',
          'Online: ICICI Amazon Pay or Flipkart Axis — 5% on the duopoly.',
          'Forex: IDFC FIRST WOW or Scapia — 0% on every international spend.',
        ],
      },
      {
        heading: 'Routing playbook',
        list: [
          'Until ₹50K/mo on Infinia SmartBuy: route all flights through SmartBuy at 10X.',
          'Beyond cap: switch to Atlas → Marriott transfer for hotel-heavy travel, Amex MR → KrisFlyer for premium-cabin flights.',
          'Monthly milestone on Platinum Reserve: hit ₹50K/mo regardless of category. 2% guaranteed.',
          'Annual milestone on Platinum Travel: ₹1.9L + ₹4L = ₹40K + ₹14.5K + Taj voucher.',
          'Insurance, utilities, education: Axis ACE for 2% flat. Skip premium cards (no rewards anyway).',
        ],
      },
      {
        heading: 'Annual fee math',
        body:
          'Aggregate fees: Infinia ₹12.5K + Atlas ₹5K + Plat Reserve ₹66K + WOW ₹0 = ₹83.5K. At ₹15L spend, you need 5.5% effective return just to break even. Realistic return on this stack: 7-9%, so ₹1.1-1.4L value over fees.',
      },
      {
        heading: 'Retention game',
        body:
          'Premium cards play retention bonus games. Before paying renewal fee, call the bank. Infinia and Plat Reserve typically offer:',
        list: [
          'Annual fee waived if last-year spend > ₹8L (Infinia) / ₹15L (Plat Reserve).',
          'Bonus reward points (5K-15K MR / RP) to retain.',
          'Milestone reset (Plat Travel will sometimes credit milestone vouchers despite under-spend).',
        ],
      },
      {
        heading: 'When to add a 5th card',
        body:
          'Only if you have a category that none of your 4 covers well. Example: heavy fuel spend (₹5K+/month) → add BPCL Octane SBI for 5%. Heavy Zomato/Swiggy (₹15K+/month) → add Swiggy HDFC for 10%.',
      },
    ],
    relatedLinks: [
      { href: '/optimizer', label: 'Best card per transaction' },
      { href: '/advisor', label: 'AI advisor for your profile' },
      { href: '/learn/rewards', label: 'Compare reward programmes' },
    ],
  },
  {
    slug: 'premium-card-retention',
    level: 'advanced',
    title: 'Premium card retention — the conversation that saves ₹50K',
    excerpt:
      'Premium cards charge ₹10-66K annual fee. Most issuers waive or offer bonuses to retain you. Knowing how to ask is worth a year of milestone earn.',
    readMinutes: 4,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'Premium card retention is a structured negotiation. Issuers track your spend, profitability, and likelihood-to-cancel. They have pre-authorised retention budgets. Most customers never ask, so they never get the offer.',
      },
      {
        heading: 'When to call',
        body:
          'Mid-month, 30-45 days before your annual fee debits. The relationship manager has more authority before the fee posts than after.',
      },
      {
        heading: 'What to ask for (in order)',
        list: [
          'Full annual fee waiver — works if you spent above the published threshold (typically 6-10x the fee).',
          'Partial waiver + bonus points (50% fee + 10K MR / RPs) — common compromise.',
          'Milestone credit — bank waives milestone shortfall and credits the voucher anyway.',
          'Upgrade to higher tier — fee absorbed into new product (e.g. Diners Privilege → Diners Black if spend justifies).',
          'Downgrade to lower-fee variant — last resort, preserves account age but resets perks.',
        ],
      },
      {
        heading: 'Scripts that work',
        list: [
          '"My annual fee debits next month. I have spent ₹X this year. Can you check my retention eligibility?"',
          '"I am considering closing this card. Before I do, I wanted to check if there is anything you can offer."',
          '"I see [Bank Y] is offering [competing card] with [bonus]. What can you do to keep me on this card?"',
        ],
      },
      {
        heading: 'Issuers ranked by retention generosity',
        list: [
          'HDFC (Infinia, Diners Black): ~70% offer retention. Spend > ₹8L makes it nearly automatic.',
          'Amex (Platinum, Plat Reserve): ~80% offer milestone resets + bonus MR.',
          'Axis (Magnus, Reserve, Atlas): ~50%. More aggressive on competing-offer mentions.',
          'ICICI (Emeralde Private Metal): ~40%. Less retention-friendly.',
          'SBI (ELITE): ~30%. Usually only offers spend-threshold waiver.',
        ],
      },
      {
        heading: 'What kills retention offers',
        list: [
          'Late payments in last 12 months.',
          'High utilisation (>50% consistently).',
          'Multiple add-on cards on premium variants (low cardholder profitability).',
          'New customer (<12 months on the product).',
        ],
      },
    ],
    relatedLinks: [
      { href: '/learn/optimal-portfolio-high-spend', label: 'Optimal high-spender portfolio' },
      { href: '/safety/helplines', label: 'Issuer helpline directory' },
      { href: '/cards', label: 'Premium cards in catalogue' },
    ],
  },
]

export function getArticle(slug: string): AcademyArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}

export function getArticlesByLevel(level: AcademyArticle['level']): AcademyArticle[] {
  return ARTICLES.filter((a) => a.level === level)
}
