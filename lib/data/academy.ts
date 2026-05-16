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
]

export function getArticle(slug: string): AcademyArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}

export function getArticlesByLevel(level: AcademyArticle['level']): AcademyArticle[] {
  return ARTICLES.filter((a) => a.level === level)
}
