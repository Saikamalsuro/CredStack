# CredStack — Feature Roadmap & Implementation Plan

> **This is the third architectural pillar of CredStack**, alongside `README.md` (platform architecture) and `SCRAPING.md` (offers ingestion). It defines what to build after Phase 1 infrastructure is live, in what order, and to what bar of quality.
>
> Audience: Claude Code (autonomous implementation) and human contributors. Each phase has a clear ship gate. Each feature has dependencies mapped, effort estimated, and acceptance criteria defined.
>
> Last updated: May 2026. Total scope: ~40 features across 4 phases over 16-20 weeks.

---

## Table of contents

1. [Current state](#1-current-state)
2. [Guiding principles](#2-guiding-principles)
3. [Hard rules for new development](#3-hard-rules-for-new-development)
4. [Excluded scope](#4-excluded-scope)
5. [Phase overview](#5-phase-overview)
6. [Phase 1 — Quick wins & foundations](#6-phase-1--quick-wins--foundations-weeks-1-3)
7. [Phase 2 — Dashboard transformation](#7-phase-2--dashboard-transformation-weeks-4-7)
8. [Phase 3 — AI & intelligence layer](#8-phase-3--ai--intelligence-layer-weeks-8-11)
9. [Phase 4 — Polish, community & long-tail](#9-phase-4--polish-community--long-tail-weeks-12-18)
10. [Feature catalog](#10-feature-catalog-master-table)
11. [Existing feature enhancements](#11-existing-feature-enhancements)
12. [Database additions](#12-database-additions)
13. [Dependency graph](#13-dependency-graph)
14. [Risk register](#14-risk-register)
15. [Decision log](#15-decision-log)

---

## 1. Current state

### What's live (verified May 2026)

CredStack runs at `localhost:3000` with the following routes shipped:

| Route | Status | What it does |
|---|---|---|
| `/` (Home) | Live | Hero, value prop, dual-card illustration, CTA buttons. Has placeholder stats (100K+ users, 4.9 rating) that **must be removed or made real before public launch**. |
| `/cards` | Live | Browse all 85 cards with basic filtering |
| `/cards/[id]` | Live | Card detail page with current "Apply Now" button (no link wired yet — see Phase 1) |
| `/compare` | Live | Side-by-side card comparison |
| `/advisor` (AI Advisor) | Live | Chat interface for card recommendations |
| `/analyzer` | Live | Statement upload and analysis |
| `/optimizer` | Live | "Best card per transaction" tool |
| `/eligibility` | Live | Pre-check qualification |
| `/offers` | Live | Live merchant offers (driven by SCRAPING.md pipeline) |
| `/reward-expiry` | Live | Track expiring rewards |
| `/methodology` | Live | How CredStack scores cards |
| `/dashboard` | Live (auth-gated) | Sign-in required; currently minimal content |

### Supporting infrastructure live

- Next.js 16 App Router + React 19 + TypeScript + Tailwind v4 + shadcn/ui
- Authentication (sign in/sign out working; user identity flows)
- Dark mode toggle
- Sidebar navigation with three groupings (Main / Tools / Resources)
- Responsive layout
- Card data: 85 cards across `cards-original-verified.ts`, `cards-additional.ts`, `cards-tier2.ts`
- Apply URL mapping: `card-apply-urls.ts` (built but not wired into UI)

### What's still spec-only (per README.md and SCRAPING.md)

- Supabase migration (14 tables for cards + 5 tables for offers module)
- Storage buckets (3 buckets: card-images, statements, user-uploads)
- Net Annual Value engine (deterministic math layer)
- Statement parsing pipeline (PDF/CSV)
- Offers scraping orchestrator + 11 source parsers
- Card matching engine (offer → cards with confidence scoring)
- Inngest cron jobs (Tier 1/2/3 scrapes + expiry + credit audit)

**Ship gate before starting this roadmap:** Phase 1 of the main `README.md` must be complete. Specifically: Supabase migration applied, 85 cards seeded into `cards` table, basic Net Annual Value engine returning numbers. This roadmap assumes those are done.

---

## 2. Guiding principles

These are the tradeoff rules. When you're stuck on a decision while implementing, refer back here.

**1. Money math is deterministic, never AI-generated.** Every rupee figure shown to a user — savings projection, reward calculation, fee comparison, approval odds — flows through code, not through Groq. LLMs are used only for the *explanation* layer ("HDFC Infinia would save you ₹8,400/year because..."), never for the computation itself. Mixing the two is how trust is destroyed in fintech-adjacent products.

**2. Cache before you compute, compute before you call AI.** Redis hit > Postgres query > deterministic function > LLM call, in that order. Most "AI features" should be 90% rules engine, 10% LLM polish.

**3. Empty states are features.** Every list, table, and feed must have an explicit empty state designed. "No data yet" with a clear next action beats a broken UI every time. Especially critical for the Dashboard "My Cards" experience where new users have nothing.

**4. Honest absence beats false presence.** If you don't have data for a card field, show "—" or "Not specified" rather than making something up. If a feature isn't ready, don't add it to the nav. If a stat is fake, remove it. Trust compounds; betrayal of trust does not recover.

**5. One feature per ship.** Don't bundle three things into one PR because they're "related." Small, testable, reversible deployments are non-negotiable. Each feature in this roadmap is sized to ship independently.

**6. Mobile-responsive, not mobile-first.** Your traffic split will be ~70% mobile, but native mobile app is excluded scope. Every feature must work on a 380px viewport — design accordingly. Sidebar collapses to drawer on mobile, tables become cards, etc.

**7. Indian context wins over global pattern.** Use ₹ not $, lakhs/crores not millions, Indian credit context (CIBIL not FICO), Indian merchants in examples (Swiggy not DoorDash). This is the moat against global competitors.

**8. Public is the default; private is opt-in.** Most pages should be public/SEO-indexed (card details, comparisons, education content). Only personal data (dashboard, my cards, statements) is auth-gated. SEO is your free distribution.

**9. Educational content compounds; transactional doesn't.** Articles you write once rank on Google for years. Features you build need maintenance forever. Prefer content over features when both would solve the user's problem.

**10. Ship gates are non-negotiable.** Each phase has a quantitative gate before moving to the next. Don't bypass them because "this is more interesting." The gates exist because the next phase depends on the prior one.

---

## 3. Hard rules for new development

These apply to every feature in this roadmap. Claude Code: do not violate.

1. **Never bypass the Net Annual Value engine for money math.** All "best card" / "you'd save X" / "earnings comparison" features must call the engine, not duplicate its logic.
2. **Never store unhashed PAN, full card number, CVV, or OTP** anywhere — Supabase, logs, Redis, anywhere. Use last-4 + BIN-6 only.
3. **Never hit an external API in a render path.** All third-party calls go through Inngest jobs or cached server actions with explicit timeouts.
4. **All new tables have RLS enabled** at creation time, with policies defined in the same migration. No "we'll add RLS later" — that's how data leaks happen.
5. **All money in integer rupees** (paise only for transaction-level data). No floats.
6. **All dates in ISO 8601, IST timezone applied at write.** Display in user's locale.
7. **All new routes have loading skeletons and error boundaries.** No raw `<Loading...>` text. No exception bubbles to users.
8. **All forms have server-side validation in addition to client-side.** Client validation is UX, not security.
9. **All AI-generated text has a "Generated by AI" badge** and a thumbs-up/down feedback button. Never present LLM output as authoritative.
10. **All emails sent to users have an unsubscribe link** and respect user preferences in `user_notification_preferences` table.
11. **Every public-facing page has proper meta tags** (title, description, OG image). SEO is not optional.
12. **No client-side use of service role keys** ever. Server actions or Edge Functions only.

---

## 4. Excluded scope

Confirmed out-of-scope for v1 (per prior discussion). Do not build, do not add nav entries, do not spec further:

- **Mobile app** (iOS/Android native) — defer until 50K+ DAU; PWA-ify the web app instead
- **WhatsApp bot** — defer until web conversational AI proves retention
- **Email inbox scan** — defer; statement upload covers 85% of value at 5% of cost
- **UPI & AA sync** — requires RBI FIU registration; year-2 work
- **Browser extension** — high maintenance cost; defer until product-market fit proven
- **API for fintechs** — no buyers exist yet; revisit after 100K users
- **Location offers** — geolocation accuracy in India insufficient; defer
- **In-house affiliate platform** — use external affiliate URLs (Paisabazaar/BankBazaar) when ready
- **Card application white-label** — depends on bank API access not available to non-NBFCs

If you find yourself reaching for any of the above, you're going wider when you should be going deeper.

---

## 5. Phase overview

| Phase | Weeks | Theme | Features | Ship gate |
|---|---|---|---|---|
| **1** | 1-3 | Quick wins & foundations | 11 features (mostly content/calculators) | Apply Links live; all 85 cards have functional Apply button; 6 calculator/reference pages indexed by Google |
| **2** | 4-7 | Dashboard transformation | 8 features (My Cards, due dates, trackers) | 100+ users have added at least one card to their dashboard; due date reminders firing |
| **3** | 8-11 | AI & intelligence layer | 7 features (spend profiler, scoring, nudges) | Spend profiler categorizes 80%+ of statement transactions accurately; financial health score live |
| **4** | 12-18 | Polish, community & long-tail | 14 features (reviews, forums, advanced) | Community features active only after 25K monthly actives milestone |

Total: 40 features. Average velocity assumed: 1 developer, 2-3 features per week for simple, 1 feature per week for complex.

---

## 6. Phase 1 — Quick wins & foundations (weeks 1-3)

**Theme:** Ship the things that should already be live. Most of Phase 1 is content + calculators + wiring data you already have into the UI.

### 6.1 Apply Links integration

**Effort:** 4 hours
**Files to create:** `app/cards/[id]/components/ApplyButton.tsx`
**Files to modify:** `app/cards/[id]/page.tsx`

Replace the existing inert "Apply Now" button on each card detail page with the `ApplyButton` component that reads from `lib/data/card-apply-urls.ts` (already built). Handles three states:

- **Open application** → "Apply Now" → opens bank URL in new tab
- **Invite-only** (4 cards: HDFC Infinia, ICICI Emeralde Private, IndusInd Pioneer Heritage, RBL Insignia) → "Express Interest" → opens bank info page
- **Discontinued** (currently MMT ICICI Signature) → disabled "Not accepting applications"

Security: `target="_blank" rel="noopener noreferrer"` mandatory.

Add a small "Powered by direct bank link" microcopy under the button for transparency (clarifies you're not an affiliate, you're sending them to the bank directly).

**Acceptance criteria:**
- All 85 cards render the correct button state
- Click events tracked in analytics
- Mobile button is full-width and tappable (44px min height)
- aria-label includes card name for screen readers

### 6.2 Replace placeholder homepage stats

**Effort:** 2 hours
**Files to modify:** `app/page.tsx` or homepage component

Remove "100K+ Users Trust Us" and "4.9 User Rating" placeholders. Replace with verifiable metrics:

- **"85 cards tracked"** (count from DB)
- **"35+ data fields per card"** (count from schema)
- **"Last updated: <date>"** (from latest verification job)
- **"Free, ad-free, no affiliate bias"** (positioning statement)

If you eventually have real user count, swap back. Until then, honest numbers > impressive lies.

### 6.3 Document checklist page

**Effort:** 1 day
**New route:** `/apply/documents`

A reference page listing documents needed to apply for credit cards by user profile:

- **Salaried** — PAN, Aadhaar, latest 3 salary slips, Form 16, bank statement (3 months)
- **Self-employed** — PAN, Aadhaar, ITR (2 years), bank statement (6 months), business proof
- **Student** — PAN, Aadhaar, college ID, parent's income proof (for add-on or supplementary)
- **NRI** — Passport, OCI/PIO, NRE account proof, overseas income proof
- **Per-bank specifics** — Any unusual requirements (e.g., AU SFB requires CA-attested ITR for self-employed >₹10L)

Format as a checklist with download-as-PDF option. Drives high SEO traffic for "credit card documents required India" queries.

### 6.4 Helpline directory

**Effort:** 1 day
**New route:** `/safety/helplines`

Reference page with every Indian bank's credit card grievance helpline, escalation path, and Banking Ombudsman link. Format as a searchable table:

- Bank name
- Customer service phone (toll-free + paid)
- Email for complaints
- Card-specific lines (e.g., Infinia, Diners support)
- Escalation address
- Banking Ombudsman link for unresolved complaints
- Average response time (from public reviews if available)

This is pure public service content. Will rank high for distressed users searching "HDFC credit card complaint number" type queries. Trust-builder.

### 6.5 Virtual card info reference

**Effort:** 4 hours
**New route:** `/safety/virtual-cards`

Reference page explaining which cards offer virtual cards / tokenization / one-time-use card numbers. Driven by a new `virtual_card_features` field on the `cards` table (boolean: supports_virtual_card, supports_tokenization, supports_disposable_card).

Educational content + comparison table. Helps security-conscious users.

### 6.6 Fraud alert guide

**Effort:** 1 day
**New route:** `/safety/fraud-guide`

How-to article on responding to credit card fraud:

- Step 1: Block the card immediately (per-bank instructions)
- Step 2: File complaint at bank's grievance portal
- Step 3: Report to cybercrime.gov.in
- Step 4: Escalation via Banking Ombudsman if unresolved in 30 days
- Step 5: RBI complaint as last resort
- Common scam patterns (OTP phishing, fake reward calls, SIM swap)
- Zero-liability rules per RBI guidelines

Written once, ranks forever. Pair with the Helpline directory for cross-linking.

### 6.7 RBI rule updates feed

**Effort:** 2 days
**New route:** `/safety/rbi-updates`

A blog-style feed of RBI circulars affecting credit card holders. Initial content (10 backdated entries):

- 2022 RBI Master Direction on credit card issuance
- 2024 changes to surcharge waiver rules
- 2025 wallet load surcharge guidance
- 2026 BNPL regulation updates
- Token regulation timeline
- Cross-border transaction reporting

Each entry: date, summary, "what it means for cardholders," link to original RBI circular. Set up RSS feed for users to subscribe. New entries get added when RBI publishes (manual editorial process, ~1/month).

### 6.8 Interest calculator

**Effort:** 1 day
**New route:** `/tools/interest-calculator`

Simulates carrying a balance month by month on any card. Inputs:

- Card (dropdown from 85)
- Outstanding balance
- Monthly payment (or "minimum due")
- Number of months to project

Outputs:

- Total interest paid
- Months to clear balance at current payment
- "Pay X more per month and clear it in Y months saving Z" suggestion
- Chart showing principal vs. interest split over time

Uses each card's actual interest rate from the data file. Educational and decision-shaping. Excellent SEO target.

### 6.9 EMI calculator

**Effort:** 1 day
**New route:** `/tools/emi-calculator`

Side-by-side comparison of no-cost EMI vs. interest-bearing EMI on credit cards. Inputs:

- Purchase amount
- Tenure (3/6/9/12/18/24 months)
- Card (auto-applies the card's EMI interest rate)

Outputs:

- Monthly EMI on no-cost vs. interest-bearing
- Effective interest rate (factoring in "processing fee" tricks)
- Total cost difference
- Recommendation: take EMI or pay upfront

Critical for educated decision-making. Most users don't realize "no-cost EMI" often has hidden costs.

### 6.10 Points converter

**Effort:** 1 day
**New route:** `/tools/points-converter`

Cross-card reward point value calculator. Inputs:

- Card name
- Points balance
- Redemption type (statement credit / vouchers / airline miles / hotel points / SmartBuy products)

Outputs:

- Cash value in each redemption option
- Best redemption recommendation
- Comparison with other cards' redemption values

Powered by a new `reward_redemption_values` table (one row per card per redemption type). Manually curated data.

Why it matters: a user with 50,000 HDFC Infinia points doesn't know it's worth ₹50,000 on flights but only ₹15,000 on statement credit. This tool makes that visible.

### 6.11 First card guide

**Effort:** 2 days
**New route:** `/learn/first-credit-card`

A curated path for first-time credit card applicants:

- "Do you need a credit card?" — quick decision tree
- Eligibility self-check (links to Eligibility tool with pre-filled "first-time" context)
- Best first cards in 2026 (curated list of 5-6 options)
- What to expect: approval timeline, credit score impact, first 90 days
- How to use responsibly: pay full bill, keep utilization <30%, don't close oldest card
- Common mistakes to avoid

Pair with the Document Checklist. Comprehensive, evergreen content. Forms the foundation of the Credit Academy in Phase 4.

### Phase 1 ship gate

✅ All 85 cards have functional Apply buttons (open, invite, or discontinued state)
✅ Homepage shows honest stats only
✅ 6 calculator/reference pages live and indexed in `sitemap.xml`
✅ All Phase 1 pages have proper meta tags, OG images, and pass Lighthouse SEO score ≥90
✅ Mobile UX verified on 380px viewport for all new pages

**Estimated completion: end of Week 3**

---

## 7. Phase 2 — Dashboard transformation (weeks 4-7)

**Theme:** Turn the Dashboard from a stub into the highest-frequency reason users return. The thesis: users browse cards once, but check their dashboard weekly.

### 7.1 "My Cards" — let users add cards they own

**Effort:** 1 week
**New tables:** `user_cards`, `user_card_statements` (link)
**New routes:** `/dashboard/cards`, `/dashboard/cards/add`

Users add cards they actually hold via:

- **Search** the catalog and select
- **Custom entry** for cards not in catalog
- **Manual fields**: card last 4 digits, statement date, due date, credit limit (optional)
- **No card number storage** — only last 4 + BIN-6

Display in Dashboard:
- Cards as visual stack (re-use existing card visual component)
- Quick actions: "Update due date", "Mark statement received", "Delete"
- Tap a card → drill into per-card view with rewards earned, offers, statement history

This is the foundational unlock for Phase 2 — everything else (due dates, milestones, lounge tracking) depends on knowing which cards a user holds.

**Acceptance criteria:**
- User can add and remove cards in <30 seconds
- Cards persist in Supabase with RLS (user can only see their own)
- Empty state for new users: "Add your first card to unlock personalized insights"

### 7.2 Due date tracker

**Effort:** 3 days
**Depends on:** 7.1
**New table:** `user_card_due_dates` (one row per cycle)
**New cron:** Daily Inngest job to send reminders

For each card a user adds, capture:
- Statement generation date
- Payment due date
- Last payment status

Send reminders via:
- **In-app notification** 7 days before due
- **Email** 3 days before due (if user opted in)
- **Final reminder** 1 day before due

Dashboard surface: "Upcoming due dates" widget at top, sorted by date. Each card shows "Due in X days" with color coding (green >7d, yellow 3-7d, red <3d).

**Why this matters:** Late payment fees are ₹500-1000 per occurrence + credit score damage. Saving a user one late payment a year justifies the entire platform value.

### 7.3 Milestone tracker

**Effort:** 3 days
**Depends on:** 7.1, statement parsing pipeline (Phase 1 of README.md)
**Data source:** Reward rules table + statement totals

For each card a user owns, surface progress toward:

- Annual fee waiver threshold (e.g., "Spend ₹50K more to waive your ₹2,500 fee")
- Milestone reward bonuses (e.g., "₹1.5L more this quarter = ₹500 voucher")
- Tier upgrade thresholds (e.g., "₹2L more this year = Club Vistara Silver")

Progress bars with current spend / threshold / days remaining. Refreshes when new statement is uploaded.

Pulls from manually-curated `card_milestone_rules` table — one row per milestone per card.

### 7.4 Lounge tracker

**Effort:** 2 days
**Depends on:** 7.1
**New table:** `user_lounge_visits`

Track lounge usage against each card's annual quota:

- Card → annual lounge entitlement (domestic + international)
- Visits logged per quarter (user enters manually or imports from statement)
- "You've used 6 of 8 domestic visits this year" widget
- Alerts when approaching quota or quarterly reset

Especially valuable for cards with spend-criteria lounge access (HDFC Regalia Gold post-July 2026, IndusInd Pinnacle post-April 2026, ICICI Sapphiro). Knowing "you need ₹60K spend this quarter to unlock 3 lounge visits next quarter" is differentiated info.

### 7.5 Card changelog with benefit alerts

**Effort:** 3 days
**New table:** `card_changes`
**New route:** `/cards/[id]/changes` (public) + alerts in dashboard

Every time a card's terms change (fee, reward rate, benefits, lounge access), an entry is added to `card_changes`. Already documented manually in your cards data files (May 2026 Regalia Gold earn rate change, April 2026 Infinia retention rule, etc.).

Structure:
- Date of announcement
- Effective date
- Change type (fee, reward, benefit, eligibility, discontinuation)
- Short description
- Detailed impact analysis
- Source link

**Public timeline page:** `/cards/[id]/changes` shows full history. SEO gold (users search "HDFC Regalia Gold changes 2026").

**Dashboard alert:** When a user has a card and it gets a change entry, they see a notification on next login. Email opt-in available.

**Why this is your moat:** No competitor does this consistently in India. Banks announce changes via small print; users discover them via reduced rewards. CredStack tells them upfront. That's trust capital that compounds.

Initial content backfill: the ~30 documented changes in your existing cards files. Going forward: 1-2 entries per week as banks announce things (manual curation by admin).

### 7.6 Reward audit ("did you miss out?")

**Effort:** 1 week
**Depends on:** 7.1, statement upload pipeline
**Where it lives:** Inside `/analyzer` (enhancement to existing route)

After a user uploads a statement for a card they own, compute:

- **Actual rewards earned** (from statement)
- **Maximum possible rewards** (if all eligible spends had been on the best matching card from user's portfolio)
- **Delta** = missed value

Display as: "You earned ₹2,340 in rewards this month. You could have earned ₹4,180 if you'd used your other cards optimally. Here's what you missed:" [list of top 5 transactions where wrong card was used]

This is the killer "ah-ha" feature. The first time a user sees it, they realize they've been leaving money on the table for years. That's the moment they become a power user.

### 7.7 Month-over-month analytics

**Effort:** 3 days
**Depends on:** 7.1, statement parsing
**Where it lives:** Inside `/analyzer` (enhancement)

Time-series view of:
- Total spending per category over last 12 months
- Rewards earned per month
- Category mix changes (e.g., "Your dining spend doubled in October")
- Anomaly flags (statistical outliers in any category)

Charts via Recharts (already in your stack). Default view: last 6 months. Filter by category.

### 7.8 Tax export

**Effort:** 2 days
**Depends on:** 7.1
**New route:** `/dashboard/tax-export`

Annual summary report for ITR filing:
- Total spend per category (tax-relevant ones flagged)
- Foreign currency spend (for ITR Schedule FA / FSI)
- Refunds and chargebacks
- Downloadable as PDF + CSV
- Filterable by financial year (April-March)

Especially useful in March-July (Indian tax filing season). Drives seasonal traffic spikes.

### Phase 2 ship gate

✅ User can add a card to dashboard in <30 seconds
✅ Due date reminders firing reliably via Inngest cron
✅ At least 30 milestone rules curated across top 25 cards
✅ Card changelog has ≥50 entries (30 backfilled + 20 ongoing)
✅ Reward audit returns sensible "missed value" numbers for 5+ test statements
✅ Cohort metric: 100+ users have added at least one card

**Estimated completion: end of Week 7**

---

## 8. Phase 3 — AI & intelligence layer (weeks 8-11)

**Theme:** Build the intelligence layer that makes CredStack feel like a personal CFO for credit cards. Every feature here is 90% deterministic logic + 10% LLM explanation, per the guiding principles.

### 8.1 Spend profiler — auto-categorization

**Effort:** 1 week
**Depends on:** statement parsing pipeline (Phase 1 of README.md)
**Where it lives:** `/analyzer` enhancement

After statement parse, automatically tag each transaction with a category from your existing taxonomy (`food_delivery`, `dining`, `grocery`, `ecommerce_general`, `fashion`, etc.).

Categorization pipeline:
1. **Exact match** on merchant name in `merchants` table (highest confidence)
2. **MCC code mapping** from statement (medium confidence)
3. **Fuzzy match** against merchant aliases (lower confidence)
4. **LLM fallback** for unknown merchants (Groq, with confidence band)

User can override any classification. Overrides train a per-user mapping that's applied to future statements.

**Acceptance criteria:**
- 80%+ of transactions classified automatically without user intervention
- User can re-classify a transaction in <5 seconds
- Re-classifications improve the global merchant table (with admin review queue)

### 8.2 Card upgrade nudge

**Effort:** 3 days
**Depends on:** 7.1, 8.1, Net Annual Value engine
**Where it lives:** Dashboard widget

For each card a user owns, compute monthly:

"Based on your last 12 months of spending, you'd save ₹X/year by upgrading from [current card] to [recommended card]. Here's the breakdown:"

- Net Annual Value comparison (current card vs. recommended card on user's actual spend profile)
- Fee differential factored in
- Honest "no upgrade beneficial" outcome when applicable

**Why this is honest, not pushy:** It's grounded in real user data. If a user's spend doesn't justify an upgrade, the nudge says so. That's what builds trust.

Maximum frequency: one nudge per card per quarter. Never push multiple cards at once.

### 8.3 Financial health score

**Effort:** 1 week
**Depends on:** 7.1, 8.1
**New route:** `/dashboard/health-score`

Composite score (0-100) based on:

- **Utilization** (30 points) — Current outstanding / total credit limit across all cards. Healthy <30%.
- **Payment history** (30 points) — From due date tracker; on-time vs. late.
- **Credit mix** (15 points) — Number of cards, types, age of oldest.
- **Reward optimization** (15 points) — From reward audit; how much of available value is being captured.
- **Forex exposure** (10 points) — % of foreign spend on high-forex-markup cards.

Display as gauge + 5 sub-scores. Click each to see what's pulling it up/down + actionable recommendations.

**Tone:** Not "your score is bad," but "here's what's working and one thing to improve." Avoid creating anxiety about CIBIL. This is *your* score, not the bank's.

### 8.4 Reward maximiser (Optimizer enhancement)

**Effort:** 3 days
**Depends on:** 8.1
**Where it lives:** `/optimizer` enhancement

Current Optimizer: "Best card per transaction" hypothetical.

Enhanced Optimizer:
- **Merchant-aware**: "I'm at Amazon checkout for ₹15,000 — which of MY cards should I use?"
- **Considers active offers**: pulls from offers DB to factor in current month's bank offers
- **Considers caps**: knows you've already used ₹1,800 of your ₹2,000 monthly cashback cap on HDFC Millennia
- **Considers milestones**: nudges toward the card that needs ₹X more spend to hit a milestone
- **Explains the math**: not just "use this card" but "use this card because it gives you 5.2% effective return at this merchant after caps"

This is the most-frequently-used feature for power users. Build it right; people will come back multiple times per day.

### 8.5 Approval odds

**Effort:** 1 week
**Depends on:** eligibility data + statistical model
**Where it lives:** `/eligibility` enhancement

Current Eligibility: "You're eligible / not eligible."

Enhanced: probability band (High / Medium / Low) with reasoning.

Scoring model (rule-based, not LLM):
- **Income vs. card minimum** (40 weight) — Exceeds 2x = high, 1-2x = medium, <1x = low
- **Existing cards** (20 weight) — More existing cards generally improves odds; >5 cards may hurt for premium new applications
- **Employment type** (15 weight) — Salaried at top company > salaried at lesser-known company > self-employed > student
- **CIBIL band** (15 weight) — If user provides it (optional input)
- **City tier** (10 weight) — Tier 1 cities have better approval rates than Tier 2/3 historically

Output:
- "85% likely to be approved" + factors that helped
- "What might block you" + factors that hurt
- Suggested cards with higher approval likelihood at your profile

**Honest caveat:** Always show "These are estimates based on historical patterns, not bank decisions." Don't make CredStack liable for approval/rejection outcomes.

### 8.6 AI Advisor — deterministic backing

**Effort:** 1 week
**Depends on:** Net Annual Value engine
**Where it lives:** `/advisor` enhancement

Current AI Advisor: Groq generates recommendations from a prompt.

Enhanced: every "best card" answer is computed by the NAV engine first; LLM is only used to explain the result conversationally.

Flow:
1. User asks "best card for travel with ₹2L annual spend"
2. Backend constructs a spend profile from the question
3. NAV engine ranks all 85 cards for that profile, returns top 5 with savings deltas
4. Groq formats the top result as conversational reply, citing the math

This eliminates hallucination risk on the rupee values. The LLM can phrase things differently, but can never invent that "HDFC Infinia gives 8.4% on travel" when the data says 3.3%.

Add suggested follow-up questions ("Want to compare top 3?", "What about this card on dining spend?", "Show me eligibility for this card") as chips. Conversation history persisted per user.

### 8.7 Flash offers integration

**Effort:** 3 days
**Depends on:** offers scraping module (SCRAPING.md)
**Where it lives:** `/offers` enhancement + Dashboard widget

For offers with `ends_at` within next 48 hours:
- Mark as "Flash" in offers feed
- Sort to top with countdown timer (live)
- Push to dashboard "Hot now" widget for users with matching cards
- Email opt-in for "flash offers on your cards" (max once/day)

Why it matters: festival-period offers (Big Billion Days, Great Indian Festival) reward users who act fast. CredStack becomes the "what should I buy where today" tool.

### Phase 3 ship gate

✅ Spend profiler accuracy ≥80% on test statement set
✅ Financial health score live with at least 5 sub-score factors
✅ Approval odds available for all 85 cards
✅ Optimizer factors in active offers + user's actual cards
✅ AI Advisor passes "consistency test": same question yields same rupee figure across 10 invocations

**Estimated completion: end of Week 11**

---

## 9. Phase 4 — Polish, community & long-tail (weeks 12-18)

**Theme:** Add depth, breadth, and the community layer. Community features only ship after measurable user volume.

### 9.1 User ratings & reviews

**Effort:** 1 week
**New tables:** `card_reviews`, `card_review_votes`
**Where it lives:** Each `/cards/[id]` page

Authenticated users can leave reviews on cards. Structure:

- **Rating** (1-5 stars) on 4 axes: Rewards Value, Customer Service, Application Process, Lounge/Benefits
- **Written review** (50-500 chars)
- **Verified holder** badge (if user has card in their dashboard)
- **Helpful votes** (1 vote per user per review)

Display:
- Average rating prominently on card detail
- Top 3 helpful reviews
- Sort/filter by rating, recency, helpful

Moderation:
- Auto-filter spam patterns
- Manual review queue for flagged reviews
- Banned users can't post (admin enforcement)

**Critical:** Don't show ratings publicly until at least 10 reviews per card exist. Until then, "Reviews coming soon — be the first" is honest. Showing "4.7 stars from 2 reviews" is meaningless and looks fake.

### 9.2 Bank portfolio (debit + prepaid)

**Effort:** 1 week
**New tables:** `debit_cards`, `prepaid_cards`
**New route:** `/banks/[bank-id]` upgraded

For each bank, show full card portfolio across types:

- Credit cards (existing data)
- Debit cards (new data; ~30 important variants)
- Prepaid cards (new data; ~15 variants like FreeCharge, ICICI Pockets, Niyo)

Helps users understand the full product family. Useful context: "If you're an HDFC customer, here's their entire card lineup."

Data effort: ~45 new card entries for debit + prepaid. Lighter data structure than credit (no reward rules, no fees breakdown).

### 9.3 Card tiers tagging

**Effort:** 2 days
**Field addition:** `tier` enum on `cards` table

Add `tier` field with values:
- `entry` — Lifetime free, low income criteria, basic rewards
- `lifestyle` — ₹500-2K fee, dining/movies/shopping perks
- `premium` — ₹2K-7K fee, lounge + reward depth
- `super_premium` — ₹10K+ fee, invite-only or HNI
- `secured` — FD-backed (IDFC Wow, etc.)
- `student` — Co-applicant or student-specific

Use this for:
- Filter in `/cards` ("show only premium")
- Eligibility recommendations ("you qualify for entry-tier cards")
- Comparison logic ("don't compare a student card to an Infinia")

### 9.4 Credit Academy

**Effort:** 3 weeks (ongoing content)
**New routes:** `/learn/*` (multi-page hub)

Expand `/methodology` and `/learn/first-credit-card` into a full educational hub. Articles to write:

**Beginner (10 articles):**
- How credit cards actually work
- CIBIL score explained
- Reading your credit card statement
- Interest charges decoded
- Grace period and how it works
- Annual fees vs. lifetime free
- Add-on cards
- Rewards programs explained
- Lounge access primer
- What is a credit limit

**Intermediate (10 articles):**
- Hitting fee waiver thresholds
- Optimizing across multiple cards
- Card upgrades and downgrades
- Reward redemption strategy
- Forex markup explained
- EMI on credit cards: pros and cons
- Co-branded cards: who they're for
- RuPay vs. Visa vs. Mastercard vs. Amex
- Insurance benefits on cards
- Tax implications of card rewards

**Advanced (5 articles):**
- Manufactured spending in India (be honest about risks)
- Optimal card portfolio for high spenders
- Travel hacking with Indian cards
- Concierge benefit utilization
- Premium card retention strategies

Each article: 1,500-2,500 words, SEO-optimized, internal cross-links, related products from catalog. Compounds over years.

### 9.5 Wishlist & compare

**Effort:** 3 days
**New table:** `user_wishlists`
**Where it lives:** Dashboard

Users save cards they want to apply for later, with notes. Display:
- Saved cards in a queue
- Personal notes per card
- One-click to comparison view
- Share via URL (read-only public link)
- Move from "wishlist" to "owned" once approved

Lightweight feature. Helpful retention mechanism.

### 9.6 Application status tracker

**Effort:** 3 days
**New table:** `user_applications`
**Where it lives:** Dashboard

Users log when they apply for a card. Track:
- Date of application
- Bank's reference number
- Stage (applied / under review / approved / rejected / received)
- Days elapsed
- Notes

Display as a kanban-style board on dashboard. Useful for users applying to multiple cards.

Send reminders at 7 and 14 days post-application: "How's your application going? Update status here."

### 9.7 Referral tracker

**Effort:** 3 days
**New table:** `user_referrals`
**Where it lives:** Dashboard

Many cards offer referral bonuses (Amex MR points, HDFC vouchers, etc.). Help users:
- Log who they referred
- Track expected bonus
- Mark "bonus received" when credited
- Total lifetime referral value

Manual entry feature. No need to integrate with bank APIs.

### 9.8 Card forums (Phase 4 conditional)

**Effort:** 2 weeks
**Activation gate:** Only when 25K+ monthly actives
**New tables:** `forum_threads`, `forum_posts`, `forum_votes`

Per-card discussion threads. Reddit-style with upvotes.

**Risk:** An empty forum is worse than no forum. Don't launch until you can guarantee minimum activity per thread. Seed initial threads with curated content (FAQs, deal alerts, tips) before opening to user posts.

Moderation:
- Auto-flag spam
- Manual review of new accounts
- Banned users can't post
- Clear community guidelines

If you can't commit to active moderation for 12+ months, skip this feature.

### 9.9 User-submitted deals (Phase 4 conditional)

**Effort:** 1 week
**Activation gate:** Only when 25K+ monthly actives
**New table:** `user_submitted_offers`

Users post deals they found. Goes into a moderation queue before publication.

**Risk:** Legal exposure if someone posts a fraudulent offer and a user loses money. Mandatory disclaimers + admin approval before public visibility + verified-user-only posting.

Probably worth doing for the data quality boost (faster offer discovery) but only with the safeguards.

### 9.10 Leaderboard (Phase 4 conditional)

**Effort:** 3 days
**Activation gate:** Only when 25K+ monthly actives
**New table:** `user_achievements`

Gamification layer:
- Top reward earners (monthly)
- Top deal hunters
- Most helpful reviewers
- Card "completion" badges (held card for X years, hit milestone, etc.)

Show top 10 publicly (with consent). Show user's own rank always.

**Risk:** Leaderboards reward gaming the system, not honest behavior. Design carefully. Maybe focus on "most helpful" rather than "most spending."

### 9.11 Expert reviews

**Effort:** 1 week + ongoing
**New table:** `expert_reviews`
**Where it lives:** `/cards/[id]` enhancement

In-house or curated expert reviews of cards. Higher trust than user reviews. Different from regular reviews:

- Long-form (1,500+ words)
- Video walkthrough optional
- Verified expert badge (CredStack editorial team)
- Updated when card terms change
- "Use case" reviews (e.g., "Infinia for the casual traveller" vs. "Infinia for the heavy spender")

Top 30 cards get expert reviews in this phase. Rest follow in subsequent quarters.

### 9.12 Data vault (Safety hardening)

**Effort:** 1 week
**Where it lives:** Backend security upgrade

Existing auth + Supabase RLS is good. Data vault adds:

- **Client-side encryption** of sensitive uploads (statements) before they hit storage
- **Audit log** of all data access events (visible to users in Dashboard)
- **Right to be forgotten** — one-click delete of all user data
- **Export your data** — full JSON export (DPDP Act compliance preparation)
- **Session monitoring** — active sessions visible, remote sign-out option

Critical for trust and increasingly for legal compliance under India's DPDP Act.

### 9.13 Comparison enhancements

**Effort:** 1 week
**Where it lives:** `/compare` enhancement

Current Compare: side-by-side, probably 2-3 cards.

Enhanced:
- **Up to 4 cards** in comparison
- **Best-for-each-category verdict** — at each row, mark which card wins
- **"Pick winner" overall recommendation** — synthesized output
- **Share comparison link** — public URL, SEO-friendly
- **Save comparison** to user's account
- **Print/PDF export**
- **Embed widget** for external use (optional, low priority)

### 9.14 Reward systems detail

**Effort:** 1 week
**Where it lives:** `/cards/[id]` enhancement + new `/learn/rewards/[program]`

Per major rewards program (HDFC Reward Points, SBI Reward Points, Amex Membership Rewards, IndiGo 6E Rewards, Tata NeuCoins, Club Vistara, etc.), build a dedicated learning page:

- How earning works
- How redemption works
- Best uses (with current exchange rates)
- Transfer partners
- Expiry rules
- Compared to other programs

Each card detail page links to its rewards program page. Educational depth + SEO targeting.

### Phase 4 ship gate

✅ All 85 cards have at least one expert review (top 30) or community review (remaining 55)
✅ Card tiers tagged and filterable
✅ Bank portfolio expanded to include debit + prepaid
✅ Credit Academy has 20+ articles published
✅ Data vault features operational
✅ Community features (forums, leaderboards) gated behind 25K MAU threshold or explicitly deferred to Phase 5

**Estimated completion: end of Week 18**

---

## 10. Feature catalog — master table

| # | Feature | Module | Phase | Effort | AI? | Depends on |
|---|---|---|---|---|---|---|
| 1 | Apply Links integration | Application | 1 | 4h | — | Existing card-apply-urls.ts |
| 2 | Homepage stats replacement | Home | 1 | 2h | — | — |
| 3 | Document checklist | Application | 1 | 1d | — | — |
| 4 | Helpline directory | Safety | 1 | 1d | — | — |
| 5 | Virtual card info | Safety | 1 | 4h | — | Schema field add |
| 6 | Fraud alert guide | Safety | 1 | 1d | — | — |
| 7 | RBI rule updates feed | Safety | 1 | 2d | — | — |
| 8 | Interest calculator | Education | 1 | 1d | — | — |
| 9 | EMI calculator | Education | 1 | 1d | — | — |
| 10 | Points converter | Offers | 1 | 1d | — | New table |
| 11 | First card guide | Education | 1 | 2d | — | — |
| 12 | My Cards (Dashboard) | Discovery | 2 | 1w | — | New tables, RLS |
| 13 | Due date tracker | Analytics | 2 | 3d | — | 12 + Inngest |
| 14 | Milestone tracker | Offers | 2 | 3d | — | 12 + statement pipeline |
| 15 | Lounge tracker | Offers | 2 | 2d | — | 12 |
| 16 | Card changelog + alerts | Discovery | 2 | 3d | — | New table |
| 17 | Reward audit | Analytics | 2 | 1w | — | 12 + statement parsing |
| 18 | Month-over-month | Analytics | 2 | 3d | — | Statement parsing |
| 19 | Tax export | Analytics | 2 | 2d | — | 12 + statement parsing |
| 20 | Spend profiler | AI | 3 | 1w | ✅ | Statement parsing |
| 21 | Card upgrade nudge | AI | 3 | 3d | ✅ | 12, 20, NAV engine |
| 22 | Financial health score | AI | 3 | 1w | partial | 12, 20 |
| 23 | Reward maximiser | AI | 3 | 3d | partial | 20, offers DB |
| 24 | Approval odds | AI | 3 | 1w | — | Eligibility data |
| 25 | AI Advisor deterministic | AI | 3 | 1w | ✅ | NAV engine |
| 26 | Flash offers | Offers | 3 | 3d | — | Offers scraping (SCRAPING.md) |
| 27 | User ratings & reviews | Community | 4 | 1w | — | New tables |
| 28 | Bank portfolio (debit/prepaid) | Discovery | 4 | 1w | — | New tables, data |
| 29 | Card tiers tagging | Discovery | 4 | 2d | — | Schema field |
| 30 | Credit Academy | Education | 4 | 3w | — | Content writing |
| 31 | Wishlist & compare | Application | 4 | 3d | — | New table |
| 32 | Application status tracker | Application | 4 | 3d | — | New table |
| 33 | Referral tracker | Application | 4 | 3d | — | New table |
| 34 | Card forums | Community | 4 (gated) | 2w | — | 25K MAU |
| 35 | User-submitted deals | Community | 4 (gated) | 1w | — | 25K MAU, moderation |
| 36 | Leaderboard | Community | 4 (gated) | 3d | — | 25K MAU |
| 37 | Expert reviews | Discovery | 4 | 1w + ongoing | — | Editorial process |
| 38 | Data vault hardening | Safety | 4 | 1w | — | Auth |
| 39 | Comparison enhancements | Compare | 4 | 1w | — | Existing compare |
| 40 | Reward systems detail | Education | 4 | 1w | — | New pages |

**Total estimated effort:** ~22-28 developer-weeks for one person, faster with parallelization.

---

## 11. Existing feature enhancements

Detailed specs for the 4 highest-traffic routes. Lighter notes for the rest.

### 11.1 Home (`/`) — detailed spec

**Current state:** Hero, dual-card illustration, "Compare Cards" CTA, placeholder stats.

**Enhanced state after Phase 1:**

- **Honest stats** (see 6.2)
- **Personalized hero** when user is logged in: "Welcome back, [name]. Your dashboard has X updates."
- **"Cards you might like" carousel** (Phase 3+): based on user's stated interests or browsing history; signed-out users see general top picks
- **"What's new" strip** (Phase 2+): latest card changes, hot offers, RBI updates
- **Trust signals**: "Updated [today]", "Free, ad-free, no affiliate bias", "85 cards × 35+ fields each = real depth"
- **Footer**: Educational links (Credit Academy preview), Safety links (Helplines, Fraud guide), legal/privacy

**Layout:** Mobile-first. Hero collapses gracefully. Carousels swipe horizontally on mobile.

### 11.2 Cards (`/cards`) — detailed spec

**Current state:** Card grid/list with filtering.

**Enhanced state:**

- **Smart filters** (Phase 1+):
  - Annual fee range slider
  - Income criteria (min income filter)
  - Card tier (entry / lifestyle / premium / super premium)
  - Network (Visa / Mastercard / Amex / RuPay / Discover)
  - Issuer (all 15 issuers as multi-select)
  - Features (lounge access, no forex, lifetime free, etc.)
  - Categories (cashback, travel, rewards, fuel, etc.)
- **Saved filter sets**: signed-in users can save filter combinations for later
- **Sort options**: Featured / Popular / Highest rated / Lowest fee / Best for category
- **Filter chip view**: applied filters shown as removable chips
- **Result count + "matching your profile" indicator** when logged in
- **Bulk actions**: Select 2-4 cards → compare or save to wishlist
- **Card preview hover**: quick rewards summary on hover/tap before full detail
- **Infinite scroll or pagination**: paginate after 24 cards (current default)

**Performance:** All filtering client-side after initial load (85 cards is small enough). Use `useMemo` heavily.

### 11.3 AI Advisor (`/advisor`) — detailed spec

**Current state:** Chat interface with LLM responses.

**Enhanced state (Phase 3):**

- **Deterministic backing** (see 8.6) — every rupee value computed, not generated
- **Conversation history**: persisted per user with edit/delete options
- **Suggested questions** as starter chips:
  - "Best card for my spending pattern" (uploads statement)
  - "What's the best travel card I qualify for?"
  - "Which of my cards should I close?"
  - "Compare HDFC Infinia vs. Amex Platinum for me"
  - "What's a good first credit card?"
- **Card chips in responses**: when LLM mentions a card, render it as a clickable card chip (mini card visual with link to detail)
- **Math transparency**: every recommendation has a "Show the math" expandable section showing the NAV engine output
- **Follow-up suggestions**: after each response, show 2-3 relevant follow-ups
- **Export conversation**: share or save as PDF
- **Streaming responses**: token-by-token streaming for better UX
- **Voice input** (optional, low priority): mic button for mobile users

### 11.4 Analyzer (`/analyzer`) — detailed spec

**Current state:** Statement upload + analysis.

**Enhanced state:** This is the route with most enhancements. After Phases 2-3:

- **Multi-statement upload**: drag-and-drop multiple PDFs/CSVs at once
- **Smart parser**: auto-detects bank format (HDFC, SBI, ICICI, Axis, etc.) — different layouts
- **Spend profiler** (8.1) — auto-categorize transactions
- **Reward audit** (7.6) — what you earned vs. what you could have earned
- **Month-over-month** (7.7) — time-series charts
- **Tax export** (7.8) — ITR-ready summary
- **Anomaly detection**: highlight unusual transactions (large amounts, new merchants, foreign currency)
- **Per-category drilldowns**: click "Food Delivery" → see all transactions in that category across all months
- **Manual transaction correction**: edit category, exclude from analysis, add notes
- **Statement history**: all uploaded statements stored (encrypted), browsable timeline
- **Privacy controls**: client-side encryption option, auto-delete after analysis option

**Critical:** This is the route where users trust you with the most sensitive data. UX must reinforce that trust at every touchpoint. Clear "Your data is encrypted and only you can see it" messaging. Audit log of access.

### 11.5 Optimizer (`/optimizer`) — lighter notes

Enhanced per 8.4:
- Merchant-aware ("at Amazon checkout for ₹15K → use this card")
- Considers user's actual cards (not hypothetical)
- Factors in current offers + caps + milestones
- Explains the math

### 11.6 Compare (`/compare`) — lighter notes

Enhanced per 9.13:
- Up to 4 cards
- Best-for-each-row marker
- Share + save + PDF export
- Auto-compare with similar tier cards

### 11.7 Eligibility (`/eligibility`) — lighter notes

Enhanced per 8.5:
- Approval odds with probability bands
- "What helps you" + "What hurts you" breakdown
- Suggested cards at user's profile

### 11.8 Offers (`/offers`) — lighter notes

Already mostly speced in SCRAPING.md. Phase 3 enhancements:
- Flash offers section (8.7)
- Best card per offer (auto-match)
- Filter by user's cards (signed-in)

### 11.9 Reward Expiry (`/reward-expiry`) — lighter notes

Enhanced post-Phase 2:
- Pulls from user's actual cards (after 7.1)
- Pre-emptive 30/14/7 day alerts
- Redemption suggestions per card
- "Use it on this" recommendations

### 11.10 Methodology (`/methodology`) — lighter notes

Becomes the entry point to Credit Academy in Phase 4. Add:
- "How we score cards" detailed write-up
- Data sources transparency
- Update cadence (when we re-verify each card)
- Contact for corrections

### 11.11 Dashboard (`/dashboard`) — detailed in Phase 2

Currently a stub. Phase 2 transforms it into the primary product surface. See section 7 in full.

---

## 12. Database additions

New tables needed beyond what `README.md` and `SCRAPING.md` already specify. All have RLS enabled at creation.

### Phase 1 additions

```sql
-- Reward redemption values (for Points Converter — 6.10)
CREATE TABLE reward_redemption_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  redemption_type text NOT NULL,
    -- 'statement_credit' | 'voucher' | 'airline_miles' | 'hotel_points' | 'product' | 'fuel' | 'flight_via_portal' | 'hotel_via_portal'
  partner_name text,
    -- 'KrisFlyer', 'Marriott Bonvoy', 'Tanishq', 'IOCL', etc.
  rupee_value_per_point numeric(6,4) NOT NULL,
    -- e.g., 1.0 for HDFC Infinia flight booking, 0.25 for SBI base
  notes text,
  last_verified_at timestamptz DEFAULT now(),
  UNIQUE (card_id, redemption_type, partner_name)
);

-- Virtual card features
ALTER TABLE cards
  ADD COLUMN supports_virtual_card boolean DEFAULT false,
  ADD COLUMN supports_tokenization boolean DEFAULT true,
  ADD COLUMN supports_disposable_card boolean DEFAULT false;

-- RBI updates feed
CREATE TABLE rbi_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  impact_description text,
  effective_date date,
  published_at timestamptz DEFAULT now(),
  rbi_circular_url text,
  affected_card_categories text[],
  created_at timestamptz DEFAULT now()
);
```

### Phase 2 additions

```sql
-- User-owned cards
CREATE TABLE user_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id uuid REFERENCES cards(id) ON DELETE SET NULL,
    -- nullable to support custom cards not in catalog
  custom_card_name text,
    -- only set when card_id is null
  last_four_digits text CHECK (last_four_digits ~ '^\d{4}$'),
  bin_six text CHECK (bin_six ~ '^\d{6}$' OR bin_six IS NULL),
  nickname text,
  credit_limit int,
  statement_date int CHECK (statement_date BETWEEN 1 AND 31),
  due_date int CHECK (due_date BETWEEN 1 AND 31),
  added_at timestamptz DEFAULT now(),
  archived_at timestamptz
);
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_cards owner" ON user_cards
  USING (user_id = auth.uid());

-- Card changes timeline
CREATE TABLE card_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  change_type text NOT NULL,
    -- 'fee' | 'reward_rate' | 'benefit_added' | 'benefit_removed' | 'eligibility' | 'discontinuation' | 'rebrand'
  announced_at date NOT NULL,
  effective_date date,
  short_description text NOT NULL,
  detailed_impact text,
  source_url text,
  severity text NOT NULL DEFAULT 'medium',
    -- 'low' | 'medium' | 'high' (high = users should be alerted)
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_card_changes_card_date
  ON card_changes(card_id, effective_date DESC);

-- Milestone rules (manually curated)
CREATE TABLE card_milestone_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  milestone_type text NOT NULL,
    -- 'fee_waiver' | 'reward_bonus' | 'tier_upgrade' | 'voucher' | 'lounge_unlock'
  threshold_amount int NOT NULL,           -- in integer rupees
  period text NOT NULL,                    -- 'monthly' | 'quarterly' | 'annually'
  reward_value int,                        -- rupee value of the milestone reward
  description text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Lounge visits
CREATE TABLE user_lounge_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_card_id uuid NOT NULL REFERENCES user_cards(id) ON DELETE CASCADE,
  visit_date date NOT NULL,
  lounge_name text,
  airport_code text,
  lounge_type text,                        -- 'domestic' | 'international' | 'railway'
  guest_count int DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE user_lounge_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lounge_visits owner" ON user_lounge_visits
  USING (user_id = auth.uid());

-- Notification preferences
CREATE TABLE user_notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  due_date_reminders boolean DEFAULT true,
  due_date_email boolean DEFAULT false,
  due_date_days_before int[] DEFAULT ARRAY[7, 3, 1],
  card_change_alerts boolean DEFAULT true,
  card_change_email boolean DEFAULT false,
  flash_offers boolean DEFAULT true,
  flash_offers_email boolean DEFAULT false,
  reward_expiry_alerts boolean DEFAULT true,
  monthly_summary boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_prefs owner" ON user_notification_preferences
  USING (user_id = auth.uid());
```

### Phase 3 additions

```sql
-- Parsed transactions from statements
CREATE TABLE user_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_card_id uuid REFERENCES user_cards(id) ON DELETE CASCADE,
  statement_id uuid REFERENCES user_statements(id) ON DELETE CASCADE,
    -- user_statements table is in main README.md
  transaction_date date NOT NULL,
  posted_date date,
  description text NOT NULL,
  amount_paise bigint NOT NULL,            -- paise for transaction precision
  merchant_id uuid REFERENCES merchants(id),
  merchant_name_raw text,
  category offer_category,
  mcc text,
  is_foreign boolean DEFAULT false,
  forex_amount_paise bigint,
  forex_currency text,
  user_override_category offer_category,
  confidence_score numeric(3,2),
  raw_data jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE user_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "transactions owner" ON user_transactions
  USING (user_id = auth.uid());

-- Financial health scores (computed periodically)
CREATE TABLE user_health_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  computed_at timestamptz NOT NULL DEFAULT now(),
  total_score int NOT NULL,
  utilization_score int NOT NULL,
  payment_history_score int NOT NULL,
  credit_mix_score int NOT NULL,
  reward_optimization_score int NOT NULL,
  forex_exposure_score int NOT NULL,
  factors jsonb NOT NULL,                  -- detailed breakdown
  recommendations jsonb NOT NULL
);
ALTER TABLE user_health_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "health scores owner" ON user_health_scores
  USING (user_id = auth.uid());
```

### Phase 4 additions

```sql
-- Reviews
CREATE TABLE card_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  rating_rewards int CHECK (rating_rewards BETWEEN 1 AND 5),
  rating_service int CHECK (rating_service BETWEEN 1 AND 5),
  rating_application int CHECK (rating_application BETWEEN 1 AND 5),
  rating_benefits int CHECK (rating_benefits BETWEEN 1 AND 5),
  overall_rating numeric(3,2) GENERATED ALWAYS AS (
    (COALESCE(rating_rewards, 0) + COALESCE(rating_service, 0) +
     COALESCE(rating_application, 0) + COALESCE(rating_benefits, 0))::numeric / 4
  ) STORED,
  review_text text CHECK (length(review_text) BETWEEN 50 AND 500),
  verified_holder boolean DEFAULT false,
  helpful_count int DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
    -- 'pending' | 'approved' | 'rejected' | 'flagged'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, card_id)
);
ALTER TABLE card_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews public read approved" ON card_reviews FOR SELECT
  USING (status = 'approved');
CREATE POLICY "reviews owner write" ON card_reviews FOR ALL
  USING (user_id = auth.uid());

-- Applications tracker
CREATE TABLE user_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id uuid REFERENCES cards(id),
  custom_card_name text,
  applied_at date NOT NULL,
  status text NOT NULL DEFAULT 'applied',
    -- 'applied' | 'under_review' | 'approved' | 'rejected' | 'received' | 'cancelled'
  bank_reference_no text,
  expected_decision_by date,
  notes text,
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE user_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "applications owner" ON user_applications
  USING (user_id = auth.uid());

-- Wishlist
CREATE TABLE user_wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  notes text,
  priority int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, card_id)
);
ALTER TABLE user_wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wishlist owner" ON user_wishlists
  USING (user_id = auth.uid());

-- Referrals
CREATE TABLE user_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id uuid REFERENCES cards(id),
  referee_name text,
  referee_email text,
  referred_at date NOT NULL,
  expected_bonus_value int,
  bonus_received boolean DEFAULT false,
  bonus_received_at date,
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "referrals owner" ON user_referrals
  USING (user_id = auth.uid());

-- Expert reviews (admin-curated)
CREATE TABLE expert_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  reviewer_credentials text,
  use_case_focus text,
    -- 'casual_traveler' | 'heavy_spender' | 'first_card' | 'lounge_optimizer' | etc.
  rating int CHECK (rating BETWEEN 1 AND 10),
  short_summary text NOT NULL,
  full_review markdown,
  video_url text,
  published_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE expert_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "expert reviews public read" ON expert_reviews FOR SELECT
  USING (true);
CREATE POLICY "expert reviews admin write" ON expert_reviews FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Debit and prepaid cards (extends Discovery)
CREATE TABLE debit_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  issuer text NOT NULL,
  network text NOT NULL,
  tier text,
  annual_fee int DEFAULT 0,
  features text[],
  created_at timestamptz DEFAULT now()
);

CREATE TABLE prepaid_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  issuer text NOT NULL,
  network text NOT NULL,
  max_balance int,
  reload_options text[],
  features text[],
  created_at timestamptz DEFAULT now()
);

-- Forums (Phase 4 conditional)
CREATE TABLE forum_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid REFERENCES cards(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  upvotes int DEFAULT 0,
  reply_count int DEFAULT 0,
  status text NOT NULL DEFAULT 'open',
  pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  last_activity_at timestamptz DEFAULT now()
);

CREATE TABLE forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  upvotes int DEFAULT 0,
  parent_post_id uuid REFERENCES forum_posts(id),
  status text NOT NULL DEFAULT 'visible',
  created_at timestamptz DEFAULT now()
);
```

---

## 13. Dependency graph

```
Phase 1 (no dependencies on prior phases)
├── Apply Links (6.1)
├── Stats replacement (6.2)
├── Document checklist (6.3)
├── Helpline directory (6.4)
├── Virtual card info (6.5)
├── Fraud alert guide (6.6)
├── RBI updates (6.7)
├── Interest calculator (6.8)
├── EMI calculator (6.9)
├── Points converter (6.10) ← needs reward_redemption_values table
└── First card guide (6.11)

Phase 2 (depends on Phase 1 + main README Phase 1 infra)
├── My Cards (7.1) ←─────────────────────┐
│                                         │
├── Due date tracker (7.2) ─── needs 7.1 ─┤
├── Milestone tracker (7.3) ── needs 7.1 ─┤
├── Lounge tracker (7.4) ─── needs 7.1 ───┤
├── Card changelog (7.5) ─── independent ─┤
├── Reward audit (7.6) ── needs 7.1 + statement parsing
├── Month-over-month (7.7) ── needs statement parsing
└── Tax export (7.8) ── needs 7.1 + statement parsing

Phase 3 (depends on Phase 2)
├── Spend profiler (8.1) ── needs statement parsing
├── Card upgrade nudge (8.2) ── needs 7.1 + 8.1 + NAV engine
├── Financial health score (8.3) ── needs 7.1 + 8.1
├── Reward maximiser (8.4) ── needs 8.1 + offers DB
├── Approval odds (8.5) ── independent
├── AI Advisor deterministic (8.6) ── needs NAV engine
└── Flash offers (8.7) ── needs offers scraping (SCRAPING.md)

Phase 4 (depends on Phase 3 + user volume)
├── Ratings & reviews (9.1) ── independent
├── Bank portfolio (9.2) ── independent (new data)
├── Card tiers (9.3) ── independent
├── Credit Academy (9.4) ── content effort
├── Wishlist (9.5) ── independent
├── Application tracker (9.6) ── independent
├── Referral tracker (9.7) ── independent
├── Card forums (9.8) ── 25K MAU gate
├── User deals (9.9) ── 25K MAU gate
├── Leaderboard (9.10) ── 25K MAU gate
├── Expert reviews (9.11) ── editorial process
├── Data vault (9.12) ── independent security work
├── Compare enhancements (9.13) ── independent
└── Reward systems detail (9.14) ── independent
```

Critical path: My Cards (7.1) → Spend profiler (8.1) → Financial health score (8.3). These three features in this order unlock most of the platform's value.

---

## 14. Risk register

Known risks and mitigations.

### R1. Card data drift
**Risk:** Cards change terms 2-4 times per year. Without re-verification, your data becomes stale and users lose trust.
**Mitigation:** Quarterly verification cron (already speced in SCRAPING.md Tier 1). Card changelog page (7.5) makes drift visible. Add `last_verified_at` field to each card.

### R2. AI hallucination on money values
**Risk:** LLM invents "HDFC Infinia gives 12% on flights" when it's actually 3.3%, user makes wrong decision, blames CredStack.
**Mitigation:** Hard rule #1 — all money math is deterministic. LLM only generates explanation. Show "Show the math" expandable for transparency.

### R3. Statement parsing accuracy
**Risk:** Bank statement formats vary; parser breaks on unknown layouts. User uploads, gets garbage data, abandons.
**Mitigation:** Test against statement fixtures from all 15 major issuers. Manual correction UI mandatory. "Unable to parse" graceful fallback with email-to-admin option.

### R4. RBI regulatory changes
**Risk:** RBI changes credit card rules; existing features become non-compliant overnight (e.g., 2022 Master Direction changed how surcharge could be marketed).
**Mitigation:** RBI updates feed (6.7) is internal-facing too — admin gets alerts when new circulars affect platform. Quarterly compliance review.

### R5. Affiliate URL changes
**Risk:** Banks change URL structures; apply links break.
**Mitigation:** Weekly verify cron (in card-apply-urls.ts spec). Admin alert for broken links. Fallback to bank's main credit card page if specific URL 404s.

### R6. Community feature toxicity
**Risk:** Forums become spam/scam vector or rating manipulation venue.
**Mitigation:** Gate behind 25K MAU. Mandatory moderation queue for first 100 posts per user. Verified-holder badge requirement for deal posting. Clear guidelines + enforcement.

### R7. DPDP Act compliance
**Risk:** India's Digital Personal Data Protection Act adds compliance requirements for personal data handling. Penalties up to ₹250 crore.
**Mitigation:** Data vault features (9.12) — right to delete, export, audit log. Privacy policy review with legal. Consent flows for all data collection. Don't store data you don't need.

### R8. Reward rule complexity
**Risk:** Cards have edge cases (caps, exclusions, MCC restrictions) that are hard to model accurately. NAV engine returns wrong number for unusual spend.
**Mitigation:** Manual reward rules curation (per main README spec). Confidence bands on calculations. "How we calculated this" transparency. Manual review queue for low-confidence cases.

### R9. Scraping breakage at scale
**Risk:** As you add more parsers, more break per week. Maintenance overhead grows linearly.
**Mitigation:** Limit to 11 sources max (per SCRAPING.md). Fixture-based tests for parsers. Source health monitoring. Disable on failure rather than serve stale data.

### R10. Solo developer burnout
**Risk:** 40 features × ~22 weeks = relentless pace. Burnout = quality drop.
**Mitigation:** Phase gates are non-negotiable rest checkpoints. Each ship gate represents a complete, demoable product slice. Don't skip the gates to "save time."

---

## 15. Decision log

Captures the tradeoffs already discussed so future-you doesn't relitigate.

| # | Decision | Date | Rationale |
|---|---|---|---|
| 1 | Exclude mobile app from v1 | May 2026 | PWA gets 80% of value at 5% of cost; defer until 50K+ DAU |
| 2 | Exclude WhatsApp bot from v1 | May 2026 | ₹0.30-0.80/conversation costs add up; web AI Advisor covers the need |
| 3 | Exclude email inbox scan from v1 | May 2026 | OAuth + Google security review overhead not justified vs. statement upload |
| 4 | Exclude UPI/AA sync from v1 | May 2026 | Requires RBI FIU registration; capital + compliance overhead for year-2 |
| 5 | Exclude browser extension from v1 | May 2026 | DOM scraper maintenance ~3-4x web; defer until product-market fit proven |
| 6 | Exclude API for fintechs from v1 | May 2026 | No B2B buyers at current scale |
| 7 | Exclude location offers | May 2026 | Geolocation accuracy in India insufficient; merchant data incomplete |
| 8 | Gate community features behind 25K MAU | May 2026 | Empty forums/leaderboards are worse than absent ones; need critical mass |
| 9 | Money math always deterministic | May 2026 | Trust requirement; LLM only for explanation layer |
| 10 | 85 cards covers v1; long-tail via admin curation | May 2026 | Covers ~95% of user queries; remaining have low marginal value |
| 11 | Tier-based scraping schedule (Mon hubs, Tue/Fri DesiDime) | May 2026 | Stays under Firecrawl free tier (500 credits/month) |
| 12 | Statement upload over inbox scan / SMS scrape | May 2026 | Lower regulatory burden, higher user trust, sufficient data quality |
| 13 | Manual reward rules curation, not LLM-generated | May 2026 | Required for accuracy; LLM-generated rules have unacceptable error rate |
| 14 | Public catalog pages indexed; user data auth-gated | May 2026 | SEO is free distribution; privacy is non-negotiable for personal data |
| 15 | Honest stats over impressive lies on homepage | May 2026 | Trust compounds; betrayal doesn't recover |
| 16 | Card changelog as differentiator/moat | May 2026 | No competitor does this consistently in India |
| 17 | Skip in-house affiliate platform | May 2026 | Use external affiliates (Paisabazaar etc.) when ready; not core to v1 |
| 18 | RuPay/UPI focus on highlighted cards | May 2026 | 40% of credit card transaction volume in India is UPI-linked credit |

---

## Implementation notes for Claude Code

When picking up a task from this roadmap:

1. **Read the relevant phase section in full** before starting any feature.
2. **Verify dependencies** are met before beginning. If a phase 3 feature needs phase 2's `user_cards` table, confirm it exists.
3. **Check the Decision Log** for prior context before proposing alternative approaches.
4. **Write the migration first**, with RLS enabled at table creation.
5. **Add empty states** to every list/feed before considering the feature done.
6. **Write at least one happy-path test** per feature (Vitest already in stack).
7. **Update the ship gate checklist** when each phase nears completion.
8. **Don't bundle features.** One feature per PR even if they seem related.
9. **If a feature seems ambiguous, ask before building.** Better to clarify upfront than rebuild.
10. **If you discover new excluded scope concerns mid-build, add them to the Decision Log.** Don't silently change scope.

---

**End of ROADMAP.md**

Cross-references:
- Platform architecture: `./README.md`
- Offers ingestion: `./SCRAPING.md`
- Card data: `./lib/data/cards-*.ts`
- Apply URLs: `./lib/data/card-apply-urls.ts`
