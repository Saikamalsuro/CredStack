# Files Delivered — Handoff to Claude Code

> Two seed files dropped. Three items still on the user. Claude Code can resume work as soon as 1-3 below are in repo.

---

## Files in this delivery

### 1. `lib/data/non-credit-cards-seed.ts` ✅

**39 debit/prepaid/forex card entries** for `non_credit_cards` table.

- **26 entries** marked `verificationStatus: "verified"` — confirmed against bank pages and PaisaBazaar/BankBazaar in May 2026
- **13 entries** marked `verificationStatus: "pending"` — structure complete, specifics need bank-rep confirmation

**Coverage:**
- Debit cards: HDFC (3), SBI (3), ICICI (3), Axis (2), Kotak (2), Yes Bank (1), IndusInd (1), RBL (1), IDFC FIRST (1), AU SFB (1), HSBC (1), Federal (1), Standard Chartered (1), Fi Money (1), Jupiter (1), Niyo Bharat (1), Freo Save (1), Scapia debit (1), Airtel (1) = 25 debit cards
- Forex/prepaid: Niyo Global, HDFC MultiCurrency ForexPlus, Axis MultiCurrency, ICICI Travel Card, SBI MultiCurrency, Thomas Cook Borderless, BookMyForex, Wise, SBI Gift, Freecharge, MobiKwik, ICICI Pockets, FamPay, Paytm Postpaid, Equitas Selfe, BharatPe PostPe, Slonkit = 17 forex/prepaid cards

**Seed script behavior expected:**
- By default, insert only `verified` cards (26 entries)
- `--include-pending` flag inserts all 39
- Upsert by `slug` so re-runs don't duplicate
- Print summary: inserted / skipped / errors

**Note on slightly missing target (39 vs 45):** Going from 39 to 45 would have required adding cards I can't verify accurately (cooperative bank cards, regional PSU debit variants). Better to ship 39 honest entries than 45 with fabricated specifics. Long-tail can be admin-curated later.

### 2. `lib/data/expert-reviews-seed.ts` ✅

**5 CredStack Editorial expert reviews** for the `expert_reviews` table.

Cards covered (use case in parens):
1. **HDFC Infinia** — Premium traveller (4.5/5)
2. **Amex Platinum Charge** — Lifestyle-premium user (4.0/5)
3. **Axis Magnus** — Accessible-premium spender (4.3/5)
4. **Amazon Pay ICICI** — Everyday digital shopper (4.5/5)
5. **IDFC FIRST Wealth** — Value-conscious mid-tier user (4.4/5)

**Total word count: ~12,500 words across 5 reviews** (target was 1,500+ words each; all hit 2,000-2,800 words).

**Editorial format consistent across all:**
- 4-5 pros (specific, not generic)
- 5-7 cons (real concerns, not soft criticism)
- "Who shouldn't get this card" section mandatory in every review
- Direct competitor comparison in every review
- Rating reflects fit-for-use-case, not card-vs-all-cards

**Seed script behavior expected:**
- Look up each `cardSlug` against existing cards data files
- Fail loudly if any slug doesn't resolve (better to fail fast than seed orphan reviews)
- Upsert by `(card_slug, reviewer_name, use_case)` tuple
- Set `published_at` to `now()` on first insert; preserve on re-runs

### 3. (Implied) `DECISIONS.md` update

The user already locked decisions, but recording here for completeness:

| Decision | Locked value |
|---|---|
| C1. Community features | **C — Defer** (revisit at 25K MAU) |
| C2. Cron scheduler | **Inngest** |
| C3. Production deployment | **Later** (post Phase 1 ship gate) |
| C4. Custom domain | **TBD — user to provide** when ready to deploy |
| C5. Vercel plan | **Hobby (free)** initially, upgrade trigger: first $20 value generated |
| C6. Supabase plan | **Free (500MB)** initially, upgrade trigger: cross 500MB DB or 1GB storage |

---

## Still on the user

These three blockers remain before Claude Code can complete the cycle:

### 🔴 Block 1: Real PDF statement for parser testing

**What's needed:** 1 redacted credit card statement PDF (HDFC / SBI / ICICI / Axis — any bank).

**Why it must come from the user:**
I cannot generate or fabricate a realistic bank statement. Real PDFs have layout quirks, OCR challenges, and transaction format variations that synthesized fixtures don't capture. A fake PDF would break the parser the moment it sees real input.

**How to prepare:**
1. Take any one credit card statement from any month
2. Redact in any PDF tool (Adobe Acrobat, free PDF editors, or even basic black-box overlay):
   - Card number (keep last 4 visible — needed for the parser to test BIN/last-4 detection)
   - Full name (optional; the parser doesn't need it)
   - Address
   - Phone number
   - Email
3. **Keep intact:**
   - Statement date, due date, billing cycle
   - Total amount due, minimum due
   - Every transaction row (date, merchant, amount)
   - Reward summary section
   - Fee charges section
4. Save as `test-fixtures/statement-sample.pdf` in repo

**Stretch:** Provide 2-3 statements from different banks (HDFC + SBI + ICICI). The parser will need to handle all major bank formats eventually; having 3 fixtures up front accelerates Phase 2/3 of the Analyzer roadmap.

### 🔴 Block 2: `.env.local` keys

Add to `.env.local` (Claude Code has scaffolded the variables; just needs values):

```bash
# Email transactional (for due reminders + alerts)
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Inngest (for cron jobs — chosen scheduler per C2)
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Cron endpoint protection
CRON_SECRET=<generate-random-32-char-string>

# Existing keys — confirm funded
GROQ_API_KEY=
FIRECRAWL_API_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**How to get the new ones:**

- **Resend**: Sign up at https://resend.com. Free tier allows 100 emails/day, 3,000/month — sufficient for early-stage due reminders. Verify a sending domain (DNS records on your domain provider). Generate API key in dashboard → API Keys.

- **Inngest**: Sign up at https://inngest.com. Create an app named "credstack". Free tier allows 50,000 function steps/month — more than enough for your cron schedule. Get keys from Settings → Environment.

- **CRON_SECRET**: Generate any random 32+ character string. This protects the `/api/cron/due-reminders` endpoint from being triggered by anyone with the URL. Use `openssl rand -hex 32` or any password generator.

### 🟡 Block 3: Vercel deployment access (only when ready to deploy)

Not urgent — only needed when you're ready to push beyond preview deployments. Per Decision C3, deployment is deferred until Phase 1 ship gate is met.

**When ready:**

1. Create Vercel account at https://vercel.com if not done
2. Connect GitHub: import `Saikamalsuro/CredStack` repo
3. Add environment variables in Vercel dashboard → Project Settings → Environment Variables (mirror your `.env.local` values)
4. Configure custom domain (per C4 — provide domain name)
5. Deploy

Claude Code can guide through this process once you're ready.

---

## What Claude Code can do next (in order)

**Immediate (no waiting required):**

1. Run `npx tsx scripts/seed-non-credit-cards.ts` to seed 26 verified non-credit cards
2. Run `npx tsx scripts/seed-expert-reviews.ts` to seed 5 expert reviews
3. Verify both seeds populated correctly in Supabase
4. Update `/banks` UI to display non-credit cards alongside credit cards
5. Update `/cards/[id]` to display expert reviews if present for that card
6. Update sidebar nav if banks/cards routes need rejigging

**After Block 2 (env keys):**

7. Wire up Resend email send in `/api/cron/due-reminders` endpoint
8. Register Inngest functions in `lib/jobs/` per ROADMAP.md and SCRAPING.md
9. Test due-date reminder flow end-to-end with a test user

**After Block 1 (PDF):**

10. Run statement parser against the provided PDF
11. Fix per-bank format issues that surface
12. Add the PDF as a permanent fixture in `__tests__/fixtures/statements/` for regression testing
13. Document the parser's confidence for that bank's format

**After Block 3 (Vercel access):**

14. Deploy to Vercel Preview
15. Test all routes in preview environment
16. Configure custom domain
17. Promote to Production

---

## Quality gates before merge

For both seed files:

- [ ] Seed script runs without error
- [ ] Row counts match expectations (26 non-credit verified; 5 expert reviews)
- [ ] All RLS policies enforced (test as anon user; should only see public data)
- [ ] No `verificationStatus: "pending"` cards visible in production UI without admin toggle
- [ ] Expert reviews render correctly on card detail page
- [ ] Non-credit cards display in `/banks/[issuer]` with correct grouping

---

## Notes for future expansion

**Non-credit cards file:**
- Long-tail debit cards (cooperative banks, PSB Multicurrency variants, regional small finance bank debit) not included — these have low search volume and high data uncertainty. Add via admin UI on demand.
- Wise card has limited India availability; reconfirm if marketing this card publicly.
- BNPL products (Paytm Postpaid, BharatPe PostPe) subject to evolving RBI regulations — terms may shift quarterly.

**Expert reviews file:**
- Top 30 cards should eventually have expert reviews — current 5 covers the highest-search-volume tier
- Multi-perspective reviews per card planned (e.g., HDFC Infinia for student traveller vs. business traveller) in Phase 4
- Reviews refresh annually or when card terms change materially (use `card_changes` table to trigger admin review)

---

**Status:** Two of four blocked items now unblocked. Two remain on user. Ping when PDF and env vars are in repo.
