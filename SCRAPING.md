# CredStack — Offers & Scraping Module

> **This is a module-level spec. It complements the main `README.md` and Phase 2/3 work described there.** Read the main README first to understand the platform architecture (Next.js 16, Supabase, Groq, Firecrawl, Inngest, Upstash Redis). This document zooms into one subsystem: **how CredStack ingests, stores, matches, and displays bank offers across cards and merchants**.
>
> Audience: Claude Code (autonomous coder) and any human contributor implementing the offers pipeline.
>
> Last updated: May 2026.

---

## Table of contents

1. [Goals & non-goals](#1-goals--non-goals)
2. [Hard rules](#2-hard-rules)
3. [System architecture](#3-system-architecture)
4. [Folder structure](#4-folder-structure)
5. [Database schema](#5-database-schema)
6. [Source registry](#6-source-registry)
7. [Firecrawl client wrapper](#7-firecrawl-client-wrapper)
8. [Parser interface](#8-parser-interface)
9. [Cache layer (Upstash Redis)](#9-cache-layer-upstash-redis)
10. [Inngest jobs (scheduling)](#10-inngest-jobs-scheduling)
11. [Card–offer matching engine](#11-cardoffer-matching-engine)
12. [Category taxonomy](#12-category-taxonomy)
13. [Deduplication & expiry](#13-deduplication--expiry)
14. [API routes](#14-api-routes)
15. [UI integration](#15-ui-integration)
16. [Cost monitoring](#16-cost-monitoring)
17. [Manual curation (admin)](#17-manual-curation-admin)
18. [Testing](#18-testing)
19. [Rollout plan](#19-rollout-plan)
20. [Appendices](#20-appendices)

---

## 1. Goals & non-goals

### What this module does

- Scrapes ~12-15 sources (DesiDime + bank offer hubs) on a tiered cron schedule
- Parses each source's HTML/markdown into a normalized `Offer` record
- Maps every offer to **specific card IDs** (so the Cards page can show "Active offers" per card)
- Maps every offer to **merchant + category** (so the Merchants page can show "Best card for Amazon")
- Stays inside the **Firecrawl free tier (500 credits/month)** through aggressive caching
- Surfaces offers in three places in the UI: card detail page, merchant search results, and the Advisor flow

### What this module does NOT do

- It does NOT scrape personalized/logged-in offers (Amex Offers, SmartBuy targeted, iShop boosts). Those need a Chrome extension or user-uploaded statement parsing — out of scope for v1.
- It does NOT handle fraud-detection, click-tracking, or affiliate revenue. These are separate concerns.
- It does NOT replace the **static** card reward structure (which lives in `cards-original-verified.ts` and `cards-additional.ts`). Static rewards = baseline; offers = time-bound on top.
- It does NOT scrape merchant pages proactively (only on user-triggered demand, with caching). See [Tier 4 in main README](./README.md#scraping-strategy).

---

## 2. Hard rules

These must hold at all times. Claude Code: do not violate.

1. **Never store auth cookies, tokens, or session data from any source.** Public pages only.
2. **Never scrape without honoring `robots.txt`.** Use Firecrawl's `respectRobots: true` (default).
3. **Never auto-promote scraped data to "verified" status.** All scraped offers default to `manually_verified = false` and `confidence_score < 1.0`. Only an admin action upgrades them.
4. **Never display an offer without a "verified at" timestamp.** Users must see how fresh the data is.
5. **Never display an expired offer.** Filter `WHERE ends_at > now() OR ends_at IS NULL` everywhere.
6. **All money in integer rupees** (`value_flat`, `max_value`, `min_txn`). Match the convention from the main README. No floats for currency.
7. **Per-source rate limits are hard caps.** If a source returns 429 or 5xx, back off and skip the run. Don't retry inside the same window.
8. **Cache before scrape.** Every scrape call goes through `cachedFirecrawl()` first. If you bypass cache, you're burning credits.
9. **Log every Firecrawl call** to `scrape_runs` with the credit cost. Don't lose visibility into spend.
10. **Never expose admin curation routes** to non-admin users. Use `lib/auth/requireAdmin.ts` (already in main README scaffolding).
11. **Never modify** the existing `cards-original-verified.ts` or `cards-additional.ts` files from this module. Static card data is read-only here.
12. **Card-offer matches need confidence scoring.** Don't claim "HDFC Infinia gets this offer" if the source said "HDFC credit cards get this offer" — that's a network/issuer match, score = 0.7, not a card match.

---

## 3. System architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       Inngest (scheduler)                        │
│   crons: tier1 quarterly · tier2 weekly · tier3 twice/week      │
└──────────────────┬──────────────────────────────────────────────┘
                   │ trigger
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│              lib/scraping/orchestrator.ts                        │
│  • selects sources due for run                                   │
│  • checks cache → if hit, skip Firecrawl                         │
│  • else calls Firecrawl, parses, persists                        │
└──────┬───────────────────┬────────────────────────────┬─────────┘
       │                   │                            │
       ▼                   ▼                            ▼
┌──────────────┐  ┌──────────────────┐  ┌────────────────────────┐
│   Firecrawl  │  │    Parsers       │  │   Card matcher         │
│  (markdown   │→ │  (one per source)│→ │   (by issuer/network/  │
│   only)      │  │  → RawOffer[]    │  │    BIN/explicit name)  │
└──────────────┘  └──────────────────┘  └──────────┬─────────────┘
                                                   │
                                                   ▼
                                  ┌────────────────────────────┐
                                  │  Supabase: offers,         │
                                  │  card_offers,              │
                                  │  scrape_runs               │
                                  └────────┬───────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────┐
│         Next.js API routes  (read-only for users)                │
│  GET /api/offers?card_id=...                                     │
│  GET /api/offers/by-merchant?merchant_slug=...                   │
│  GET /api/offers/categories                                      │
└──────────┬────────────────────────────────────┬─────────────────┘
           │                                    │
           ▼                                    ▼
┌──────────────────────┐              ┌──────────────────────┐
│ Card detail page     │              │  Merchant search /   │
│  /cards/[id]         │              │  /advisor flow       │
│  → "Active offers"   │              │  → "Best card for X" │
└──────────────────────┘              └──────────────────────┘
```

Every layer has explicit caching:

| Layer | Cache | TTL | Purpose |
|---|---|---|---|
| Firecrawl response | Upstash Redis | 24-72h per source | Avoid duplicate burns |
| Parsed `RawOffer[]` | Upstash Redis | same as Firecrawl | Skip re-parsing |
| Card-offer match results | Postgres `card_offers` | until offer expires | Cheap reads |
| API responses | Vercel CDN | 5 min (`stale-while-revalidate`) | Reduce DB load |

---

## 4. Folder structure

Add these to the main project (do not modify existing folders unless noted):

```
credstack/
├── app/
│   ├── api/
│   │   └── offers/
│   │       ├── route.ts                      # GET /api/offers
│   │       ├── by-merchant/route.ts          # GET /api/offers/by-merchant
│   │       └── categories/route.ts           # GET /api/offers/categories
│   ├── admin/
│   │   └── offers/
│   │       ├── page.tsx                      # Admin curation UI
│   │       └── [id]/edit/page.tsx
│   └── cards/[id]/
│       └── components/
│           └── ActiveOffers.tsx              # NEW: shown on card detail page
│
├── lib/
│   ├── scraping/
│   │   ├── orchestrator.ts                   # Top-level dispatcher
│   │   ├── firecrawl.ts                      # Cached Firecrawl wrapper
│   │   ├── parsers/
│   │   │   ├── _base.ts                      # Abstract Parser class
│   │   │   ├── desidime.ts
│   │   │   ├── hdfc-hub.ts
│   │   │   ├── sbi-hub.ts
│   │   │   ├── axis-hub.ts
│   │   │   ├── icici-hub.ts
│   │   │   ├── amex-hub.ts
│   │   │   ├── idfc-hub.ts
│   │   │   ├── indusind-hub.ts
│   │   │   ├── au-hub.ts
│   │   │   ├── hsbc-hub.ts
│   │   │   ├── yes-hub.ts
│   │   │   └── merchant-amazon.ts            # On-demand only
│   │   ├── matchers/
│   │   │   ├── card-matcher.ts               # offer → card[]
│   │   │   ├── merchant-matcher.ts           # offer → merchant
│   │   │   └── category-matcher.ts           # merchant → category
│   │   ├── normalize.ts                      # value/text normalization
│   │   ├── dedupe.ts                         # offer dedup logic
│   │   └── sources.ts                        # source registry (single source of truth)
│   │
│   ├── jobs/
│   │   ├── scrape-tier1.ts                   # Inngest fn: quarterly card refresh
│   │   ├── scrape-tier2.ts                   # Inngest fn: weekly bank hubs
│   │   ├── scrape-tier3.ts                   # Inngest fn: twice/week DesiDime
│   │   ├── expire-offers.ts                  # daily: mark expired
│   │   └── audit-credits.ts                  # daily: alert if Firecrawl burn rate > budget
│   │
│   ├── cache/
│   │   └── offers-cache.ts                   # Redis helpers for offers
│   │
│   └── types/
│       └── offers.ts                         # all offer-related types
│
├── supabase/
│   └── migrations/
│       └── 20260510000000_offers_module.sql  # all schema in one migration
│
├── scripts/
│   ├── seed-merchants.ts                     # initial merchant catalog
│   ├── seed-sources.ts                       # initial source registry
│   └── backfill-offers.ts                    # one-shot historical backfill
│
└── SCRAPING.md                               # this file
```

---

## 5. Database schema

All in one migration: `supabase/migrations/20260510000000_offers_module.sql`.

> **Note:** the main README already defines `offers` and `scrape_runs` tables in skeleton form. This migration **drops and recreates** them with the full structure. If you've already deployed an earlier `offers` table, write a proper alter-migration instead.

### 5.1 Enums

```sql
CREATE TYPE offer_type AS ENUM (
  'cashback',           -- flat % or amount returned
  'instant_discount',   -- price reduction at checkout
  'reward_multiplier',  -- 5X / 10X reward points
  'voucher',            -- gift voucher / coupon
  'bogo',               -- buy-one-get-one
  'no_cost_emi',        -- 0% interest EMI
  'milestone',          -- spend Rs. X get Rs. Y
  'welcome',            -- new-card joining benefit
  'lounge_access',      -- complimentary lounge benefit
  'other'
);

CREATE TYPE offer_category AS ENUM (
  'food_delivery',      -- Swiggy, Zomato, etc
  'dining',             -- restaurants, EazyDiner
  'grocery',            -- BigBasket, Blinkit, Zepto, DMart
  'ecommerce_general',  -- Amazon, Flipkart
  'fashion',            -- Myntra, Ajio, Tata CLiQ
  'electronics',        -- Croma, Reliance Digital
  'travel_flight',      -- MMT, Cleartrip, EaseMyTrip, IRCTC
  'travel_hotel',       -- MMT, Booking.com, Taj, Marriott
  'travel_cab',         -- Uber, Ola, Rapido
  'fuel',               -- HPCL, BPCL, IOCL
  'utility',            -- electricity, water, gas, telecom
  'entertainment',      -- BookMyShow, PVR, District
  'health_wellness',    -- 1mg, Cult.fit, Pharmeasy
  'education',          -- fees, courses
  'insurance',
  'lifestyle',          -- spa, salon, etc
  'other'
);

CREATE TYPE source_type AS ENUM (
  'bank_hub',           -- official bank offer page
  'aggregator',         -- DesiDime etc
  'merchant',           -- on-demand merchant scrape
  'manual'              -- admin entered
);

CREATE TYPE confidence_band AS ENUM (
  'verified',           -- admin-confirmed, score 1.0
  'high',               -- explicit card name in source, score >= 0.85
  'medium',             -- network/issuer match, score 0.65-0.85
  'low'                 -- ambiguous, score < 0.65
);
```

### 5.2 `merchants`

```sql
CREATE TABLE merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,         -- 'amazon-in', 'swiggy', 'mmt'
  name text NOT NULL,                -- 'Amazon India'
  category offer_category NOT NULL,
  logo_url text,                     -- public Supabase storage URL
  primary_domain text,               -- 'amazon.in'
  aliases text[] DEFAULT '{}',       -- ['amazon', 'amazon.com', 'AMZN']
  popular boolean DEFAULT false,     -- for "Top merchants" section
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_merchants_slug ON merchants(slug);
CREATE INDEX idx_merchants_category ON merchants(category);
CREATE INDEX idx_merchants_popular ON merchants(popular) WHERE popular = true;
```

### 5.3 `scrape_sources`

```sql
CREATE TABLE scrape_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,         -- 'desidime-cc', 'hdfc-hub'
  name text NOT NULL,
  url text NOT NULL,
  source_type source_type NOT NULL,
  parser_module text NOT NULL,       -- matches a file in lib/scraping/parsers/
  cron_schedule text NOT NULL,       -- cron syntax: '0 6 * * MON'
  cache_ttl_seconds int NOT NULL DEFAULT 86400,  -- 24h default
  firecrawl_options jsonb DEFAULT '{}'::jsonb,   -- onlyMainContent, waitFor, etc
  enabled boolean DEFAULT true,
  last_run_at timestamptz,
  last_success_at timestamptz,
  next_run_at timestamptz,
  consecutive_failures int DEFAULT 0,
  notes text,                        -- admin-only context
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_sources_enabled ON scrape_sources(enabled, next_run_at);
```

### 5.4 `offers` (replaces stub from main README)

```sql
CREATE TABLE offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source
  source_id uuid REFERENCES scrape_sources(id) ON DELETE SET NULL,
  external_id text,                  -- ID from the source if available
  source_url text NOT NULL,          -- canonical URL we scraped

  -- What & where
  title text NOT NULL,
  description text,
  offer_type offer_type NOT NULL,
  category offer_category NOT NULL,
  merchant_id uuid REFERENCES merchants(id) ON DELETE SET NULL,
  merchant_name text,                -- denormalized for fast filter

  -- Value (all rupees-integer or percent-numeric)
  value_pct numeric(5,2),            -- e.g., 10.00 for 10%
  value_flat int,                    -- e.g., 1000 for ₹1,000
  max_value int,                     -- cap on offer value
  min_txn int,                       -- min eligible txn

  -- Eligibility
  -- Cards explicitly named in offer (highest confidence):
  eligible_card_ids uuid[] DEFAULT '{}',
  -- Networks if offer says "Visa cards" / "Mastercard": :
  eligible_card_networks text[] DEFAULT '{}',
  -- Issuers if "HDFC credit cards": :
  eligible_issuers text[] DEFAULT '{}',
  -- BIN ranges (rare but most precise):
  bin_prefixes text[] DEFAULT '{}',
  -- Excludes:
  excluded_card_ids uuid[] DEFAULT '{}',

  -- Time bounds
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean DEFAULT true,

  -- Quality / provenance
  confidence_score numeric(3,2) NOT NULL DEFAULT 0.50,  -- 0.00 to 1.00
  confidence_band confidence_band NOT NULL DEFAULT 'medium',
  manually_verified boolean DEFAULT false,
  raw_data jsonb,                    -- whole parsed object for debugging
  scraped_at timestamptz NOT NULL DEFAULT now(),

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_offers_active ON offers(is_active, ends_at)
  WHERE is_active = true;
CREATE INDEX idx_offers_category ON offers(category, ends_at)
  WHERE is_active = true;
CREATE INDEX idx_offers_merchant ON offers(merchant_id, ends_at)
  WHERE is_active = true;
CREATE INDEX idx_offers_card_ids ON offers USING GIN (eligible_card_ids);
CREATE INDEX idx_offers_issuers ON offers USING GIN (eligible_issuers);
CREATE INDEX idx_offers_external ON offers(source_id, external_id)
  WHERE external_id IS NOT NULL;

-- Trigger: auto-update updated_at
CREATE TRIGGER trg_offers_updated
  BEFORE UPDATE ON offers FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 5.5 `card_offers` (materialized join — fast reads)

This is the read-optimized join. The matcher writes to it; UI reads from it.

```sql
CREATE TABLE card_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  offer_id uuid NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  match_reason text NOT NULL,        -- 'explicit_card_id' | 'issuer_match' | etc
  match_confidence numeric(3,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (card_id, offer_id)
);

CREATE INDEX idx_card_offers_card ON card_offers(card_id);
CREATE INDEX idx_card_offers_offer ON card_offers(offer_id);
```

### 5.6 `scrape_runs` (full structure — replaces stub from main README)

```sql
CREATE TABLE scrape_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES scrape_sources(id) ON DELETE CASCADE,
  triggered_by text NOT NULL,        -- 'cron' | 'manual' | 'on_demand'
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL,              -- 'running' | 'success' | 'failed' | 'cache_hit' | 'rate_limited'
  cache_hit boolean DEFAULT false,
  firecrawl_credits int DEFAULT 0,   -- 0 if cache hit
  http_status int,
  offers_found int DEFAULT 0,
  offers_new int DEFAULT 0,
  offers_updated int DEFAULT 0,
  offers_expired int DEFAULT 0,
  error text,
  raw_response_size_bytes int,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX idx_runs_source_started ON scrape_runs(source_id, started_at DESC);
CREATE INDEX idx_runs_status ON scrape_runs(status, started_at DESC);
```

### 5.7 RLS policies

```sql
-- merchants: public read, admin write
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "merchants public read" ON merchants FOR SELECT USING (true);
CREATE POLICY "merchants admin write" ON merchants FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- scrape_sources: admin only
ALTER TABLE scrape_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sources admin only" ON scrape_sources FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- offers: public read of active+verified, admin write
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "offers public read active" ON offers FOR SELECT
  USING (is_active = true AND (ends_at IS NULL OR ends_at > now()));
CREATE POLICY "offers admin write" ON offers FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- card_offers: public read (only joined to active offers), admin write
ALTER TABLE card_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "card_offers public read" ON card_offers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM offers o
    WHERE o.id = card_offers.offer_id
      AND o.is_active = true
      AND (o.ends_at IS NULL OR o.ends_at > now())
  ));
CREATE POLICY "card_offers admin write" ON card_offers FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- scrape_runs: admin only
ALTER TABLE scrape_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "runs admin only" ON scrape_runs FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 6. Source registry

The list of all scraping sources is the **single source of truth in `lib/scraping/sources.ts`**. The `scripts/seed-sources.ts` reads this and writes to `scrape_sources`. Don't duplicate this list anywhere else.

```ts
// lib/scraping/sources.ts
import type { SourceDefinition } from "@/lib/types/offers"

export const SOURCES: SourceDefinition[] = [
  // ─── Tier 2: Bank hubs (weekly) ─────────────────────────────────
  {
    slug: "hdfc-hub",
    name: "HDFC Bank Offers",
    url: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/offers",
    sourceType: "bank_hub",
    parserModule: "hdfc-hub",
    cronSchedule: "0 6 * * MON",      // Mondays 6 AM IST
    cacheTtlSeconds: 7 * 86400,       // 7 days
    firecrawlOptions: {
      onlyMainContent: true,
      waitFor: 2000,                  // JS bank-offer widget
      formats: ["markdown"]
    }
  },
  {
    slug: "sbi-hub",
    name: "SBI Card Offers",
    url: "https://www.sbicard.com/en/personal/offers.page",
    sourceType: "bank_hub",
    parserModule: "sbi-hub",
    cronSchedule: "0 7 * * MON",
    cacheTtlSeconds: 7 * 86400,
    firecrawlOptions: { onlyMainContent: true, formats: ["markdown"] }
  },
  {
    slug: "axis-hub",
    name: "Axis Bank Offers Corner",
    url: "https://www.axisbank.com/cards/credit-card/offers-corner",
    sourceType: "bank_hub",
    parserModule: "axis-hub",
    cronSchedule: "0 8 * * MON",
    cacheTtlSeconds: 7 * 86400,
    firecrawlOptions: { onlyMainContent: true, waitFor: 2000, formats: ["markdown"] }
  },
  {
    slug: "icici-hub",
    name: "ICICI Bank Card Offers",
    url: "https://www.icicibank.com/personal-banking/cards/credit-card/offer",
    sourceType: "bank_hub",
    parserModule: "icici-hub",
    cronSchedule: "0 9 * * MON",
    cacheTtlSeconds: 7 * 86400,
    firecrawlOptions: { onlyMainContent: true, formats: ["markdown"] }
  },
  {
    slug: "amex-hub",
    name: "Amex India Offers",
    url: "https://www.americanexpress.com/in/benefits/offers/",
    sourceType: "bank_hub",
    parserModule: "amex-hub",
    cronSchedule: "0 10 * * MON",
    cacheTtlSeconds: 7 * 86400,
    firecrawlOptions: { onlyMainContent: true, waitFor: 3000, formats: ["markdown"] }
  },
  {
    slug: "idfc-hub",
    name: "IDFC FIRST Bank Offers",
    url: "https://www.idfcfirstbank.com/credit-card/offers",
    sourceType: "bank_hub",
    parserModule: "idfc-hub",
    cronSchedule: "0 11 * * MON",
    cacheTtlSeconds: 7 * 86400,
    firecrawlOptions: { onlyMainContent: true, formats: ["markdown"] }
  },
  {
    slug: "indusind-hub",
    name: "IndusInd Bank Offers",
    url: "https://www.indusind.com/in/en/personal/cards/credit-card/offers.html",
    sourceType: "bank_hub",
    parserModule: "indusind-hub",
    cronSchedule: "0 12 * * MON",
    cacheTtlSeconds: 7 * 86400,
    firecrawlOptions: { onlyMainContent: true, formats: ["markdown"] }
  },
  {
    slug: "au-hub",
    name: "AU Small Finance Bank Offers",
    url: "https://www.aubank.in/personal-banking/credit-cards/offers",
    sourceType: "bank_hub",
    parserModule: "au-hub",
    cronSchedule: "0 13 * * MON",
    cacheTtlSeconds: 7 * 86400,
    firecrawlOptions: { onlyMainContent: true, formats: ["markdown"] }
  },
  {
    slug: "hsbc-hub",
    name: "HSBC India Offers",
    url: "https://www.hsbc.co.in/credit-cards/offers/",
    sourceType: "bank_hub",
    parserModule: "hsbc-hub",
    cronSchedule: "0 14 * * MON",
    cacheTtlSeconds: 7 * 86400,
    firecrawlOptions: { onlyMainContent: true, formats: ["markdown"] }
  },
  {
    slug: "yes-hub",
    name: "YES Bank Credit Card Offers",
    url: "https://www.yesbank.in/credit-cards/offers",
    sourceType: "bank_hub",
    parserModule: "yes-hub",
    cronSchedule: "0 15 * * MON",
    cacheTtlSeconds: 7 * 86400,
    firecrawlOptions: { onlyMainContent: true, formats: ["markdown"] }
  },

  // ─── Tier 3: Aggregator (twice/week) ────────────────────────────
  {
    slug: "desidime-cc",
    name: "DesiDime Credit Cards",
    url: "https://www.desidime.com/credit-cards",
    sourceType: "aggregator",
    parserModule: "desidime",
    cronSchedule: "0 5 * * TUE,FRI", // Tue & Fri 5 AM IST
    cacheTtlSeconds: 3 * 86400,      // 3 days
    firecrawlOptions: {
      onlyMainContent: true,
      formats: ["markdown"],
      includeTags: ["article", "section", ".deal-card"]
    }
  }

  // ─── Tier 4: Merchant pages ─────────────────────────────────────
  // These are NOT in the cron registry. They're scraped on-demand
  // via /api/offers/by-merchant?merchant_slug=amazon&fresh=true.
  // Add a stub if you want admin-controlled fallback runs.
]
```

Schedule rationale:
- All bank hubs run on Mondays staggered by hour (avoids hitting all 10 banks at minute 0)
- DesiDime runs Tue/Fri to catch mid-week deal additions
- Total scheduled scrapes: 11 sources × 4-5 runs/month = **~50 cron-driven Firecrawl calls/month**
- On-demand merchant scrapes add another **~50/month** at expected user volume

---

## 7. Firecrawl client wrapper

Single canonical entry point. **No code outside this file calls the Firecrawl SDK directly.**

```ts
// lib/scraping/firecrawl.ts
import { FirecrawlApp } from "@mendable/firecrawl-js"
import { redis } from "@/lib/cache/upstash"
import { logScrapeRun } from "./orchestrator"
import type { ScrapeOptions, ScrapeResult } from "@/lib/types/offers"

const fc = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! })

export async function cachedFirecrawl(opts: {
  sourceId: string
  url: string
  cacheTtlSeconds: number
  firecrawlOptions?: ScrapeOptions
  triggeredBy: "cron" | "manual" | "on_demand"
}): Promise<ScrapeResult> {
  const cacheKey = `fc:${hashUrl(opts.url)}`

  // 1. Cache hit → return without burning credit
  const cached = await redis.get<ScrapeResult>(cacheKey)
  if (cached) {
    await logScrapeRun({
      sourceId: opts.sourceId,
      status: "cache_hit",
      cacheHit: true,
      firecrawlCredits: 0,
      triggeredBy: opts.triggeredBy
    })
    return cached
  }

  // 2. Real call — track the spend
  const start = Date.now()
  try {
    const result = await fc.scrapeUrl(opts.url, {
      formats: ["markdown"],
      onlyMainContent: true,
      waitFor: 1000,
      ...opts.firecrawlOptions
    })

    if (!result.success) throw new Error(result.error || "Firecrawl failed")

    const scrapeResult: ScrapeResult = {
      url: opts.url,
      markdown: result.markdown ?? "",
      metadata: result.metadata ?? {},
      scrapedAt: new Date().toISOString()
    }

    // 3. Cache for next call
    await redis.setex(cacheKey, opts.cacheTtlSeconds, scrapeResult)

    await logScrapeRun({
      sourceId: opts.sourceId,
      status: "success",
      cacheHit: false,
      firecrawlCredits: 1,
      httpStatus: 200,
      rawResponseSizeBytes: scrapeResult.markdown.length,
      durationMs: Date.now() - start,
      triggeredBy: opts.triggeredBy
    })

    return scrapeResult
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    await logScrapeRun({
      sourceId: opts.sourceId,
      status: "failed",
      cacheHit: false,
      firecrawlCredits: 0,
      error: err,
      durationMs: Date.now() - start,
      triggeredBy: opts.triggeredBy
    })
    throw e
  }
}

function hashUrl(url: string): string {
  // simple deterministic hash; replace with crypto.subtle.digest if needed
  let h = 0
  for (let i = 0; i < url.length; i++) {
    h = ((h << 5) - h) + url.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h).toString(36)
}
```

Notes:
- Default `formats: ["markdown"]` — never accept HTML/screenshots unless overridden. Markdown is cheapest.
- Default `onlyMainContent: true` — cuts ~60% of page weight.
- `waitFor: 1000-3000` for JS-heavy bank hubs (HDFC, ICICI, Axis especially).
- The Redis client is in `lib/cache/upstash.ts` (already scaffolded in main README).

---

## 8. Parser interface

Every parser implements this interface. Returns a list of `RawOffer`s — un-matched, un-deduped, raw-from-source.

```ts
// lib/scraping/parsers/_base.ts
import type { RawOffer, ScrapeResult } from "@/lib/types/offers"

export interface Parser {
  /** Unique slug. Must match parserModule in sources.ts. */
  slug: string

  /** Parse the markdown response into raw offers. */
  parse(input: ScrapeResult): RawOffer[]
}

// Helper for parsers — extract value/percent from text fragments
export function extractValue(text: string): { pct?: number; flat?: number; max?: number } {
  // "10% cashback up to ₹1,000" → { pct: 10, max: 1000 }
  // "Flat ₹500 off"             → { flat: 500 }
  // "Buy 1 Get 1 free"          → {} (caller sets type=bogo)
  const result: { pct?: number; flat?: number; max?: number } = {}

  const pctMatch = text.match(/(\d+(?:\.\d+)?)\s*%/)
  if (pctMatch) result.pct = parseFloat(pctMatch[1])

  const flatMatch = text.match(/(?:Rs\.|₹|INR)\s*([\d,]+)/i)
  if (flatMatch) {
    const num = parseInt(flatMatch[1].replace(/,/g, ""), 10)
    // If we already saw a %, this number is the cap
    if (result.pct) result.max = num
    else result.flat = num
  }
  return result
}

export function extractDates(text: string): { startsAt?: string; endsAt?: string } {
  // "Valid till 31 December 2026" → { endsAt: '2026-12-31T23:59:59.999Z' }
  // "Offer period: 1 May 2026 to 31 May 2026" → both
  // ISO strings, IST timezone applied at write
  // ... implementation: use chrono-node library for natural language dates
  return {}
}
```

A reference parser:

```ts
// lib/scraping/parsers/desidime.ts
import { Parser, extractValue, extractDates } from "./_base"
import type { RawOffer, ScrapeResult } from "@/lib/types/offers"

export const desidimeParser: Parser = {
  slug: "desidime",
  parse(input: ScrapeResult): RawOffer[] {
    const md = input.markdown
    const blocks = splitDealBlocks(md)
    const offers: RawOffer[] = []

    for (const block of blocks) {
      const title = extractTitle(block)
      const description = extractBody(block)
      const merchantHint = extractMerchant(block)
      const cardHint = extractCardMention(block)
      const value = extractValue(block)
      const dates = extractDates(block)

      offers.push({
        sourceUrl: input.url,
        externalId: extractDealId(block),
        title: title ?? "Untitled offer",
        description,
        offerType: inferOfferType(block),
        merchantNameHint: merchantHint,
        cardMentionRaw: cardHint,
        valuePct: value.pct,
        valueFlat: value.flat,
        maxValue: value.max,
        startsAt: dates.startsAt,
        endsAt: dates.endsAt,
        rawSnippet: block.slice(0, 500),
        scrapedAt: input.scrapedAt
      })
    }
    return offers
  }
}

// Helpers (each ~10-20 lines):
function splitDealBlocks(md: string): string[] { /* ... */ return [] }
function extractTitle(block: string): string | undefined { /* ... */ return undefined }
function extractBody(block: string): string { /* ... */ return "" }
function extractMerchant(block: string): string | undefined { /* ... */ return undefined }
function extractCardMention(block: string): string | undefined { /* ... */ return undefined }
function extractDealId(block: string): string | undefined { /* ... */ return undefined }
function inferOfferType(block: string): RawOffer["offerType"] { /* ... */ return "cashback" }
```

**Implementation note:** start with DesiDime, HDFC, SBI, and Axis parsers in Phase 2A. The other 7 hubs come in Phase 2B. Don't try to write all 11 parsers up front — they degrade and need maintenance, so prove the pipeline end-to-end on 4 sources first.

---

## 9. Cache layer (Upstash Redis)

Two key prefixes:

| Prefix | Purpose | TTL |
|---|---|---|
| `fc:<urlhash>` | Raw Firecrawl response per URL | per source's `cacheTtlSeconds` |
| `parsed:<sourceSlug>:<runDate>` | Parsed `RawOffer[]` keyed by date | 24h |
| `match:<offerId>` | Computed card matches for offer | 1h |
| `api:offers:<query>` | API response cache | 5 min |

Helpers:

```ts
// lib/cache/offers-cache.ts
import { redis } from "./upstash"
import type { Offer, RawOffer } from "@/lib/types/offers"

export const cacheKeys = {
  firecrawl: (urlHash: string) => `fc:${urlHash}`,
  parsed: (sourceSlug: string, dayKey: string) => `parsed:${sourceSlug}:${dayKey}`,
  match: (offerId: string) => `match:${offerId}`,
  api: (queryHash: string) => `api:offers:${queryHash}`
}

export async function invalidateOfferCache(offerId: string) {
  await redis.del(cacheKeys.match(offerId))
}

export async function purgeAllApiCache() {
  // Use Redis SCAN to delete by prefix
  // (Upstash supports keys with caveats — check docs)
}
```

Strategic invalidation:
- When admin manually verifies an offer → bust `match:<offerId>` and `api:offers:*` caches
- When a card is updated in `cards` → bust matches for any offer touching that card
- Daily expiry job (`expire-offers.ts`) sweeps and busts API caches

---

## 10. Inngest jobs (scheduling)

Three cron jobs + two utility jobs.

```ts
// lib/jobs/scrape-tier2.ts
import { inngest } from "@/lib/inngest/client"
import { runSource } from "@/lib/scraping/orchestrator"
import { supabaseAdmin } from "@/lib/db/admin"

export const scrapeTier2BankHubs = inngest.createFunction(
  { id: "scrape-tier2-bank-hubs" },
  { cron: "0 6 * * MON" },              // Trigger entry point only
  async ({ step }) => {
    const { data: sources } = await step.run("fetch-sources", () =>
      supabaseAdmin
        .from("scrape_sources")
        .select("*")
        .eq("source_type", "bank_hub")
        .eq("enabled", true)
        .order("cron_schedule")
    )

    if (!sources) return { ok: false }

    for (const source of sources) {
      // Each source as a separate step → idempotent retries
      await step.run(`scrape-${source.slug}`, () =>
        runSource(source.id, "cron")
      )
      await step.sleep("stagger", "5m")
    }
    return { ok: true, count: sources.length }
  }
)
```

```ts
// lib/jobs/scrape-tier3.ts — DesiDime twice/week
export const scrapeTier3Aggregator = inngest.createFunction(
  { id: "scrape-tier3-aggregator" },
  { cron: "0 5 * * TUE,FRI" },
  async ({ step }) => {
    const { data: sources } = await step.run("fetch-sources", () =>
      supabaseAdmin
        .from("scrape_sources")
        .select("*")
        .eq("source_type", "aggregator")
        .eq("enabled", true)
    )
    for (const s of sources ?? []) {
      await step.run(`scrape-${s.slug}`, () => runSource(s.id, "cron"))
    }
    return { ok: true }
  }
)
```

```ts
// lib/jobs/scrape-tier1.ts — quarterly card refresh from PaisaBazaar
// (only re-scrapes when an admin triggers it OR every 90 days)
export const scrapeTier1CardFeatures = inngest.createFunction(
  { id: "scrape-tier1-card-features" },
  { cron: "0 4 1 1,4,7,10 *" },         // 4 AM, 1st of Jan/Apr/Jul/Oct
  async ({ step }) => {
    // Re-runs the verification of cards-original-verified.ts and
    // cards-additional.ts. Fires alerts to admin if drift detected.
    // Implementation: see scripts/verify-cards.ts
  }
)
```

```ts
// lib/jobs/expire-offers.ts — daily 2 AM IST
export const expireOffers = inngest.createFunction(
  { id: "expire-offers" },
  { cron: "0 2 * * *" },
  async () => {
    const { count } = await supabaseAdmin
      .from("offers")
      .update({ is_active: false })
      .lt("ends_at", new Date().toISOString())
      .eq("is_active", true)
      .select("id", { count: "exact", head: true })
    return { expired: count ?? 0 }
  }
)
```

```ts
// lib/jobs/audit-credits.ts — daily 6 AM IST
export const auditCredits = inngest.createFunction(
  { id: "audit-firecrawl-credits" },
  { cron: "0 6 * * *" },
  async ({ step }) => {
    // Sum Firecrawl credits used in the last 30 days
    const { data } = await supabaseAdmin
      .from("scrape_runs")
      .select("firecrawl_credits")
      .gte("started_at", new Date(Date.now() - 30 * 86400 * 1000).toISOString())

    const total = (data ?? []).reduce((s, r) => s + (r.firecrawl_credits ?? 0), 0)

    // Free tier = 500/month. Alert at 80% (400) and 95% (475).
    if (total > 475) {
      await step.run("alert-near-limit", () =>
        sendAdminAlert(`⚠️ Firecrawl burn at ${total}/500 — approaching limit`)
      )
    } else if (total > 400) {
      await step.run("alert-at-warn", () =>
        sendAdminAlert(`Firecrawl burn at ${total}/500 — 80% used`)
      )
    }
    return { total }
  }
)

async function sendAdminAlert(msg: string) { /* email via Resend/Postmark */ }
```

Register all five in `app/api/inngest/route.ts` (the bridge endpoint already scaffolded in the main README).

---

## 11. Card–offer matching engine

The core attribution logic. **Every `RawOffer` produces zero or more rows in `card_offers` with explicit confidence.** Never silently match ambiguous offers.

```ts
// lib/scraping/matchers/card-matcher.ts
import { supabaseAdmin } from "@/lib/db/admin"
import type { RawOffer, CardMatch } from "@/lib/types/offers"

export async function matchOfferToCards(
  offer: RawOffer & { id: string; eligibleCardIds: string[] }
): Promise<CardMatch[]> {
  const matches: CardMatch[] = []

  // Tier 1: explicit card mention (e.g., "HDFC Infinia cardholders")
  if (offer.cardMentionRaw) {
    const explicit = await matchByCardName(offer.cardMentionRaw)
    matches.push(...explicit.map(m => ({
      cardId: m.id,
      reason: "explicit_card_name",
      confidence: 0.95
    })))
  }

  // Tier 2: explicit eligibleCardIds (already-resolved by parser)
  for (const cardId of offer.eligibleCardIds) {
    if (!matches.find(m => m.cardId === cardId)) {
      matches.push({ cardId, reason: "explicit_card_id", confidence: 1.0 })
    }
  }

  // Tier 3: issuer-only match ("HDFC credit cards")
  if (offer.eligibleIssuers?.length) {
    const cards = await supabaseAdmin
      .from("cards")
      .select("id")
      .in("issuer", offer.eligibleIssuers)
    for (const c of cards.data ?? []) {
      if (!matches.find(m => m.cardId === c.id)) {
        matches.push({ cardId: c.id, reason: "issuer_match", confidence: 0.70 })
      }
    }
  }

  // Tier 4: network-only ("Visa cards")
  if (offer.eligibleCardNetworks?.length) {
    const cards = await supabaseAdmin
      .from("cards")
      .select("id")
      .in("network", offer.eligibleCardNetworks)
    for (const c of cards.data ?? []) {
      if (!matches.find(m => m.cardId === c.id)) {
        matches.push({ cardId: c.id, reason: "network_match", confidence: 0.50 })
      }
    }
  }

  // Tier 5: BIN prefix match (most precise but rare)
  // ...

  return matches
}

async function matchByCardName(raw: string): Promise<{ id: string; name: string }[]> {
  // Fuzzy match against cards.name and cards.aliases
  // "HDFC Infinia" → cards.name LIKE '%Infinia%'
  // Uses pg_trgm extension; install if not already (it's in main README)
  const { data } = await supabaseAdmin.rpc("fuzzy_match_card", { query: raw })
  return data ?? []
}
```

Add this Postgres function to the migration:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE OR REPLACE FUNCTION fuzzy_match_card(query text)
RETURNS TABLE (id uuid, name text, score real)
LANGUAGE sql STABLE AS $$
  SELECT id, name, similarity(name, query) AS score
  FROM cards
  WHERE similarity(name, query) > 0.4
  ORDER BY score DESC
  LIMIT 5
$$;

CREATE INDEX idx_cards_name_trgm ON cards USING GIN (name gin_trgm_ops);
```

Confidence-band rules (consistent across the platform):
- `>= 0.85` → `confidence_band = 'high'`
- `0.65–0.85` → `'medium'`
- `< 0.65` → `'low'` (hidden by default in UI; admin queue)
- Manually verified → always `'verified'`, score = 1.0

---

## 12. Category taxonomy

The merchant→category mapping is the link between offers and the card's reward structure (which the analyzer uses to compute "actual savings"). Both must agree.

```ts
// lib/scraping/matchers/category-matcher.ts
import type { OfferCategory } from "@/lib/types/offers"

const MERCHANT_CATEGORY_RULES: Record<string, OfferCategory> = {
  // food_delivery
  "swiggy": "food_delivery",
  "zomato": "food_delivery",
  // dining
  "eazydiner": "dining",
  "dineout": "dining",
  // grocery
  "bigbasket": "grocery",
  "blinkit": "grocery",
  "zepto": "grocery",
  "instamart": "grocery",
  "dmart": "grocery",
  "jiomart": "grocery",
  // ecommerce
  "amazon": "ecommerce_general",
  "flipkart": "ecommerce_general",
  "meesho": "ecommerce_general",
  // fashion
  "myntra": "fashion",
  "ajio": "fashion",
  "tatacliq": "fashion",
  "nykaa": "fashion",
  // electronics
  "croma": "electronics",
  "reliance digital": "electronics",
  "vijay sales": "electronics",
  // travel
  "makemytrip": "travel_flight",
  "mmt": "travel_flight",
  "cleartrip": "travel_flight",
  "easemytrip": "travel_flight",
  "yatra": "travel_flight",
  "irctc": "travel_flight",
  "booking.com": "travel_hotel",
  "agoda": "travel_hotel",
  "ihcl": "travel_hotel",
  "marriott": "travel_hotel",
  "uber": "travel_cab",
  "ola": "travel_cab",
  "rapido": "travel_cab",
  // fuel
  "hpcl": "fuel",
  "bpcl": "fuel",
  "iocl": "fuel",
  "indianoil": "fuel",
  // utility
  "airtel": "utility",
  "jio": "utility",
  "vodafone": "utility",
  // entertainment
  "bookmyshow": "entertainment",
  "pvr": "entertainment",
  "inox": "entertainment",
  "district": "entertainment",
  // health
  "cult.fit": "health_wellness",
  "1mg": "health_wellness",
  "pharmeasy": "health_wellness",
  "apollo": "health_wellness"
}

export function inferCategory(merchantName: string): OfferCategory {
  const lower = merchantName.toLowerCase().trim()
  for (const [key, cat] of Object.entries(MERCHANT_CATEGORY_RULES)) {
    if (lower.includes(key)) return cat
  }
  return "other"
}
```

This same map seeds the `merchants` table via `scripts/seed-merchants.ts`. When you add a new merchant, add it here first, then re-run the seed.

---

## 13. Deduplication & expiry

Three dedup signals, in order of priority:

```ts
// lib/scraping/dedupe.ts
export async function findDuplicateOffer(raw: RawOffer): Promise<string | null> {
  // 1. Same source + same external_id
  if (raw.externalId) {
    const { data } = await supabaseAdmin
      .from("offers")
      .select("id")
      .eq("source_id", raw.sourceId)
      .eq("external_id", raw.externalId)
      .maybeSingle()
    if (data) return data.id
  }

  // 2. Same merchant + same value + overlapping date range
  if (raw.merchantId && (raw.valuePct || raw.valueFlat)) {
    const { data } = await supabaseAdmin
      .from("offers")
      .select("id")
      .eq("merchant_id", raw.merchantId)
      .eq("value_pct", raw.valuePct ?? null)
      .eq("value_flat", raw.valueFlat ?? null)
      .eq("is_active", true)
      .maybeSingle()
    if (data) return data.id
  }

  // 3. Same title (fuzzy) within 7 days
  const { data } = await supabaseAdmin.rpc("fuzzy_match_offer", {
    query_title: raw.title,
    days_back: 7
  })
  if (data?.[0]) return data[0].id

  return null
}
```

When an offer matches an existing one:
- Update `scraped_at` (refresh timestamp)
- Update `confidence_score` if higher (but never lower automatically — drift to lower needs admin)
- Increment a `seen_count` field (optional — useful for "trending offers")
- **Don't** overwrite `manually_verified = true` records with scraped data

Expiry rules:
- `ends_at < now()` → daily job sets `is_active = false`
- No `ends_at` and `scraped_at < 30 days ago` → daily job sets `is_active = false` (assume stale)
- Admin manually setting `is_active = false` is final

---

## 14. API routes

All endpoints under `app/api/offers/`.

### `GET /api/offers`

List active offers, with filters.

Query params:
- `card_id` — only offers matched to this card
- `merchant_slug` — only offers for this merchant
- `category` — only offers in this category
- `min_confidence` — default `0.65` (medium and up)
- `limit` — default `20`, max `100`
- `offset` — pagination

Response:
```ts
{
  data: Array<{
    id: string
    title: string
    description: string
    merchant: { name: string; slug: string; category: OfferCategory }
    value: { type: OfferType; pct?: number; flat?: number; maxValue?: number }
    eligibleCards: Array<{ id: string; name: string; issuer: string }>
    endsAt: string | null
    scrapedAt: string
    confidence: ConfidenceBand
    sourceUrl: string
  }>
  count: number
  nextOffset: number | null
}
```

Cache: `Cache-Control: public, s-maxage=300, stale-while-revalidate=900`

### `GET /api/offers/by-merchant`

Optimized for "Best card for Amazon" queries. Includes a sort by reward value.

Query params:
- `merchant_slug` (required)
- `fresh` — if `true`, ignore cache and re-scrape merchant page (limited to 1/min/IP)

Response: same shape as `/api/offers`, sorted by `value_pct DESC, max_value DESC`.

### `GET /api/offers/categories`

Returns the taxonomy for the UI:
```ts
{
  categories: Array<{
    slug: OfferCategory
    label: string
    icon: string
    activeOfferCount: number
  }>
}
```

Cached for 1 hour.

---

## 15. UI integration

### 15.1 Card detail page

`app/cards/[id]/page.tsx` — add a new section:

```tsx
// app/cards/[id]/components/ActiveOffers.tsx
"use client"
import { useOffers } from "@/lib/hooks/useOffers"
import { OfferCard } from "@/components/offers/OfferCard"

export function ActiveOffers({ cardId }: { cardId: string }) {
  const { data, isLoading } = useOffers({ cardId, minConfidence: 0.65 })

  if (isLoading) return <SkeletonRow />
  if (!data?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No active merchant offers right now. Check back later.
      </p>
    )
  }

  return (
    <section>
      <h3 className="font-semibold mb-3">Active offers</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Offers below are scraped from public sources and may change without notice.
      </p>
      <div className="grid gap-3">
        {data.map(o => <OfferCard key={o.id} offer={o} />)}
      </div>
    </section>
  )
}
```

`OfferCard` component pattern (don't redesign the existing UI; match its language):
- Title (bold)
- Merchant name + category badge
- Value summary ("10% cashback up to ₹1,000")
- "Valid till X" or "Ongoing"
- Confidence badge (only show if `medium` or `low`)
- "View source" link

### 15.2 Merchants page (new)

`app/merchants/page.tsx` and `app/merchants/[slug]/page.tsx` — for the "Best card for Amazon" use case.

Layout:
- `/merchants` — grid of popular merchants by category
- `/merchants/[slug]` — list of cards ranked by current offer value, plus the merchant's bank-offer landing page link

### 15.3 Advisor flow

In the existing `/advisor` route, when the user describes their spending pattern, the recommendations should now consider active offers (not just baseline rewards).

The advisor pipeline becomes:
1. Compute baseline reward value per card (from static data)
2. Add active offer value per card per category (from `card_offers`)
3. Rank cards by total value at the user's spend pattern
4. Show breakdown: "Baseline X + Active offer Y = Total Z"

This is meaningful because it differentiates CredStack from competitors who only show static features.

### 15.4 Tone and disclaimers

Every UI surface that shows an offer must include:

> Offers shown are scraped from public sources, refresh weekly to bi-weekly, and may have ended. Always verify on the bank's website before making a purchase.

Place this once per page (footer of the offers list), not per offer card.

---

## 16. Cost monitoring

A small admin page surfaces the burn rate.

`app/admin/scraping/page.tsx`:
- Last 30 days credit usage chart (from `scrape_runs.firecrawl_credits`)
- Per-source success rate
- Failed run log with error messages
- Manual "trigger run" button per source (rate-limited to 1/hour)
- Cache hit rate visualization (cache_hit / total runs)

Hard ceilings:
- If burn > 95% of free tier, `audit-credits.ts` disables Tier 3 (DesiDime) automatically and emails admin
- If burn > 100%, all on-demand merchant scrapes are disabled (but cached responses still serve)

Recovery on the 1st of each month resets quotas.

---

## 17. Manual curation (admin)

Admin override paths (each gated by `requireAdmin()`):

`app/admin/offers/page.tsx`:
- Filter offers by `confidence_band = 'low'` to see the queue
- For each: edit title/value/dates/merchant/eligible_card_ids, then promote to `confidence_band = 'verified'`
- Bulk-deactivate stale offers

`app/admin/offers/new/page.tsx`:
- Manually create an offer (e.g., for personalized offers a user reported)
- Source = `manual`, confidence = 1.0

`app/admin/sources/page.tsx`:
- Toggle source `enabled`
- Edit cron schedule
- Adjust cache TTL
- Manual trigger run

---

## 18. Testing

Unit-test the parsers. Don't unit-test Firecrawl itself — too brittle.

```
__tests__/
├── parsers/
│   ├── desidime.test.ts            # fixture-based parsing
│   ├── hdfc-hub.test.ts
│   └── ...
├── matchers/
│   ├── card-matcher.test.ts        # mock supabase
│   └── category-matcher.test.ts
├── normalize.test.ts
└── dedupe.test.ts
```

Each parser test uses **fixture markdown** committed in `__tests__/fixtures/<source>/<date>.md`. To update fixtures: run `pnpm test:scrape:capture` which calls Firecrawl, saves the response to fixtures, and never burns more than 1 credit per source per capture.

```ts
// __tests__/parsers/desidime.test.ts
import { describe, it, expect } from "vitest"
import { desidimeParser } from "@/lib/scraping/parsers/desidime"
import fixture from "../fixtures/desidime/2026-05-01.md?raw"

describe("desidime parser", () => {
  it("extracts at least 5 offers from sample page", () => {
    const result = desidimeParser.parse({
      url: "https://www.desidime.com/credit-cards",
      markdown: fixture,
      metadata: {},
      scrapedAt: "2026-05-01T00:00:00.000Z"
    })
    expect(result.length).toBeGreaterThanOrEqual(5)
    expect(result[0]).toMatchObject({
      title: expect.any(String),
      offerType: expect.any(String)
    })
  })

  it("captures merchant hint when present", () => {
    const result = desidimeParser.parse({ /* ... */ } as any)
    const swiggyOffer = result.find(o => /swiggy/i.test(o.merchantNameHint ?? ""))
    expect(swiggyOffer).toBeDefined()
  })
})
```

Integration-test the orchestrator with a mocked Firecrawl that returns fixtures.

---

## 19. Rollout plan

Three phases. Don't try to ship all of this at once.

### Phase 2A — Foundation (Week 1, ~3 days)

- [ ] Run migration `20260510000000_offers_module.sql`
- [ ] Seed `merchants` from `category-matcher.ts` map
- [ ] Seed `scrape_sources` from `sources.ts`
- [ ] Implement `lib/scraping/firecrawl.ts` wrapper with caching
- [ ] Implement `lib/scraping/orchestrator.ts` skeleton
- [ ] Write **one** parser end-to-end: DesiDime
- [ ] Write **one** Inngest job: `scrape-tier3.ts`
- [ ] Verify offers appear in Supabase after first manual run
- [ ] No UI yet — verify data flow only

**Gate to ship:** at least 20 offers in `offers` table, all with `confidence_band` set, all with valid `merchant_id`.

### Phase 2B — Bank hubs + matching (Week 2, ~5 days)

- [ ] Parsers for HDFC, SBI, Axis, ICICI hubs (the four most-used issuers)
- [ ] Matcher: `card-matcher.ts` with all 5 tiers
- [ ] `scrape-tier2.ts` Inngest job
- [ ] Daily expiry job
- [ ] Daily credit-audit job
- [ ] Admin offers list page (read-only first)

**Gate to ship:** 200+ offers, 4 sources active, weekly cron running.

### Phase 2C — UI + remaining hubs (Week 3, ~5 days)

- [ ] Parsers for Amex, IDFC, IndusInd, AU, HSBC, Yes hubs
- [ ] `ActiveOffers` component on card detail page
- [ ] `/merchants` and `/merchants/[slug]` pages
- [ ] API routes (`/api/offers`, `/api/offers/by-merchant`)
- [ ] Admin curation UI (edit, promote, deactivate)
- [ ] Manual offer creation form
- [ ] Disclaimer text everywhere

**Gate to ship:** offers visible on at least 10 cards, merchants page lists 15+ merchants, admin can verify offers.

### Phase 3 — Advisor integration (Week 4, ~3 days)

- [ ] Hook offers into the Advisor recommendation engine
- [ ] On-demand merchant scraping (Tier 4) with rate limiting
- [ ] Chrome extension for personalized offers (stretch goal — only if needed)

---

## 20. Appendices

### 20.1 Sample seed data

`scripts/seed-merchants.ts` should produce ~80 merchants. Starter list (use `category-matcher.ts` as the canonical source):

```ts
const POPULAR_MERCHANTS = [
  { slug: "amazon-in", name: "Amazon India", domain: "amazon.in", popular: true },
  { slug: "flipkart", name: "Flipkart", domain: "flipkart.com", popular: true },
  { slug: "myntra", name: "Myntra", domain: "myntra.com", popular: true },
  { slug: "ajio", name: "Ajio", domain: "ajio.com" },
  { slug: "tatacliq", name: "Tata CLiQ", domain: "tatacliq.com" },
  { slug: "swiggy", name: "Swiggy", domain: "swiggy.com", popular: true },
  { slug: "zomato", name: "Zomato", domain: "zomato.com", popular: true },
  { slug: "bigbasket", name: "BigBasket", domain: "bigbasket.com", popular: true },
  { slug: "blinkit", name: "Blinkit", domain: "blinkit.com" },
  { slug: "zepto", name: "Zepto", domain: "zeptonow.com" },
  { slug: "makemytrip", name: "MakeMyTrip", domain: "makemytrip.com", popular: true },
  { slug: "cleartrip", name: "Cleartrip", domain: "cleartrip.com" },
  { slug: "easemytrip", name: "EaseMyTrip", domain: "easemytrip.com" },
  { slug: "yatra", name: "Yatra", domain: "yatra.com" },
  { slug: "irctc", name: "IRCTC", domain: "irctc.co.in" },
  { slug: "uber", name: "Uber India", domain: "uber.com" },
  { slug: "ola", name: "Ola", domain: "olacabs.com" },
  { slug: "bookmyshow", name: "BookMyShow", domain: "bookmyshow.com", popular: true },
  { slug: "pvr", name: "PVR", domain: "pvrcinemas.com" },
  { slug: "cult-fit", name: "Cult.fit", domain: "cult.fit" },
  { slug: "croma", name: "Croma", domain: "croma.com" },
  { slug: "reliance-digital", name: "Reliance Digital", domain: "reliancedigital.in" }
  // ... extend to ~80
]
```

### 20.2 Firecrawl gotchas

Things that have burned credits or broken parsers in similar projects:

1. **HDFC Bank's offer pages use heavy JS.** `waitFor: 2000-3000` is mandatory.
2. **Amex requires `waitFor: 3000+`** — their content loads via XHR after auth check fails for non-cardholders.
3. **DesiDime occasionally returns 403 to bot UAs.** Firecrawl handles UA rotation by default; just don't override.
4. **ICICI's offer page has infinite scroll** that won't trigger from Firecrawl. Parse only the first viewport — that's the curated list anyway.
5. **`onlyMainContent: true` strips DesiDime's deal-card class.** Override with `includeTags: ['.deal-card', 'article']`.
6. **Markdown output truncates at ~50KB.** If a page is larger, use `formats: ['rawHtml']` selectively (costs same but more processing on your end).
7. **Don't poll Firecrawl status synchronously in serverless.** Use the async pattern with `pollInterval: 5000` or trust the SDK's default.

### 20.3 Source health monitoring

The `scrape_runs` table is your audit log. Useful queries for the admin dashboard:

```sql
-- Per-source success rate, last 30 days
SELECT
  s.slug,
  s.name,
  COUNT(*) FILTER (WHERE r.status = 'success') AS successes,
  COUNT(*) FILTER (WHERE r.status = 'failed') AS failures,
  COUNT(*) FILTER (WHERE r.status = 'cache_hit') AS cache_hits,
  ROUND(100.0 * COUNT(*) FILTER (WHERE r.status = 'success') / NULLIF(COUNT(*), 0), 1) AS success_pct,
  SUM(r.firecrawl_credits) AS total_credits
FROM scrape_sources s
LEFT JOIN scrape_runs r ON r.source_id = s.id
WHERE r.started_at >= now() - interval '30 days'
GROUP BY s.slug, s.name
ORDER BY total_credits DESC;
```

```sql
-- Stale sources (no successful run in 14 days)
SELECT slug, name, last_success_at
FROM scrape_sources
WHERE enabled = true
  AND (last_success_at IS NULL OR last_success_at < now() - interval '14 days');
```

### 20.4 Type definitions

```ts
// lib/types/offers.ts
import type { Database } from "./supabase"

export type OfferType =
  | "cashback" | "instant_discount" | "reward_multiplier"
  | "voucher" | "bogo" | "no_cost_emi" | "milestone"
  | "welcome" | "lounge_access" | "other"

export type OfferCategory =
  | "food_delivery" | "dining" | "grocery" | "ecommerce_general"
  | "fashion" | "electronics" | "travel_flight" | "travel_hotel"
  | "travel_cab" | "fuel" | "utility" | "entertainment"
  | "health_wellness" | "education" | "insurance" | "lifestyle" | "other"

export type ConfidenceBand = "verified" | "high" | "medium" | "low"

export interface RawOffer {
  sourceUrl: string
  externalId?: string
  title: string
  description?: string
  offerType: OfferType
  merchantNameHint?: string
  cardMentionRaw?: string
  eligibleCardIds?: string[]
  eligibleIssuers?: string[]
  eligibleCardNetworks?: string[]
  valuePct?: number
  valueFlat?: number
  maxValue?: number
  minTxn?: number
  startsAt?: string
  endsAt?: string
  rawSnippet?: string
  scrapedAt: string
}

export interface Offer extends RawOffer {
  id: string
  category: OfferCategory
  merchantId?: string
  confidenceScore: number
  confidenceBand: ConfidenceBand
  manuallyVerified: boolean
  isActive: boolean
}

export interface CardMatch {
  cardId: string
  reason:
    | "explicit_card_id" | "explicit_card_name"
    | "issuer_match" | "network_match" | "bin_match"
  confidence: number
}

export interface SourceDefinition {
  slug: string
  name: string
  url: string
  sourceType: "bank_hub" | "aggregator" | "merchant" | "manual"
  parserModule: string
  cronSchedule: string
  cacheTtlSeconds: number
  firecrawlOptions?: Record<string, unknown>
}

export interface ScrapeOptions {
  formats?: Array<"markdown" | "html" | "rawHtml">
  onlyMainContent?: boolean
  waitFor?: number
  includeTags?: string[]
  excludeTags?: string[]
}

export interface ScrapeResult {
  url: string
  markdown: string
  metadata: Record<string, unknown>
  scrapedAt: string
}
```

### 20.5 Things explicitly out of scope

- **Affiliate revenue tracking** — separate concern; would need partner agreements
- **A/B testing offer ranking** — premature optimization
- **Multi-currency** — India only for v1
- **Offer popularity / social proof** — needs traffic first
- **Offer alerts (push/email)** — Phase 4 maybe; not now
- **Statement-based personalized offer extraction** — already in main README under analyzer

---

**End of SCRAPING.md**

Refer back to the main `README.md` for non-offer-related architecture, the card data files (`cards-original-verified.ts`, `cards-additional.ts`) for static card features, and Anthropic's Firecrawl docs for SDK reference.
