# CredStack — Handoff Checklist

Everything Claude Code needs from you to ship the remaining work.

## 1. Decisions (LOCKED IN)

| Item | Decision | Rationale |
|---|---|---|
| C1. Community features (9.8/9.9/9.10) | **C — Defer** | Pre-launch, zero users. Empty forum looks dead. Revisit at 25K MAU. |
| C2. Cron scheduler | **Inngest** | Already speced; better retries + step durability than Vercel Cron. |
| C3. Production deployment | **Later** | Ship after Phase 1 ship gate (Week 3). |
| C4. Custom domain | **credstack.in** | Indian market signal. Backup: `credstack.app`. |
| C5. Vercel plan | **Hobby (free) → Pro at scale** | Upgrade trigger: first $20 worth of value generated. |
| C6. Supabase plan | **Free (500MB) → Pro at scale** | Upgrade trigger: cross 500MB DB or 1GB storage. |

## 2. Files you provide (drop in repo)

### A1. Debit + prepaid card data
- Path: `lib/data/non-credit-cards-seed.ts`
- Shape:

```ts
import type { NonCreditCard } from '@/lib/db/non-credit-cards'

interface SeedCard {
  slug: string
  name: string
  issuer: string                              // must match existing credit-card issuer string exactly
  cardType: 'debit' | 'prepaid'
  network: 'visa' | 'mastercard' | 'amex' | 'rupay' | 'discover'
  annualFee: number
  joiningFee: number
  forexMarkupPct: number
  atmWithdrawalLimitDaily?: number
  posLimitDaily?: number
  keyFeatures: string[]                       // 3-5 bullets
  linkedAccountRequired: boolean
  imageUrl?: string
  cardColorGradient: string                   // tailwind gradient e.g. "from-blue-700 via-indigo-700 to-blue-800"
  applyUrl?: string
  dataPending?: boolean                       // set true if specs unverified
}

export const nonCreditCards: SeedCard[] = [
  // ~25 well-documented + ~20 flagged data_pending
]
```

- Seed: `npx tsx scripts/seed-non-credit-cards.ts`

### A2. Expert reviews
- Path: `lib/data/expert-reviews-seed.ts`
- Shape:

```ts
interface SeedReview {
  cardSlug: string                            // must match existing card slug
  reviewerName: string                        // "CredStack Editorial" if platform voice
  reviewerTitle?: string                      // e.g. "Senior Analyst"
  body: string                                // 1500+ words markdown-lite
  rating?: number                             // 1.0-5.0
  pros?: string[]
  cons?: string[]
  useCase?: string                            // e.g. "Infinia for casual traveller"
}

export const expertReviews: SeedReview[] = [
  // 5 reviews on: hdfc-infinia, amex-platinum, axis-magnus, icici-amazon-pay, idfc-wealth
]
```

- Seed: `npx tsx scripts/seed-expert-reviews.ts`

### A3. Real PDF statement (Claude Code cannot generate this)
- Drop one redacted credit-card PDF in `test-fixtures/statement-sample.pdf`
- Bank: HDFC / SBI / ICICI / Axis (pick one you actually use)
- Personal data (account number, card number, name) can be redacted
- Used to validate statement parser end-to-end

## 3. Credentials / env vars

Add to `.env.local`:

```
# Cron + email
CRON_SECRET=<generate random 32-char string>
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@credstack.in       # update after DNS verify

# Inngest (signup at inngest.com, create app 'credstack')
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Confirm funded
GROQ_API_KEY=                                # must have credits
FIRECRAWL_API_KEY=                           # must have credits
```

## 4. External access

### D1. Vercel
- Connect `Saikamalsuro/CredStack` GitHub repo
- Import as new project
- Framework preset: Next.js (auto-detected)
- Add all `.env.local` vars in Vercel project settings → Environment Variables
- Add `CRON_SECRET` so the daily cron endpoint authenticates correctly
- Deploy first to Preview, then Production after smoke-test

### D2. Resend (transactional email)
- Signup at https://resend.com
- Add `credstack.in` as sending domain → follow DNS verification steps
- Generate API key → put in `RESEND_API_KEY`

### D3. Inngest
- Signup at https://inngest.com
- Create app named `credstack`
- Generate event + signing keys → put in env vars
- Webhook URL: `https://credstack.in/api/inngest` (already wired in code)

### D4. Domain
- Buy `credstack.in` at GoDaddy / Namecheap / Cloudflare Registrar (~₹800-1200/yr)
- Point DNS to Vercel after `Add Domain` step in Vercel dashboard
- Update env var: `NEXT_PUBLIC_SITE_URL=https://credstack.in`

## 5. Optional content tasks (not blocking)

- E1. Real card images for `/public/cards/{slug}.jpg` — replaces gradients
- E2. Apply URL quarterly re-verification
- E3. Card data monthly review (fees / rewards / benefits change as banks update)

## 6. After you complete 1-4

Tell me. I'll execute:

1. Run `npx tsx scripts/seed-non-credit-cards.ts` → debit/prepaid cards live
2. Run `npx tsx scripts/seed-expert-reviews.ts` → expert reviews on top 5 cards
3. Upload your sample PDF → analyzer test run → fix parse errors per bank format
4. Wire Resend in `/api/cron/due-reminders` to actually send emails
5. Final Phase 1 ship-gate audit
6. Deploy to Vercel Preview → final smoke-test → Production promote
7. DNS cutover → live on `credstack.in`

Estimated turnaround: 2-3 hours once all inputs are in place.
