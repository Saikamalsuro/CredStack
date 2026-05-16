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
  {
    slug: 'hitting-fee-waiver-thresholds',
    level: 'intermediate',
    title: 'Hitting annual fee waiver thresholds — the year-end nudge',
    excerpt:
      'Most paid cards waive next year\'s fee if you cross a spend threshold. Knowing the number and pacing toward it earns the fee back automatically.',
    readMinutes: 4,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'Banks set fee-waiver criteria as a profitability test: spend enough that the card is profitable to them via interchange fees, and they will waive the annual fee. The threshold is usually 6-10× the fee.',
      },
      {
        heading: 'Typical waiver thresholds',
        list: [
          'HDFC Millennia / MoneyBack+ (₹500 fee) → ₹1L annual spend.',
          'SBI ELITE (₹4,999 fee) → ₹10L annual spend.',
          'Axis Magnus (₹12,500 fee) → ₹15L annual spend.',
          'HDFC Infinia (₹12,500 fee) → ₹8L annual spend.',
          'Amex Platinum Travel (₹5,000 fee) → ₹4L annual spend.',
          'IDFC Wealth (₹50,000 fee) → ₹20L annual spend or Wealth banking relationship.',
        ],
      },
      {
        heading: 'How to pace toward it',
        list: [
          'Check your current spend mid-October. Indian cards usually waive based on the prior fiscal year (April-March) or 365 days from issuance.',
          'If you are 80%+ to threshold, route discretionary spend (insurance premiums, EMI down payments) to the card to bridge the gap.',
          'Skip wallet loads — most issuers exclude them from waiver-counting spend.',
          'Skip fuel — many cards (HDFC, Amex) exclude fuel from waiver maths even when it earns rewards.',
        ],
      },
      {
        heading: 'When the math does not work',
        body:
          'If you are below 50% of threshold with 90 days left, don\'t force spend just to chase waiver. ₹1L of unnecessary spend to save ₹500 fee is irrational. Either negotiate retention (see premium card retention article) or downgrade.',
      },
      {
        heading: 'What counts',
        body:
          'Read the small print on each card. Common exclusions:',
        list: [
          'Wallet loads (Amazon Pay, Paytm, MobiKwik).',
          'Fuel transactions.',
          'Cash withdrawals (always excluded; also incur 2.5-3.5% fee).',
          'Rent payments via third-party rent platforms (CRED Rentpay, NoBroker — now flagged separately).',
          'EMI conversions (banks treat as principal, not new spend).',
        ],
      },
    ],
    relatedLinks: [
      { href: '/dashboard/cards', label: 'Track spend toward fee waiver' },
      { href: '/learn/annual-fee-vs-lifetime-free', label: 'When to pay annual fee' },
      { href: '/learn/premium-card-retention', label: 'Retention conversation' },
    ],
  },
  {
    slug: 'tax-implications-of-card-rewards',
    level: 'intermediate',
    title: 'Tax implications of credit card rewards — what the ITR actually wants',
    excerpt:
      'Cashback above ₹50K/year may need disclosure. Reward points generally do not. Foreign spend triggers Schedule FA. Here is the precise picture.',
    readMinutes: 5,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'Indian tax treatment of credit card rewards is grey-zone territory. The Income Tax Department hasn\'t issued definitive guidance, but case law and CA consensus suggest three rules of thumb.',
      },
      {
        heading: '1. Reward points — generally not taxable',
        body:
          'Reward points and miles earned on personal spending are treated as a discount, not income. CBDT has not classified them as taxable income. Most CAs treat them as out-of-scope for ITR — provided redemption is for personal use.',
        list: [
          'Exception: if you redeem reward points for cash transfer to bank account (rare in India), the cash value may be questioned.',
          'Reward points earned on business expenditure (claimed as business expense) are arguably reducing the expense, not creating income.',
        ],
      },
      {
        heading: '2. Cashback — borderline, especially above ₹50K/year',
        body:
          'Cashback credited directly to your statement is reducing an expense. But large-volume cashback that resembles income (>₹50K/year on a single card) has been flagged in some ITR notices. CA consensus:',
        list: [
          'Below ₹50K aggregate — almost certainly safe, treat as expense reduction.',
          '₹50K-2L — disclose under "income from other sources" to be safe; minor tax impact.',
          'Above ₹2L — consult CA. Cashback at this scale on a personal card is unusual; may trigger profit/profession scrutiny.',
        ],
      },
      {
        heading: '3. Foreign currency spend — Schedule FA / Schedule FSI',
        body:
          'If your annual foreign currency spend exceeds ₹2L (TCS threshold) you should:',
        list: [
          'Track all foreign spend (CredStack tax export does this).',
          'TCS at 5-20% is deducted on most foreign card transactions above ₹7L cumulative under LRS.',
          'Schedule FA discloses foreign assets — typically not triggered by card spend alone, but high travel volume can.',
          'Foreign-sourced income (overseas job income paid via card-linked account) triggers Schedule FSI.',
        ],
      },
      {
        heading: '4. Welcome bonuses on credit cards',
        body:
          'Welcome bonuses tied to spend (e.g. ₹500 voucher on activation) are also expense reductions. Welcome bonuses NOT tied to spend (rare; some referral bonuses) could be income — disclose if above ₹50K.',
      },
      {
        heading: 'Practical advice',
        body:
          'For 99% of users earning <₹50K aggregate cashback + reward points: no disclosure needed. Use CredStack\'s tax export annually to track foreign spend and aggregate cashback. If unsure, ask your CA — but don\'t over-engineer for typical personal-use volumes.',
      },
    ],
    relatedLinks: [
      { href: '/dashboard/tax-export', label: 'Export annual summary for ITR' },
      { href: '/safety/rbi-updates', label: 'RBI rules affecting cardholders' },
      { href: '/learn/forex-markup-explained', label: 'Forex markup and TCS' },
    ],
  },
  {
    slug: 'travel-hacking-with-indian-cards',
    level: 'advanced',
    title: 'Travel hacking with Indian credit cards (2026 playbook)',
    excerpt:
      'Business-class redemptions for ₹40K instead of ₹4L cash. The Indian travel hacking ecosystem is smaller than US/EU but the few playbooks that work, work well.',
    readMinutes: 6,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'Travel hacking is the art of converting credit card spend into outsized travel value through reward arbitrage. India has fewer transfer partners than the US, but the playbooks that exist deliver 3-5× value.',
      },
      {
        heading: 'The four high-value transfer routes (May 2026)',
        list: [
          'HDFC Infinia / Diners Black → Marriott Bonvoy (1:1). Stack with Marriott category 1-3 properties for sub-1.5K-point nights.',
          'Axis Atlas → Marriott Bonvoy (1:5). 5x the inbound currency; the best Indian transfer rate.',
          'Amex MR → Singapore KrisFlyer (2:1, occasional 1:1 bonuses). Premium-cabin Star Alliance redemptions.',
          'Amex MR → British Airways Avios (2:1). Short-haul intra-Asia redemptions at low avios cost.',
        ],
      },
      {
        heading: 'The Maharaja Club opportunity (post Vistara merger)',
        body:
          'Air India\'s Maharaja Club joined Star Alliance in late 2025. This means:',
        list: [
          'Earn Maharaja miles on Lufthansa, Singapore, Turkish, United flights.',
          'Redeem Maharaja miles on Star Alliance partners.',
          'Status match from any Star Alliance Gold (KrisFlyer Gold, United Premier Gold, Lufthansa Senator) into Maharaja Club Gold.',
          'Axis Vistara Signature / Infinite holders inherited status into Maharaja Club at 1:1.',
        ],
      },
      {
        heading: 'Welcome bonus rotation strategy',
        body:
          'A premium card welcome bonus is typically worth ₹3K-15K. Smart applicants take one bonus, hold the card 12 months (to preserve CIBIL credit age), then either downgrade to LTF or move to next bonus. Caveats:',
        list: [
          'No applying for more than 1 premium card per 6 months — hard CIBIL enquiries stack up.',
          'Don\'t close the card before retention is offered (most issuers offer it at 11-12 month mark).',
          'Track via CredStack Applications tracker so you don\'t lose track of which year is which.',
        ],
      },
      {
        heading: 'Lounge maximisation',
        body:
          'Indian cards with unlimited domestic + international lounge access:',
        list: [
          'HDFC Infinia — unlimited domestic + 12 international via Priority Pass.',
          'Axis Reserve — unlimited both.',
          'Amex Platinum Charge — unlimited both via Centurion + Priority Pass.',
          'Stack with non-flying companions — most cards allow 1 guest per visit, occasionally 2. A family of 4 travelling on one cardholder\'s benefits = ₹8-10K saved per trip.',
        ],
      },
      {
        heading: 'What does NOT work (yet)',
        list: [
          'No US-style sign-on-100K-points-on-3K-spend bonuses. Indian welcome offers are smaller, more spend-tied.',
          'No domestic airline transfers worth chasing (Indigo 6E Rewards lock you to IndiGo, no transfer).',
          'No retention-bonus-on-bonus mechanic — Indian banks don\'t re-up bonuses if you keep the card.',
        ],
      },
      {
        heading: 'Worked example',
        body:
          'Spend ₹15L/year on Axis Atlas. Earn ~75K EDGE Miles via base + milestones. Transfer to Marriott Bonvoy (1:5) = 375K Bonvoy points. That redeems for 4-5 nights at Marriott category 4 properties (Bangalore Marriott Whitefield, Marriott Goa). Cash value: ~₹80K-1L. Effective return: 5.3-6.7%. After ₹5K annual fee: net ₹75-95K. Versus generic-card 1.5% return on same spend = ₹22.5K. Differential = ₹50-70K/year.',
      },
    ],
    relatedLinks: [
      { href: '/learn/rewards', label: 'All reward programmes' },
      { href: '/learn/optimal-portfolio-high-spend', label: 'Premium portfolio architecture' },
      { href: '/cards', label: 'Cards by lounge access' },
    ],
  },
  {
    slug: 'concierge-benefit-utilisation',
    level: 'advanced',
    title: 'Premium card concierge — what it can actually do for you',
    excerpt:
      'Most premium cardholders never call concierge. The ones who do save 4-10 hours/month on bookings, errands, and dispute escalation.',
    readMinutes: 4,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'Premium cards (₹10K+ annual fee) bundle 24x7 concierge. It is usually outsourced to Quintessentially, Aspire Lifestyles, or Ten Lifestyle. Most cardholders treat it as a marketing feature. Power users treat it as a personal assistant.',
      },
      {
        heading: 'What concierge actually does well',
        list: [
          'Restaurant reservations — particularly hard-to-book Mumbai/Delhi/Bangalore spots. Concierge has industry relationships, gets you in faster than OpenTable.',
          'Flight changes / cancellations — they negotiate with airline on your behalf, sometimes getting fee waivers retail customers cannot.',
          'Hotel upgrades — pre-arrival call to property mentioning your concierge often nets a complimentary upgrade.',
          'Gift sourcing — flowers, hampers, last-minute orders. They have vendor lists in 40+ cities.',
          'Visa applications — they will fill out and lodge premium visa applications (UK, Schengen) for you.',
        ],
      },
      {
        heading: 'What concierge does not do',
        list: [
          'Travel insurance claims — go through the bank\'s nodal insurance partner directly.',
          'Bank dispute resolution — concierge can\'t override fraud-claim timelines.',
          'Tax / legal advice — refer-out only.',
          'Anything illegal or grey-zone — they have liability rules.',
        ],
      },
      {
        heading: 'How to use concierge effectively',
        list: [
          'Treat it like a chief-of-staff: give clear, written briefs by email rather than vague phone asks.',
          'Build a relationship — same agent helps repeatedly if you ask. Most have email handles for direct contact.',
          'Give 48-72 hour lead time for international requests (visa, travel rebooking).',
          'Provide context: budget, preferences, deadline. Vague briefs get vague responses.',
        ],
      },
      {
        heading: 'Cards with best concierge (May 2026)',
        list: [
          'Amex Platinum Charge — Quintessentially. Highest-touch, fastest response (typically <2 hours).',
          'HDFC Infinia / Diners Black — Aspire Lifestyles. Strong on India-specific bookings.',
          'Axis Reserve — Ten Lifestyle. Better international than domestic.',
          'ICICI Emeralde Private Metal — Aspire. Solid but less premium-feel than Amex.',
        ],
      },
      {
        heading: 'Worth it?',
        body:
          'If you save 4 hours/month on bookings + errands and value your time at ₹2K/hour, that is ₹96K/year of utility. The annual fee differential vs a mid-tier card is ₹40-60K. Net positive at moderate time-value. Disregard if you have a personal assistant or low time-value.',
      },
    ],
    relatedLinks: [
      { href: '/learn/optimal-portfolio-high-spend', label: 'Premium portfolio architecture' },
      { href: '/learn/premium-card-retention', label: 'Retention conversation' },
      { href: '/cards?category=premium', label: 'Premium cards in catalogue' },
    ],
  },
  {
    slug: 'card-upgrades-and-downgrades',
    level: 'intermediate',
    title: 'Card upgrades and downgrades — preserving credit age while changing perks',
    excerpt:
      'You can usually swap product variants within the same issuer without losing your account age. Knowing when to upgrade vs apply fresh saves CIBIL friction.',
    readMinutes: 4,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'A product change keeps the same underlying account number (or transfers history). A new application creates a fresh account. Both can change which perks you get; only the new application produces a hard CIBIL enquiry.',
      },
      {
        heading: 'When to upgrade in-place',
        list: [
          'You qualify for the higher variant on income / spend criteria.',
          'You want the perks without a CIBIL hit.',
          'Your card is at least 12 months old (most issuers gate product changes by tenure).',
          'You are willing to forfeit the welcome bonus on the upgraded variant (most banks don\'t pay it on product change).',
        ],
      },
      {
        heading: 'When to apply fresh',
        body:
          'A new application is worth it when:',
        list: [
          'Welcome bonus is large (>₹10K equivalent).',
          'Hard CIBIL enquiry won\'t hurt — your score is solid, no other recent applications.',
          'The new variant is on a different network (Visa → Amex) and you genuinely need both.',
        ],
      },
      {
        heading: 'Downgrade strategies',
        body:
          'Closing a premium card outright is the worst option — credit age drops, total limit drops, utilisation spikes. Better:',
        list: [
          'Downgrade to LTF variant within the same issuer (HDFC Infinia → Regalia → Millennia).',
          'Keep the LTF variant active with one small monthly transaction. Preserves credit age forever.',
          'Negotiate fee waiver instead of downgrading. See premium retention article.',
        ],
      },
      {
        heading: 'Issuer-by-issuer downgrade paths',
        list: [
          'HDFC: Infinia → Diners Privilege → Regalia → MoneyBack+. All possible via NetBanking request.',
          'Amex: Plat Reserve → Plat Travel → Gold → SmartEarn. Phone call to retention team.',
          'Axis: Magnus → Privilege → MyZone. Branch or app request.',
          'ICICI: Emeralde Private → Emeralde → Sapphiro → Coral. Email customer service.',
          'SBI: ELITE → PRIME → SimplyCLICK / SimplySAVE. Phone call.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/learn/premium-card-retention', label: 'Retention conversation' },
      { href: '/learn/utilization-and-credit-score', label: 'Why credit age matters' },
      { href: '/dashboard/cards', label: 'Your portfolio' },
    ],
  },
  {
    slug: 'co-branded-cards',
    level: 'intermediate',
    title: 'Co-branded cards — who they\'re for, who they\'re not',
    excerpt:
      'A Tata Neu HDFC, Swiggy HDFC, or Flipkart Axis pays 5-10× rewards inside its ecosystem and 1× outside. Worth it if your spend matches; trap if it doesn\'t.',
    readMinutes: 4,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'Co-branded cards are partnerships between a bank and a non-bank brand. The card carries both logos. Earn rates inside the partner\'s ecosystem are dramatically higher; outside, they look like an entry-level card.',
      },
      {
        heading: 'When co-brands win',
        body:
          'Math is simple: (ecosystem spend × bonus rate) - (lost rewards on non-bonus spend) - annual fee > 0.',
        list: [
          'Swiggy HDFC at 10% on Swiggy: break-even at ₹50K Swiggy spend/year for ₹500 fee.',
          'Amazon Pay ICICI at 5% on Amazon (Prime): break-even at ₹10K Amazon spend/year (LTF).',
          'Flipkart Axis at 5% on Flipkart: break-even at ₹10K Flipkart spend/year for ₹500 fee.',
          'Tata Neu Infinity HDFC at 5% Tata Neu app: break-even at ₹30K Tata ecosystem spend/year for ₹1,499 fee.',
          'IRCTC HDFC at 5% on train bookings: break-even at ₹10K train spend/year.',
        ],
      },
      {
        heading: 'When co-brands lose',
        list: [
          'You buy from 5+ different platforms — diversified spend earns base rate everywhere.',
          'Ecosystem changes loyalty terms (Vistara merged into Air India, MMT ICICI stopped new applications).',
          'Co-brand currency has no resale outside ecosystem (NeuCoins, 6E Rewards lock you in).',
          'Issuer devalues earn rate mid-cycle without warning (common with ICICI co-brands).',
        ],
      },
      {
        heading: 'The 2-card test',
        body:
          'A co-brand is worth holding if it earns more on its category than your generic premium card would. Run the math:',
        list: [
          '5% Swiggy cashback on ₹3K/month = ₹150/month.',
          'HDFC Infinia at 3.3% RP value on same ₹3K/month = ₹100/month.',
          'Differential = ₹50/month = ₹600/year. Worth Swiggy HDFC\'s ₹500 fee, marginally.',
          'If Swiggy spend was only ₹1.5K/month, differential = ₹300/year, less than fee. Skip.',
        ],
      },
      {
        heading: 'Co-brand portfolio cap',
        body:
          'Most users don\'t need more than 2 co-brands. Pick the one ecosystem you spend most in, plus one alternative for the runner-up. Past that, mental overhead dominates.',
      },
    ],
    relatedLinks: [
      { href: '/learn/optimising-across-multiple-cards', label: 'Optimising across multiple cards' },
      { href: '/cards', label: 'Browse co-brand cards' },
      { href: '/learn/rewards', label: 'Reward programmes by issuer' },
    ],
  },
  {
    slug: 'reward-redemption-strategy',
    level: 'intermediate',
    title: 'Reward redemption strategy — never accept the first option',
    excerpt:
      'Same 50,000 points worth ₹12K as statement credit, ₹25K as voucher, ₹50K+ as airline transfer. The redemption you choose decides 80% of your card\'s value.',
    readMinutes: 5,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'The earn-rate marketed on a card is theoretical. The redemption-rate you actually capture is real. Banks design redemption ladders so the easy options (statement credit, catalogue products) pay the worst.',
      },
      {
        heading: 'The redemption ladder',
        body: 'Almost every Indian reward programme follows this hierarchy of value:',
        list: [
          '1. Airline / hotel transfer (1:1+) — usually 2-4× statement credit.',
          '2. Merchant-portal flights (SmartBuy, ICICI Mall) — 1:1 face value.',
          '3. Voucher catalogue (Flipkart, Amazon, BMS) — 1.5-2× statement credit.',
          '4. Product catalogue (TVs, watches) — banks mark up products 30-50%.',
          '5. Statement credit — the floor value.',
        ],
      },
      {
        heading: 'When to redeem early',
        body:
          'Reward currencies decay. Common triggers to redeem now:',
        list: [
          'Programme announces devaluation effective in <6 months (e.g. ICICI Jan 2026 cuts).',
          'You have 80%+ of an expiring batch with no obvious use case (don\'t hoard for "someday").',
          'Annual milestone vouchers (Amex Platinum Travel) — use within 6 months of issuance or they expire.',
        ],
      },
      {
        heading: 'When to hoard',
        body:
          'Saving for a specific redemption is worth it only when:',
        list: [
          'Target redemption is 6-12 months away.',
          'Transfer partner has a sweet spot (Marriott category 1-3 hotels, KrisFlyer business class).',
          'Programme is stable (Amex MR hasn\'t devalued in 5+ years).',
          'You have visible runway — leaving cards inactive while hoarding hurts utilisation.',
        ],
      },
      {
        heading: 'Tooling',
        body:
          'CredStack\'s Points Converter at /tools/points-converter compares your balance against every redemption type for any card. Use it before clicking the "Redeem" button — the highlighted option is usually NOT the one your bank promotes by default.',
      },
      {
        heading: 'Common mistakes',
        list: [
          'Redeeming HDFC RPs at ₹0.30 statement credit when SmartBuy flights pay ₹1.',
          'Picking the catalogue iPhone — banks mark up by 25-40%, so it\'s a worse purchase than retail.',
          'Letting Amex Travel Vouchers expire — they\'re 1:1 cash on partner sites.',
          'Transferring to airlines for short-haul economy redemptions — the maths almost never beats voucher route.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/tools/points-converter', label: 'Points value calculator' },
      { href: '/learn/rewards', label: 'All reward programmes' },
      { href: '/learn/travel-hacking-with-indian-cards', label: 'Travel hacking playbook' },
    ],
  },
  {
    slug: 'manufactured-spending-india',
    level: 'advanced',
    title: 'Manufactured spending in India — the honest risk-vs-reward picture',
    excerpt:
      'Manufactured spending is the practice of generating credit card spend on near-zero-cost transactions to hit thresholds. In India it is technically possible. Mostly inadvisable. Read why.',
    readMinutes: 5,
    publishedAt: '2026-05-16',
    sections: [
      {
        body:
          'Manufactured spending (MS) is the practice of routing money through credit card → semi-liquid asset → bank account to generate card spend without genuine consumption. Popular in the US travel hacking community. In India, the playbook is narrower and the risks are higher.',
      },
      {
        heading: 'Disclaimer (read first)',
        body:
          'MS sits in a grey zone. Banks have started clamping down in 2024-2026 — Citi, Amex, HDFC have all closed accounts of users flagged for high-volume MS. RBI has signalled scrutiny of rent-payment and wallet-load patterns. This article is informational, not encouragement.',
      },
      {
        heading: 'Tactics that historically worked (and are now mostly closed)',
        list: [
          'Rent payments via CRED Pay / NoBroker Pay / Magicbricks Pay → bank account: 1% effective fee for landlord, but banks (HDFC, Axis, SBI) have either capped reward earning on these MCCs or disabled them entirely as of late 2025.',
          'Wallet loads on Paytm / Amazon Pay → P2P / merchant cashout: ICICI capped at ₹5K/month from Feb 2026; other issuers similar.',
          'Tax payments via PayU / CCAvenue with 0.5-1% fee → 1.5-2% earn = small arbitrage; viable only for high-volume tax filers.',
          'Gift card purchase → cashout: Indian gift cards (Amazon, Flipkart, Tata CLiQ) don\'t resell at par, so net cost > reward.',
        ],
      },
      {
        heading: 'Why it stopped working',
        list: [
          'RBI wallet load surcharge guidance (2025-2026) gave banks cover to charge 1% fee.',
          'Banks have transaction-pattern detection — sudden ₹2-5L wallet loads trigger account review.',
          'Gaming MCC fees (ICICI 2%, HDFC 2.5%) destroyed the gaming-ramp playbook.',
          'Most rent-payment platforms now report TDS to IT department, eliminating the "easy" loophole.',
        ],
      },
      {
        heading: 'The cost-benefit math',
        body:
          'For ₹1L/month MS volume at 1% net fee + 2-3% reward = ₹1-2K monthly net gain. Account-closure risk = full loss of the card + welcome bonus claw-back + potential CIBIL flag. Risk-adjusted return is negative for most.',
      },
      {
        heading: 'Legal alternatives that work',
        list: [
          'Pay legitimate large expenses on card (insurance premiums, school fees, hospital bills if accepted). These hit category bonuses and waiver thresholds without MS.',
          'Bunch annual subscriptions onto the card month one of cycle (insurance, software, gym).',
          'Use the card for genuine business expense reimbursed by employer — clean, no MS needed.',
          'Family member spend routed through your card (with their consent) for shared expenses — legitimate household pattern.',
        ],
      },
      {
        heading: 'Bottom line',
        body:
          'Manufactured spending in India 2026 is a shrinking game with rising downside. The hours you spend chasing MS arbitrage are better invested in optimising legitimate spend across cards (see optimising-across-multiple-cards article). MS is for users who already have ₹50L+ annual spend and treat it as hobby, not income.',
      },
    ],
    relatedLinks: [
      { href: '/learn/optimising-across-multiple-cards', label: 'Optimising legitimate spend' },
      { href: '/safety/rbi-updates', label: 'RBI rules that changed the game' },
      { href: '/learn/optimal-portfolio-high-spend', label: 'High-spender portfolio' },
    ],
  },
]

export function getArticle(slug: string): AcademyArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}

export function getArticlesByLevel(level: AcademyArticle['level']): AcademyArticle[] {
  return ARTICLES.filter((a) => a.level === level)
}
