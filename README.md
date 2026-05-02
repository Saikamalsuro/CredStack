# CredStack — Implementation Master Plan

> **Audience:** Claude Code (autonomous build agent).
> **Mandate:** Take the existing static UI and turn it into a fully functional, AI-powered credit card platform backed by Supabase, Groq, and Firecrawl — **without altering any UI rendering, components, styles, or page structure**.

---

## TABLE OF CONTENTS

1. [Project Vision](#1-project-vision)
2. [Read This First — Hard Rules](#2-read-this-first--hard-rules)
3. [Current State of the Codebase](#3-current-state-of-the-codebase)
4. [Target Tech Stack (Additions)](#4-target-tech-stack-additions)
5. [High-Level Architecture](#5-high-level-architecture)
6. [Database Schema (Supabase / Postgres)](#6-database-schema-supabase--postgres)
7. [Storage Strategy — Card Images & PDFs](#7-storage-strategy--card-images--pdfs)
8. [Authentication & Row Level Security](#8-authentication--row-level-security)
9. [Folder & File Structure (Additions)](#9-folder--file-structure-additions)
10. [Environment Variables](#10-environment-variables)
11. [Page-by-Page Migration Plan](#11-page-by-page-migration-plan)
12. [Server Actions & API Routes](#12-server-actions--api-routes)
13. [Groq AI Integration](#13-groq-ai-integration)
14. [Net Annual Value Engine (Deterministic)](#14-net-annual-value-engine-deterministic)
15. [Statement Upload Pipeline (Analyzer)](#15-statement-upload-pipeline-analyzer)
16. [Offer Scraping Architecture (Firecrawl + Inngest)](#16-offer-scraping-architecture-firecrawl--inngest)
17. [Background Jobs](#17-background-jobs)
18. [Differentiating Features (Beyond Migration)](#18-differentiating-features-beyond-migration)
19. [Implementation Phases](#19-implementation-phases)
20. [Validation Checklist](#20-validation-checklist)
21. [Deployment Notes](#21-deployment-notes)

---

## 1. PROJECT VISION

CredStack is an AI-powered credit card intelligence platform for the Indian market. It positions itself against BankBazaar, Paisabazaar, CardInsider, CardExpert, 1 Finance, and CRED with a single core promise:

> **The only credit card platform in India that tells you the actual rupee value each card delivers — based on how you actually spend, with every reward cap and exclusion modeled.**

The four core pillars (and their dedicated pages) are:

- **Cards Catalog** — verified, deeply-modeled card database with `data_last_verified_at` trust signal
- **Compare** — side-by-side comparison with **net annual value** (rupee value minus fees, computed against user's spend profile)
- **AI Advisor** — deterministic scoring (rule-based math) wrapped in Groq-generated natural-language explanations
- **Dashboard + Analyzer** — user's connected cards, transactions ingested via statement upload, optimization insights

---

## 2. READ THIS FIRST — HARD RULES

These rules are non-negotiable. Violating them defeats the purpose of this migration.

### 2.1 UI Preservation (DO NOT CHANGE)

- **Do NOT modify** any file under `components/` (cards, home, layout, theme-provider, ui).
- **Do NOT modify** the JSX/markup, Tailwind classes, animations, layouts, or visual copy in any page under `app/`.
- **Do NOT change** the `CreditCard` TypeScript interface shape that the UI consumes. New backend fields are surfaced through extension types in a separate file (`lib/types/extended.ts`).
- **Do NOT remove** any framer-motion animations, no matter how small.
- **Do NOT change** the navigation in `components/layout/header.tsx`. The 6 routes there are canonical.

### 2.2 Allowed Changes

- Replace `import { creditCards } from "@/lib/data/cards"` with calls to a new data layer (`lib/db/cards.ts`) that returns the **same shape**.
- Convert `"use client"` pages to Server Components **only where they don't break interactivity** (see §11 per-page rules).
- Add new files under `app/api/`, `lib/db/`, `lib/ai/`, `lib/scraping/`, `lib/jobs/`, `lib/auth/`, `supabase/`, `scripts/`.
- Add `app/auth/` route group for sign-in/sign-up (the "Get Started" button in header currently does nothing — wire it to `/auth/sign-in`).
- Add new dynamic functionality (dashboard real data, advisor real scoring, analyzer real upload) **without** changing the UI components that render them.

### 2.3 Data Shape Contract

The data layer (`lib/db/cards.ts`) **must export functions with the same names and return shapes** as the current `lib/data/cards.ts`:

```ts
// Functions that MUST exist with these signatures (return Promise where they currently return sync):
getCardById(id: string): Promise<CreditCard | undefined>
getCardsByCategory(category: CardCategory): Promise<CreditCard[]>
getFeaturedCards(): Promise<CreditCard[]>
getPopularCards(): Promise<CreditCard[]>
searchCards(query: string): Promise<CreditCard[]>
sortCards(cards: CreditCard[], sortBy: ...): CreditCard[]   // pure, stays sync
filterCards(cards: CreditCard[], filters: {...}): CreditCard[] // pure, stays sync
```

Pages awaiting these calls is the only acceptable change to consumer code. Where a page is currently `"use client"` and sync, switch to either: (a) Server Component with `await`, or (b) keep client and fetch via TanStack Query / Server Action.

### 2.4 Money Representation

- **Card-level fees** (`annualFee`, `joiningFee`, `minIncome`, etc.): stored as INTEGER rupees in DB → matches existing UI expectation.
- **User transactions** (analyzer/dashboard): stored as `bigint paise` → divided by 100 at query layer when sent to UI to preserve precision.
- **Reward calculations**: always done in paise internally, converted to rupees only at display layer.

---

## 3. CURRENT STATE OF THE CODEBASE

### 3.1 Stack (existing)

- **Framework:** Next.js 16.2.4 (App Router), React 19, TypeScript strict
- **Styling:** Tailwind CSS v4, shadcn/ui (Radix primitives), tw-animate-css
- **UI:** Framer Motion, Lucide icons, next-themes (light/dark), Recharts
- **Forms:** react-hook-form + Zod (installed, not yet used)
- **Analytics:** Vercel Analytics (production only)
- **Package manager:** pnpm

### 3.2 Routes

| Route | File | Type | Status |
|---|---|---|---|
| `/` | `app/page.tsx` | Server | Renders home sections; pulls from `getPopularCards()` |
| `/cards` | `app/cards/page.tsx` | **Client** | Filters/search/sort over static `creditCards` array |
| `/cards/[id]` | `app/cards/[id]/page.tsx` (server) + `card-details-client.tsx` (client) | Hybrid | Uses `generateStaticParams` over all cards |
| `/compare` | `app/compare/page.tsx` | **Client** | Up to 4 cards side-by-side, URL state via `?cards=id1,id2` |
| `/dashboard` | `app/dashboard/page.tsx` | **Client** | All hardcoded mock data |
| `/advisor` | `app/advisor/page.tsx` | **Client** | 3-step flow, mock scoring (category match + rating) |
| `/analyzer` | `app/analyzer/page.tsx` | **Client** | "Use Demo Data" button → static `mockAnalysis` object |

### 3.3 Existing Data Layer

- **Single file:** `lib/data/cards.ts` (~657 lines)
- **13 cards seeded:** hdfc-infinia, amex-platinum, axis-magnus, sbi-elite, icici-amazon-pay, hdfc-millennia, onecard, hdfc-regalia-gold, axis-flipkart, icici-sapphiro, indusind-legend, au-lit, sbi-cashback, idfc-millennia, hsbc-smart-value
- **Files importing from it:** `app/advisor/page.tsx`, `app/cards/[id]/card-details-client.tsx`, `app/cards/[id]/page.tsx`, `app/cards/page.tsx`, `app/compare/page.tsx`, `app/dashboard/page.tsx`, `components/home/featured-cards-section.tsx`, `components/home/hero-section.tsx`

### 3.4 What Doesn't Work Yet

- No backend API routes (`app/api/` is absent)
- No auth — "Get Started" button in header has no `href`
- Dashboard data is fully hardcoded (`userCards`, `spendingData`, `categorySpending`, `recentTransactions`, `upcomingPayments`, `stats`)
- Advisor scoring is a tiny rule (category overlap × rating × 2)
- Analyzer's `mockAnalysis` is a static object — no upload pipeline
- No card images in `public/cards/` (UI uses gradient backgrounds via `cardColor` field)
- No environment variable handling
- No database client

---

## 4. TARGET TECH STACK (ADDITIONS)

Add these dependencies. Group by purpose so it's clear what each does.

### 4.1 Backend & Auth

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

- `@supabase/supabase-js` — DB + Storage + Auth SDK
- `@supabase/ssr` — server-side cookie-based auth for Next.js App Router

### 4.2 AI

```bash
pnpm add groq-sdk
```

- `groq-sdk` — Groq API client (free tier sufficient for development)

### 4.3 Scraping & Web

```bash
pnpm add @mendable/firecrawl-js
```

- `@mendable/firecrawl-js` — Firecrawl SDK; use the open-source self-hosted instance via `FIRECRAWL_BASE_URL`, or hosted free tier for dev

### 4.4 Background Jobs

```bash
pnpm add inngest
```

- `inngest` — durable background jobs (scraping, statement parsing, periodic re-verification)

### 4.5 Statement / PDF Parsing

```bash
pnpm add unpdf pdf-parse
```

- `unpdf` — modern Node-friendly PDF text extraction (preferred)
- `pdf-parse` — fallback for malformed PDFs

### 4.6 Caching & Rate Limiting

```bash
pnpm add @upstash/redis @upstash/ratelimit
```

- `@upstash/redis` — serverless Redis for caching expensive Groq responses
- `@upstash/ratelimit` — per-user rate limit on AI advisor / analyzer endpoints

### 4.7 Data Fetching (Client)

```bash
pnpm add @tanstack/react-query nuqs
```

- `@tanstack/react-query` — client-side query caching for dashboard widgets
- `nuqs` — URL-state for compare page filters (replaces manual `useSearchParams` parsing)

### 4.8 Validation

`zod` is already installed. **Use it for all** AI structured outputs, all API request/response shapes, all form inputs.

### 4.9 Optional / Later

- `@vercel/blob` or skip (use Supabase Storage instead — already covered)
- `resend` + `react-email` — for reward expiry notification emails (Phase 3)
- `@sentry/nextjs` — error tracking (before launch)
- `posthog-js` — product analytics (before launch)

---

## 5. HIGH-LEVEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (Next.js)                        │
│  Pages stay UI-identical; data sources swap to backend services  │
└──────────────────┬──────────────────────────┬───────────────────┘
                   │                          │
                   │ Server Components        │ Client Components
                   │ + Server Actions         │ + TanStack Query
                   ▼                          ▼
        ┌───────────────────────────────────────────┐
        │            Next.js API LAYER               │
        │  app/api/* + Server Actions in lib/db/*    │
        └──────┬───────────┬───────────┬────────────┘
               │           │           │
               ▼           ▼           ▼
        ┌──────────┐  ┌────────┐  ┌─────────┐
        │ Supabase │  │  Groq  │  │ Upstash │
        │ Postgres │  │   API  │  │  Redis  │
        │ + Auth   │  │  (LLM) │  │ (cache) │
        │ +Storage │  │        │  │         │
        └──────────┘  └────────┘  └─────────┘
               ▲
               │ writes
        ┌──────┴───────────────────────────────┐
        │           BACKGROUND JOBS             │
        │              (Inngest)                │
        │  - Scrape merchant offer pages        │
        │  - Re-verify card data freshness      │
        │  - Process uploaded statements        │
        │  - Compute reward expiry alerts       │
        └──────┬─────────────┬──────────────────┘
               │             │
               ▼             ▼
        ┌──────────┐  ┌──────────┐
        │Firecrawl │  │   Groq   │
        │ scraper  │  │ extract  │
        └──────────┘  └──────────┘
```

### Request flow examples

**Loading `/cards`:**
1. Server Component calls `await getCards(filters)` from `lib/db/cards.ts`
2. `getCards` queries Supabase, joins reward rules + benefits + lounges, hydrates to `CreditCard` shape
3. HTML streams to browser; client filters apply via existing client component logic over the hydrated array

**AI Advisor "Get Recommendations":**
1. Client submits spending profile via Server Action `recommendCards(profile)`
2. Server Action filters eligible cards from DB
3. Deterministic scoring engine (`lib/ai/scoring.ts`) computes annual reward value per card given spend
4. Top N candidates sent to Groq with structured prompt → returns explanation per card (Zod-validated)
5. Response cached in Redis keyed by hash(profile)
6. Client renders results in existing UI

**Analyzer statement upload:**
1. User uploads PDF via existing dropzone → sent to `app/api/analyzer/upload`
2. File written to Supabase Storage (private bucket, signed URL)
3. Inngest event `analyzer.statement.uploaded` fired with file path
4. Worker: extract text → Groq classification → write transactions → compute insights → store in `analyzer_runs`
5. Client polls `app/api/analyzer/status` until ready; renders `mockAnalysis`-shape result from real data

---

## 6. DATABASE SCHEMA (SUPABASE / POSTGRES)

All migrations live in `supabase/migrations/` as timestamped SQL files. Run via Supabase CLI or paste into SQL editor.

### 6.1 Naming Conventions

- snake_case for tables and columns
- Plural table names (`cards`, `user_cards`, `transactions`)
- `id` is `uuid` (default `gen_random_uuid()`) for new tables
- `cards.slug` is the human-readable id ("hdfc-infinia"); UI continues to reference cards by slug
- All tables get `created_at timestamptz default now()` and `updated_at timestamptz default now()` with trigger
- Money: rupees as `integer` for fees, `bigint` (paise) for transaction amounts

### 6.2 Core Tables — Card Catalog

```sql
-- 6.2.1 Card categories enum
create type card_category as enum (
  'travel', 'cashback', 'rewards', 'business',
  'student', 'premium', 'fuel', 'shopping'
);

create type card_network as enum (
  'visa', 'mastercard', 'amex', 'rupay', 'discover'
);

create type reward_type as enum ('points', 'cashback', 'miles');

-- 6.2.2 Main cards table — mirrors UI shape, expanded
create table cards (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                    -- 'hdfc-infinia'
  name text not null,
  issuer text not null,
  network card_network not null,
  categories card_category[] not null default '{}',

  -- Fees (integer rupees to match UI)
  annual_fee integer not null default 0,
  joining_fee integer not null default 0,
  annual_fee_waiver_spend integer,              -- spend this much to waive next year
  forex_markup_pct numeric(4,2) not null,       -- foreignTransactionFee
  fuel_surcharge_waiver boolean not null default false,
  apr_min numeric(4,2) not null,
  apr_max numeric(4,2) not null,
  late_payment_fee_text text,
  emi_conversion_charge_pct numeric(4,2),

  -- Eligibility
  min_income integer not null default 0,        -- annual rupees
  min_age integer default 21,
  max_age integer default 65,
  min_credit_score integer default 700,
  credit_limit_min integer not null default 0,
  credit_limit_max integer not null default 0,
  self_employed_eligible boolean default true,
  documentation_required text[] default '{}',

  -- Rewards (top-level summary; details in card_reward_rules)
  reward_type reward_type not null,
  base_reward_rate numeric(5,2) not null,       -- e.g., 1.0 for 1%
  reward_description text not null,             -- UI rewards.description
  point_value_paise integer,                    -- ₹ value of 1 point in paise (e.g., 100 = ₹1)
  reward_expiry_months integer,                 -- null = no expiry
  reward_capping_monthly integer,               -- overall monthly cap in rupees, nullable

  -- Welcome
  welcome_bonus_text text,
  welcome_bonus_value integer,                  -- monetary value in rupees if computable

  -- Lounges
  domestic_lounges_per_year integer,            -- null = no access; -1 = unlimited
  intl_lounges_per_year integer,
  lounge_program text,                          -- 'priority-pass', 'dreamfolks', 'visa', etc.
  lounge_guest_visits boolean default false,

  -- Visual / metadata
  image_url text,                               -- Supabase Storage URL
  card_color_gradient text not null,            -- 'from-slate-800 to-slate-900' (UI uses this)
  rating numeric(2,1) default 0,
  review_count integer default 0,

  -- Flags
  featured boolean not null default false,
  popular boolean not null default false,
  is_active boolean not null default true,
  is_lifetime_free boolean not null default false,

  -- Trust signals (CRITICAL DIFFERENTIATOR)
  data_last_verified_at timestamptz,
  data_source_urls text[] default '{}',         -- citations
  mitc_url text,                                -- Most Important Terms & Conditions
  apply_url text,                               -- direct apply link / affiliate
  reviewer text,                                -- 'CredStack Editorial'
  changelog jsonb default '[]'::jsonb,          -- [{date, change}]

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_cards_slug on cards(slug);
create index idx_cards_categories on cards using gin(categories);
create index idx_cards_featured on cards(featured) where featured = true;
create index idx_cards_popular on cards(popular) where popular = true;
create index idx_cards_active on cards(is_active) where is_active = true;
create index idx_cards_search on cards using gin(
  to_tsvector('english', name || ' ' || issuer || ' ' || coalesce(reward_description, ''))
);

-- 6.2.3 Reward rules (one card → many accelerated categories)
create type reward_category as enum (
  'dining', 'fuel', 'travel', 'shopping_online', 'shopping_offline',
  'grocery', 'utilities', 'rent', 'wallet', 'government',
  'education', 'insurance', 'smartbuy', 'flipkart', 'amazon',
  'myntra', 'swiggy', 'zomato', 'uber', 'makemytrip'
);

create table card_reward_rules (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  category reward_category not null,
  reward_rate_pct numeric(5,2) not null,        -- effective % return
  monthly_cap integer,                          -- rupees, null = uncapped
  quarterly_cap integer,
  notes text,
  display_order integer default 0,
  created_at timestamptz default now()
);

create index idx_reward_rules_card on card_reward_rules(card_id);

-- 6.2.4 Excluded categories (where rewards do not apply)
create table card_exclusions (
  card_id uuid not null references cards(id) on delete cascade,
  category reward_category not null,
  primary key (card_id, category)
);

-- 6.2.5 Benefits (preserves UI's benefits[] array)
create table card_benefits (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  title text not null,                          -- the bullet text the UI displays
  benefit_type text,                            -- 'lounge', 'golf', 'concierge', 'insurance', 'dining'
  description text,                             -- optional longer
  icon text,                                    -- optional lucide icon name
  display_order integer default 0,
  created_at timestamptz default now()
);

create index idx_benefits_card on card_benefits(card_id, display_order);

-- 6.2.6 Milestone benefits (spend X → earn Y)
create table card_milestones (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  spend_threshold integer not null,             -- rupees per year
  reward_value integer not null,                -- rupees
  reward_description text not null,             -- 'Taj voucher worth ₹10,000'
  period text not null default 'annual',        -- 'annual' | 'quarterly' | 'milestone'
  created_at timestamptz default now()
);

-- 6.2.7 Insurance covers
create table card_insurance (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  cover_type text not null,                     -- 'air_accident', 'lost_card', 'travel_medical'
  cover_amount integer not null,                -- rupees
  conditions text,
  created_at timestamptz default now()
);
```

### 6.3 User Tables

```sql
-- 6.3.1 Profile (1:1 with auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  city text,
  monthly_income integer,                       -- rupees
  employment_type text,                         -- 'salaried', 'self_employed', 'student'
  credit_score integer,
  age integer,
  onboarded_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6.3.2 User's cards (the dashboard "My Cards")
create table user_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  card_id uuid not null references cards(id),
  card_last_four text check (card_last_four ~ '^[0-9]{4}$'),
  nickname text,
  statement_day integer check (statement_day between 1 and 31),
  due_day integer check (due_day between 1 and 31),
  credit_limit integer,                         -- rupees, user-entered
  is_primary boolean default false,
  added_at timestamptz default now(),
  removed_at timestamptz,                       -- soft-delete
  unique (user_id, card_id, card_last_four)
);

create index idx_user_cards_user on user_cards(user_id) where removed_at is null;

-- 6.3.3 Transactions
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_card_id uuid not null references user_cards(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade, -- denormalized for RLS
  txn_date date not null,
  amount_paise bigint not null,                 -- precise money
  merchant text not null,
  merchant_normalized text,                     -- 'AMAZON' from 'AMZN*MKTPLC'
  category reward_category,                     -- inferred category for reward calc
  reward_earned_paise bigint default 0,
  source text not null default 'manual',        -- 'manual' | 'statement_upload' | 'ai_extracted'
  raw_description text,                         -- original line on statement
  is_reversed boolean default false,
  created_at timestamptz default now()
);

create index idx_txn_user_date on transactions(user_id, txn_date desc);
create index idx_txn_card on transactions(user_card_id, txn_date desc);
create index idx_txn_category on transactions(user_id, category, txn_date desc);

-- 6.3.4 Upcoming payments (computed/stored)
create table card_payments (
  id uuid primary key default gen_random_uuid(),
  user_card_id uuid not null references user_cards(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  due_date date not null,
  total_due integer not null,                   -- rupees
  min_due integer not null,
  paid_at timestamptz,
  paid_amount integer,
  created_at timestamptz default now()
);
```

### 6.4 Advisor & Analyzer Tables

```sql
-- 6.4.1 Saved advisor sessions (so users can revisit recommendations)
create table advisor_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,  -- nullable for anonymous
  spending_profile jsonb not null,              -- the slider inputs
  monthly_spend integer not null,
  preferences jsonb not null default '{}',      -- { preferFreeCards, needsLoungeAccess, ... }
  recommended_card_ids uuid[] not null,
  llm_explanations jsonb not null,              -- {[card_id]: "Why this card..."}
  created_at timestamptz default now()
);

-- 6.4.2 Analyzer runs (statement upload outputs)
create table analyzer_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'queued',        -- 'queued' | 'parsing' | 'classifying' | 'ready' | 'failed'
  uploaded_file_path text,                      -- Supabase Storage path
  statement_period_start date,
  statement_period_end date,
  total_spend_paise bigint,
  total_rewards_paise bigint,
  overall_score integer,                        -- 0-100
  spending_efficiency integer,
  rewards_optimization integer,
  risk_score integer,
  insights jsonb default '[]'::jsonb,           -- [{type, title, description, impact, priority}]
  category_breakdown jsonb default '[]'::jsonb,
  risk_factors jsonb default '[]'::jsonb,
  error_message text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create index idx_analyzer_user on analyzer_runs(user_id, created_at desc);
```

### 6.5 Offers & Scraping Tables

```sql
-- 6.5.1 Aggregated offers from merchant pages
create table offers (
  id uuid primary key default gen_random_uuid(),
  merchant text not null,                       -- 'amazon', 'flipkart', 'swiggy'
  title text not null,
  description text,

  -- Targeting
  applicable_issuers text[] default '{}',       -- ['HDFC', 'ICICI']
  applicable_networks card_network[] default '{}',
  applicable_card_slugs text[] default '{}',    -- specific slugs if known

  -- Discount mechanics
  discount_type text not null,                  -- 'flat' | 'percent' | 'cashback' | 'instant'
  discount_value integer,                       -- rupees or percent number
  min_txn_amount integer,                       -- rupees
  max_discount integer,                         -- rupees cap

  -- Validity
  valid_from date,
  valid_until date,

  -- Source
  source_url text not null,
  source_hash text not null unique,             -- dedup key: hash(merchant + title + valid_until)
  scraped_at timestamptz not null default now(),
  is_active boolean not null default true
);

create index idx_offers_active on offers(is_active, valid_until) where is_active = true;
create index idx_offers_issuers on offers using gin(applicable_issuers);
create index idx_offers_slugs on offers using gin(applicable_card_slugs);

-- 6.5.2 Scrape job log (for observability)
create table scrape_runs (
  id uuid primary key default gen_random_uuid(),
  source_url text not null,
  status text not null,                         -- 'running' | 'success' | 'failed'
  offers_found integer default 0,
  offers_added integer default 0,
  offers_updated integer default 0,
  error_message text,
  started_at timestamptz default now(),
  completed_at timestamptz
);
```

### 6.6 Reviews

```sql
create table reviews (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating numeric(2,1) not null check (rating >= 1 and rating <= 5),
  title text,
  body text not null,
  is_verified_cardholder boolean default false, -- true if user has card_id in their user_cards
  helpful_count integer default 0,
  created_at timestamptz default now(),
  unique (card_id, user_id)
);

create index idx_reviews_card on reviews(card_id, created_at desc);
```

### 6.7 Updated-At Trigger

```sql
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger trg_cards_updated_at before update on cards
  for each row execute function set_updated_at();
create trigger trg_profiles_updated_at before update on profiles
  for each row execute function set_updated_at();
-- Apply to all tables with updated_at
```

### 6.8 Hydration Strategy (Critical)

The UI's existing `CreditCard` interface expects a flat object including `benefits: string[]`, `loungeAccess: {domestic, international} | null`, etc. The DB stores these normalized. The data layer hydrates:

```ts
// lib/db/cards.ts (signature, not implementation)
async function hydrateCard(row: CardRow): Promise<CreditCard> {
  // Fetch related: benefits (titles only), reward_rules (for description if needed)
  // Map back to UI shape:
  return {
    id: row.slug,                                // UI uses slug as id!
    name: row.name,
    issuer: row.issuer,
    network: row.network,
    category: row.categories,
    annualFee: row.annual_fee,
    joiningFee: row.joining_fee,
    interestRate: { min: row.apr_min, max: row.apr_max },
    creditLimit: { min: row.credit_limit_min, max: row.credit_limit_max },
    rewards: {
      type: row.reward_type,
      rate: row.base_reward_rate,
      description: row.reward_description,
    },
    benefits: benefitTitles,                    // string[] from card_benefits.title
    loungeAccess: row.domestic_lounges_per_year === null && row.intl_lounges_per_year === null
      ? null
      : {
          domestic: row.domestic_lounges_per_year === -1 ? "unlimited" : row.domestic_lounges_per_year,
          international: row.intl_lounges_per_year === -1 ? "unlimited" : row.intl_lounges_per_year,
        },
    welcomeBonus: row.welcome_bonus_text,
    fuelSurchargeWaiver: row.fuel_surcharge_waiver,
    foreignTransactionFee: row.forex_markup_pct,
    minIncome: row.min_income,
    rating: row.rating,
    reviewCount: row.review_count,
    imageUrl: row.image_url ?? "/placeholder.svg",
    cardColor: row.card_color_gradient,
    featured: row.featured,
    popular: row.popular,
  };
}
```

**Key:** `card.id` in the UI is the slug. The internal `cards.id` (uuid) is for DB joins only.

### 6.9 Extended Type for New Features

Create `lib/types/extended.ts` for the richer shape used by net-value calc, optimizer, etc.:

```ts
export interface CardExtended extends CreditCard {
  rewardRules: { category: RewardCategory; ratePct: number; monthlyCap: number | null }[];
  exclusions: RewardCategory[];
  milestones: { spendThreshold: number; rewardValue: number; description: string }[];
  insurance: { coverType: string; coverAmount: number }[];
  pointValuePaise: number | null;
  rewardExpiryMonths: number | null;
  dataLastVerifiedAt: string | null;
  mitcUrl: string | null;
  applyUrl: string | null;
  isLifetimeFree: boolean;
}
```

The UI never reads from `CardExtended` directly — it's used by the scoring engine and AI advisor.

---

## 7. STORAGE STRATEGY — CARD IMAGES & PDFS

### 7.1 Buckets

Create three buckets in Supabase Storage:

| Bucket | Visibility | Purpose |
|---|---|---|
| `card-images` | **public** | Card visuals shown across the catalog. Path: `cards/{slug}.{ext}` |
| `statements` | **private** | Uploaded user statements. Path: `statements/{user_id}/{run_id}/{filename}` |
| `card-assets` | **public** | Marketing collateral, MITC PDFs, terms docs. Path: `assets/{slug}/{filename}` |

### 7.2 Image Source

The UI uses gradient backgrounds (`cardColor` Tailwind classes) when `imageUrl` is missing — this is fine and should remain the fallback.

For real card images:
1. Source from issuer websites or public press kits (manually verified — do not scrape image rights from random sites).
2. Standardize: 600×380 px, WebP preferred, PNG fallback. Naming: `cards/{slug}.webp`.
3. Upload via the seed script (§19, Phase 1). The seed script accepts a local `seed-images/` folder; if a file `seed-images/{slug}.webp` exists, upload it; otherwise leave `image_url` null and the UI falls back to gradient.
4. Public bucket → URL pattern: `https://{project}.supabase.co/storage/v1/object/public/card-images/cards/{slug}.webp`.

### 7.3 RLS for Storage

```sql
-- card-images: public read, only service role can insert/update
create policy "card images public read" on storage.objects
  for select using (bucket_id = 'card-images');

-- statements: only owner can read
create policy "user reads own statements" on storage.objects
  for select using (
    bucket_id = 'statements'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

create policy "user uploads own statements" on storage.objects
  for insert with check (
    bucket_id = 'statements'
    and (storage.foldername(name))[2] = auth.uid()::text
  );
```

---

## 8. AUTHENTICATION & ROW LEVEL SECURITY

### 8.1 Auth Provider

Use Supabase Auth with **two methods**:
- Email + magic link (default, dev-friendly)
- Phone OTP via MSG91 SMS provider (configure in Supabase dashboard for India reliability)

### 8.2 Auth Flow

1. Add `app/auth/sign-in/page.tsx`, `app/auth/sign-up/page.tsx`, `app/auth/callback/route.ts`.
2. **Wire the existing "Get Started" button** in `components/layout/header.tsx`: change the existing `<Button className="...">Get Started</Button>` to wrap with `<Link href="/auth/sign-in">` — this is the **only allowed change to the header file**.
3. Use `@supabase/ssr` cookie-based session.
4. `middleware.ts` at project root protects `/dashboard`, `/analyzer` (require session), redirects to `/auth/sign-in` if not authenticated.
5. Public routes: `/`, `/cards`, `/cards/*`, `/compare`, `/advisor` (advisor allows anonymous; saving the session requires auth).

### 8.3 RLS Policies (Apply Per Table)

```sql
-- cards: public read, service role only writes
alter table cards enable row level security;
create policy "cards public read" on cards
  for select using (is_active = true);

-- card_reward_rules, card_benefits, card_milestones, card_insurance, card_exclusions
-- All public read, service role writes (apply identical pattern)
alter table card_reward_rules enable row level security;
create policy "reward rules public read" on card_reward_rules for select using (true);
-- ... repeat for benefits, milestones, insurance, exclusions

-- profiles: user reads/writes own
alter table profiles enable row level security;
create policy "profiles self read" on profiles
  for select using (auth.uid() = id);
create policy "profiles self update" on profiles
  for update using (auth.uid() = id);
create policy "profiles self insert" on profiles
  for insert with check (auth.uid() = id);

-- user_cards: user reads/writes own
alter table user_cards enable row level security;
create policy "user_cards self all" on user_cards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- transactions: user reads/writes own
alter table transactions enable row level security;
create policy "transactions self all" on transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- card_payments: user reads/writes own
alter table card_payments enable row level security;
create policy "payments self all" on card_payments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- analyzer_runs: user reads own
alter table analyzer_runs enable row level security;
create policy "analyzer runs self read" on analyzer_runs
  for select using (auth.uid() = user_id);
-- Inserts come from server (service role), not direct user

-- advisor_sessions: user reads own; anonymous sessions allowed (user_id null)
alter table advisor_sessions enable row level security;
create policy "advisor sessions self read" on advisor_sessions
  for select using (user_id is null or auth.uid() = user_id);

-- offers: public read
alter table offers enable row level security;
create policy "offers public read" on offers
  for select using (is_active = true);

-- reviews: public read, authenticated insert/update own
alter table reviews enable row level security;
create policy "reviews public read" on reviews for select using (true);
create policy "reviews authenticated write" on reviews
  for insert with check (auth.uid() = user_id);
create policy "reviews self update" on reviews
  for update using (auth.uid() = user_id);
```

### 8.4 Service Role Key

Server-only operations (seeding, scraping writes, analyzer pipeline writes) use `SUPABASE_SERVICE_ROLE_KEY`. **Never** expose this to the client. Use only in:
- `scripts/seed-cards.ts`
- `lib/jobs/*` (Inngest workers)
- `app/api/admin/*` (if admin endpoints are ever added)

---

## 9. FOLDER & FILE STRUCTURE (ADDITIONS)

Existing structure stays. Add the following:

```
credstack/
├── app/
│   ├── api/                                  # NEW
│   │   ├── auth/
│   │   │   └── callback/route.ts             # OAuth callback
│   │   ├── advisor/
│   │   │   └── recommend/route.ts            # POST: spending profile → recommendations
│   │   ├── analyzer/
│   │   │   ├── upload/route.ts               # POST: upload PDF
│   │   │   └── status/route.ts               # GET: poll run status
│   │   ├── dashboard/
│   │   │   ├── overview/route.ts             # GET: stats + spending data
│   │   │   └── transactions/route.ts         # GET/POST
│   │   ├── cards/
│   │   │   └── add/route.ts                  # POST: user adds card to portfolio
│   │   ├── compare/
│   │   │   └── value/route.ts                # POST: net-value calc per card
│   │   ├── offers/
│   │   │   └── for-user/route.ts             # GET: offers matching user's cards
│   │   └── inngest/route.ts                  # Inngest webhook
│   ├── auth/                                 # NEW
│   │   ├── sign-in/page.tsx
│   │   ├── sign-up/page.tsx
│   │   └── verify/page.tsx
│   └── (existing pages — DO NOT MODIFY UI)
│
├── components/                               # ❌ DO NOT MODIFY (except header.tsx Get Started button)
│
├── lib/
│   ├── data/cards.ts                         # ⚠️ KEEP for now as fallback; deprecate after migration
│   ├── db/                                   # NEW
│   │   ├── client.ts                         # Supabase browser client
│   │   ├── server.ts                         # Supabase server client (cookies)
│   │   ├── admin.ts                          # Service role client (never imported in client code)
│   │   ├── cards.ts                          # ⭐ Drop-in replacement for lib/data/cards exports
│   │   ├── user-cards.ts
│   │   ├── transactions.ts
│   │   ├── offers.ts
│   │   └── advisor-sessions.ts
│   ├── ai/                                   # NEW
│   │   ├── groq.ts                           # Groq client + structured-output helper
│   │   ├── scoring.ts                        # Deterministic net-value engine
│   │   ├── advisor.ts                        # Advisor orchestration: filter → score → explain
│   │   ├── classifier.ts                     # Transaction → category classification
│   │   ├── statement-parser.ts               # PDF text → structured transactions
│   │   └── prompts/
│   │       ├── advisor-explanation.ts
│   │       ├── transaction-classify.ts
│   │       ├── statement-extract.ts
│   │       └── offer-extract.ts
│   ├── scraping/                             # NEW
│   │   ├── firecrawl.ts                      # Firecrawl client wrapper
│   │   ├── targets.ts                        # List of merchant URLs to scrape
│   │   ├── extractors/
│   │   │   ├── amazon.ts
│   │   │   ├── flipkart.ts
│   │   │   ├── swiggy.ts
│   │   │   └── generic.ts
│   │   └── deduplicate.ts
│   ├── jobs/                                 # NEW (Inngest functions)
│   │   ├── client.ts                         # Inngest client init
│   │   ├── scrape-offers.ts
│   │   ├── parse-statement.ts
│   │   ├── refresh-card-data.ts
│   │   └── compute-expiry-alerts.ts
│   ├── auth/                                 # NEW
│   │   ├── middleware.ts                     # Used by root middleware.ts
│   │   └── helpers.ts                        # getCurrentUser(), requireAuth()
│   ├── cache/                                # NEW
│   │   ├── redis.ts                          # Upstash client
│   │   └── ratelimit.ts
│   ├── types/                                # NEW
│   │   ├── database.ts                       # Generated by `supabase gen types`
│   │   └── extended.ts                       # CardExtended, scoring inputs
│   └── utils.ts                              # existing
│
├── supabase/
│   ├── migrations/                           # NEW
│   │   ├── 20260101000001_initial_schema.sql
│   │   ├── 20260101000002_rls_policies.sql
│   │   ├── 20260101000003_storage_buckets.sql
│   │   └── 20260101000004_triggers.sql
│   └── seed/                                 # NEW
│       └── seed-images/                      # local card images for upload (slug.webp)
│
├── scripts/                                  # NEW
│   ├── seed-cards.ts                         # Reads existing lib/data/cards.ts → writes to Supabase
│   ├── seed-reward-rules.ts                  # Manually curated accelerated rates per card
│   ├── verify-cards.ts                       # Print last verification dates, flag stale
│   └── test-scraper.ts                       # Dry-run a single merchant scrape locally
│
├── middleware.ts                             # NEW (root) — auth gate
├── .env.local.example                        # NEW
└── README.md                                 # this file
```

---

## 10. ENVIRONMENT VARIABLES

Create `.env.local.example` with:

```bash
# ── Supabase ─────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=                    # server-only

# ── Groq ─────────────────────────────────────────────
GROQ_API_KEY=
GROQ_MODEL_REASONING=llama-3.3-70b-versatile  # advisor explanations
GROQ_MODEL_FAST=llama-3.1-8b-instant          # transaction classification

# ── Firecrawl ────────────────────────────────────────
FIRECRAWL_API_KEY=                            # leave empty if self-hosted
FIRECRAWL_BASE_URL=https://api.firecrawl.dev  # or http://localhost:3002 if self-hosted

# ── Inngest ──────────────────────────────────────────
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
INNGEST_DEV=1                                  # 1 in dev, unset in prod

# ── Upstash Redis ────────────────────────────────────
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ── Site ─────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ── Optional (later) ─────────────────────────────────
RESEND_API_KEY=
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
```

---

## 11. PAGE-BY-PAGE MIGRATION PLAN

For every page below: **the rendered output stays pixel-identical**. Only the data source changes.

### 11.1 `/` (Home) — `app/page.tsx`

- **Currently:** Server Component composing `HeroSection`, `FeaturedCardsSection`, etc.
- **Change:** `components/home/featured-cards-section.tsx` and `components/home/hero-section.tsx` currently call `getPopularCards()` synchronously. Convert to Server Components (remove `"use client"` if it works without it — they likely use motion which needs client). If they need to stay client, refactor to receive `popularCards` as a prop and fetch in the parent Server Component.
- **Data source:** `await getPopularCards()` from `lib/db/cards.ts`.
- **Allow:** ISR with `export const revalidate = 3600` on the home page (1 hour).

### 11.2 `/cards` — `app/cards/page.tsx`

- **Currently:** `"use client"` with all filter logic in client memo.
- **Change strategy:** Split into two files.
  - `app/cards/page.tsx` becomes Server Component: fetches all active cards once, passes to client component.
  - Move the existing filter/sort UI into `app/cards/cards-page-client.tsx` — content unchanged, just receives `initialCards: CreditCard[]` prop instead of importing static data.
- **SEO win:** First paint includes all cards in HTML.
- **Data source:** `await getAllCards()` (server-side).

### 11.3 `/cards/[id]` — `app/cards/[id]/page.tsx` & `card-details-client.tsx`

- **Currently:** Server `page.tsx` with `generateStaticParams` over static array; client component for tabs/animations.
- **Change:**
  - `generateStaticParams` queries Supabase: returns slug list.
  - Add `export const revalidate = 86400` (1 day) for ISR.
  - `getCardById(id)` reads slug from DB.
  - Pass `card` and the new `CardExtended` (with reward rules etc.) as separate props if the detail UI needs to display rules/exclusions/milestones in their own sections — **but only if the existing JSX already has placeholder sections for these**. Check the existing JSX first; if no slot exists, do not add new ones. The README's later "Differentiating Features" section (§18) covers when to add these UI slots.

  show similar card recommendation, when i click on any card.

### 11.4 `/compare` — `app/compare/page.tsx`

- **Currently:** Client component, URL state via `?cards=id1,id2`, reads from static array.
- **Change:**
  - Replace `getCardById` import with the async DB version. Wrap in TanStack Query `useQuery`.
  - Add a **new column** in the comparison feature list: `Net Annual Value` — this requires a small UI tweak (one row added to the existing `comparisonFeatures` array on line 36). **This is the only allowed compare-page UI addition.** The row uses the same row-rendering logic as existing rows; it doesn't change layout.
  - Net value comes from `POST /api/compare/value` with the user's spending profile (default 50K/mo evenly split if no profile saved).

### 11.5 `/dashboard` — `app/dashboard/page.tsx`

- **Currently:** Hardcoded `userCards`, `spendingData`, `categorySpending`, `recentTransactions`, `upcomingPayments`, `stats`.
- **Change strategy:**
  - Convert to thin server wrapper that fetches the data, passes to existing client component (rename current to `dashboard-page-client.tsx`).
  - All hardcoded arrays become props: `userCards`, `spendingData`, `categorySpending`, `recentTransactions`, `upcomingPayments`, `stats`.
  - **The shape of each prop must match what the existing component expects exactly** — same field names, same types.
- **Data sources** (Server Component fetches):
  - `userCards`: `getUserCards(userId)` joining `user_cards` + `cards`
  - `spendingData`: aggregate `transactions` last 6 months grouped by month
  - `categorySpending`: aggregate `transactions` last 30 days by category
  - `recentTransactions`: `transactions` last 5 ordered by `txn_date desc`
  - `upcomingPayments`: `card_payments` where `paid_at is null and due_date >= today`
  - `stats`: computed from above
- **Empty state:** if user has no `user_cards`, render the existing UI but with zeroed stats and an empty array — the UI already has empty handling.
- **Auth:** redirect to `/auth/sign-in` if no session.

### 11.6 `/advisor` — `app/advisor/page.tsx`

- **Currently:** 3-step flow, mock scoring on category overlap + rating.
- **Change:**
  - Step 1 + Step 2 forms unchanged.
  - `handleAnalyze` (line 56) replaces simulation timeout with: `await fetch('/api/advisor/recommend', { method: 'POST', body: JSON.stringify(profile) })`.
  - The response shape must include `recommendations: CreditCard[]` (existing UI consumes this) **plus** an optional `explanations: Record<string, string>` keyed by card id. If the UI doesn't have a slot for explanations yet, store the explanations in client state for later use; UI stays the same.
  - Anonymous users allowed; if signed in, save to `advisor_sessions`.

### 11.7 `/analyzer` — `app/analyzer/page.tsx`

- **Currently:** "Use Demo Data" button → static `mockAnalysis`.
- **Change strategy:**
  - Keep the "Use Demo Data" button — it's useful for unauthenticated previews. Wire it to a route that returns the static demo data (`GET /api/analyzer/demo`).
  - The dropzone above it: implement file upload → `POST /api/analyzer/upload` → returns `runId` → poll `GET /api/analyzer/status?runId=...` until `status === 'ready'` → render same `mockAnalysis`-shaped object.
  - The result object's shape must match existing `mockAnalysis` in `app/analyzer/page.tsx` lines 25-76 exactly so the UI binding doesn't change.
- **Auth:** uploaded statements require auth; demo mode does not.

---

## 12. SERVER ACTIONS & API ROUTES

### 12.1 Naming and Patterns

- Use **Route Handlers** (`app/api/.../route.ts`) for endpoints called from client components or external systems.
- Use **Server Actions** (`'use server'` functions in `lib/db/*`) for invocations from Server Components or forms.
- Every POST validates input with Zod.
- Every endpoint uses Supabase server client with cookies (RLS enforced) unless explicitly using service role for admin tasks.

### 12.2 Endpoint Contracts

#### `POST /api/advisor/recommend`

**Request:**
```ts
z.object({
  shopping: z.number().min(0).max(100),
  travel: z.number().min(0).max(100),
  fuel: z.number().min(0).max(100),
  dining: z.number().min(0).max(100),
  monthlySpend: z.number().min(0),
  preferFreeCards: z.boolean(),
  needsLoungeAccess: z.boolean(),
})
```

**Response:**
```ts
{
  sessionId: string,
  recommendations: CreditCard[],            // top 4
  explanations: Record<string, string>,     // keyed by card slug
  scores: Record<string, {                  // for transparency / future UI
    netAnnualValue: number,                 // rupees, after fee
    expectedAnnualReward: number,
    reasonsHighlight: string[]
  }>
}
```

**Behavior:**
1. Validate input.
2. Filter cards by eligibility: `monthly_spend * 12 >= min_income * 0.8` (heuristic), `fee` filters per `preferFreeCards`, `lounge` per `needsLoungeAccess`.
3. For each candidate, compute deterministic score (§14).
4. Take top 8 by net value, send to Groq for one-line explanation per card.
5. Cache result for 24h keyed by hash(input).
6. Save to `advisor_sessions` if user is authenticated.

#### `POST /api/analyzer/upload`

**Request:** `FormData` with `file: File` (PDF, max 10MB).

**Response:** `{ runId: string }`.

**Behavior:**
1. Require auth.
2. Rate limit: 5 uploads / day / user.
3. Upload to `statements/{userId}/{runId}/{filename}`.
4. Insert `analyzer_runs` row with `status: 'queued'`.
5. Fire Inngest event `analyzer.statement.uploaded` with `{ runId, filePath, userId }`.
6. Return `runId`.

#### `GET /api/analyzer/status?runId=...`

Returns the `analyzer_runs` row. When `status === 'ready'`, payload includes the full insights object the UI binds.

#### `POST /api/compare/value`

**Request:**
```ts
{ cardSlugs: string[]; spendingProfile?: SpendingProfile }
```

**Response:**
```ts
{ values: Record<string, { netValue: number; rewardValue: number; fee: number }> }
```

#### `POST /api/cards/add`

Adds a card to user's portfolio. Requires auth.
```ts
Request: { cardSlug: string, lastFour: string, statementDay: number, dueDay: number, creditLimit: number, nickname?: string }
Response: { userCardId: string }
```

#### `GET /api/dashboard/overview`

Returns the data shape needed by `app/dashboard/page.tsx` (see §11.5).

#### `GET /api/offers/for-user`

Returns `offers` filtered to those applicable to the current user's cards.

---

## 13. GROQ AI INTEGRATION

### 13.1 Client Wrapper

`lib/ai/groq.ts` exports:

```ts
async function complete<T>(opts: {
  system: string;
  user: string;
  schema: ZodSchema<T>;       // forces structured JSON output
  model?: 'reasoning' | 'fast';
  maxRetries?: number;
}): Promise<T>
```

- Validates output with Zod; retries on parse failure (up to 2).
- Logs latency, token usage, model to console (Helicone integration in Phase 3).
- Uses `GROQ_MODEL_REASONING` for advisor; `GROQ_MODEL_FAST` for classification.

### 13.2 Where Groq Is Used

| Use case | Module | Model | Frequency |
|---|---|---|---|
| Advisor explanations (per card) | `lib/ai/advisor.ts` | reasoning | Per recommend call (cached 24h) |
| Transaction classification | `lib/ai/classifier.ts` | fast | Per uploaded transaction batch |
| Statement parsing (semi-structured → structured) | `lib/ai/statement-parser.ts` | reasoning | Per uploaded statement |
| Offer extraction from scraped HTML | `lib/scraping/extractors/*` | fast | Per scrape job |
| Analyzer insights generation | `lib/ai/analyzer-insights.ts` | reasoning | Per analyzer run |

### 13.3 Prompt Design Principles

- **Always force JSON output** with a Zod schema.
- **Pass structured context** (card data as JSON) — don't ask Groq to "know" cards.
- **Constrain answers** — for advisor explanations, ask for ≤2 sentences max, factual, no marketing fluff.
- **No financial advice claims** — every LLM-facing response includes "informational only, verify with bank" disclaimer in metadata.

### 13.4 Example: Advisor Explanation Prompt

```
SYSTEM: You are a credit card analyst. Given a card's structured data and a user's spending profile, produce a 2-sentence explanation of why this card is recommended (or not). Be specific with rupee values. Never invent benefits not in the data. Output JSON: {"explanation": string, "estimatedAnnualReward": number}.

USER: Card: {json}
User profile: {json}
Computed annual reward (do not contradict): ₹{number}
```

Schema:
```ts
z.object({
  explanation: z.string().min(20).max(300),
  estimatedAnnualReward: z.number().nonnegative()
})
```

### 13.5 Fallback

If Groq is down or rate-limited, the advisor returns the deterministic top-N result with a generic explanation: `"Net annual value: ₹X based on your spending profile. View details for breakdown."`. The UI never breaks.

---

## 14. NET ANNUAL VALUE ENGINE (DETERMINISTIC)

This is **the differentiating math** that no Indian competitor does well. It must be deterministic, fast, and accurate. No LLM in the loop.

### 14.1 Algorithm

```ts
// lib/ai/scoring.ts — pseudocode

type SpendingProfile = {
  shopping: number;     // % of monthlySpend
  travel: number;
  fuel: number;
  dining: number;
  // (other = 100 - sum of above)
  monthlySpend: number; // rupees
};

function computeNetAnnualValue(card: CardExtended, profile: SpendingProfile) {
  const monthlySpendByCategory = {
    shopping_online: profile.monthlySpend * (profile.shopping / 100),
    travel: profile.monthlySpend * (profile.travel / 100),
    fuel: profile.monthlySpend * (profile.fuel / 100),
    dining: profile.monthlySpend * (profile.dining / 100),
    other: profile.monthlySpend * ((100 - profile.shopping - profile.travel - profile.fuel - profile.dining) / 100),
  };

  let monthlyReward = 0;
  for (const [cat, amount] of Object.entries(monthlySpendByCategory)) {
    if (card.exclusions.includes(cat)) continue;        // category excluded entirely
    const rule = card.rewardRules.find(r => r.category === cat);
    const ratePct = rule?.ratePct ?? card.baseRewardRate;
    const cap = rule?.monthlyCap ?? Infinity;
    const earnedThisCategory = Math.min(amount * (ratePct / 100), cap);
    monthlyReward += earnedThisCategory;
  }

  // Apply overall monthly cap if set
  if (card.rewardCappingMonthly) {
    monthlyReward = Math.min(monthlyReward, card.rewardCappingMonthly);
  }

  // Convert points to rupees if applicable
  if (card.rewardType === 'points' && card.pointValuePaise) {
    // monthlyReward is in "rupee value of points earned"; rate already implies rupee return
    // pointValuePaise modifies if rate is in points-per-100 vs %
    // For now, assume reward_rules.ratePct stores effective % return after point valuation
  }

  let annualReward = monthlyReward * 12;

  // Add milestone benefits if the user's annual spend triggers them
  const annualSpend = profile.monthlySpend * 12;
  for (const ms of card.milestones) {
    if (annualSpend >= ms.spendThreshold) annualReward += ms.rewardValue;
  }

  // Subtract fee (assume joining fee waived after year 1)
  const effectiveFee = card.annualFee;
  // BUT: if annual_fee_waiver_spend exists and annualSpend meets it, fee = 0
  const fee = (card.annualFeeWaiverSpend && annualSpend >= card.annualFeeWaiverSpend) ? 0 : effectiveFee;

  return {
    expectedAnnualReward: Math.round(annualReward),
    fee,
    netAnnualValue: Math.round(annualReward - fee),
  };
}
```

### 14.2 Critical: Reward Rules Must Be Curated, Not Inferred

A separate manual seed script (`scripts/seed-reward-rules.ts`) populates `card_reward_rules` with hand-verified accelerated categories per card. Example for HDFC Infinia:

```ts
{
  cardSlug: 'hdfc-infinia',
  rules: [
    { category: 'smartbuy', ratePct: 10, monthlyCap: 15000, notes: 'SmartBuy 10X' },
    { category: 'shopping_online', ratePct: 3.3, monthlyCap: null },
    { category: 'dining', ratePct: 3.3, monthlyCap: null },
    // base rate 3.3% otherwise (already in cards.base_reward_rate)
  ],
  exclusions: ['rent', 'wallet', 'fuel', 'government', 'education', 'insurance'],
}
```

This is editorial work, not automated. Spend a day curating the 13 existing cards before launch.

### 14.3 Trust Signal in UI

The card detail page already shows a "Quick Facts" sidebar. **Without changing the JSX**, hydration adds `dataLastVerifiedAt` so any future UI slot can render it. For now, surface in `<meta>` tags for SEO.

---

## 15. STATEMENT UPLOAD PIPELINE (ANALYZER)

### 15.1 Pipeline Stages

```
[User uploads PDF]
       ↓
POST /api/analyzer/upload
       ↓
[Supabase Storage] ← writes file
       ↓
[Insert analyzer_runs row, status='queued']
       ↓
[Fire Inngest event 'analyzer.statement.uploaded']
       ↓
─── Inngest Worker (lib/jobs/parse-statement.ts) ───
       ↓
   1. Download PDF from Storage
   2. Extract text via unpdf (fall back to pdf-parse on failure)
   3. status = 'parsing'
   4. Send extracted text to Groq with statement-extract prompt
      → returns array of { date, merchant, amount, raw }
   5. status = 'classifying'
   6. Batch-classify merchants → categories via classifier prompt
   7. Insert into transactions (linked to user_card_id chosen by user OR a synthetic 'analyzer_temp')
   8. Compute analyzer_runs aggregates:
      - total_spend, total_rewards (using each card's rules)
      - category_breakdown
      - efficiency score: actual_rewards / max_possible_rewards
      - generate insights (LLM call: "Given this breakdown, what 3-5 optimizations?")
   9. status = 'ready', completed_at = now()
       ↓
[Client polls /api/analyzer/status]
       ↓
[Render results in existing UI]
```

### 15.2 Privacy Constraints

- Original PDF retained for 7 days max, then auto-deleted by a daily Inngest job.
- Card numbers in transactions stored as `last_four` only — strip during extraction.
- Never log raw statement contents.

### 15.3 Demo Mode

`/api/analyzer/demo` returns a fixed JSON matching the `mockAnalysis` shape — used by the "Use Demo Data" button for unauthenticated users.

---

## 16. OFFER SCRAPING ARCHITECTURE (FIRECRAWL + INNGEST)

### 16.1 Targets

Curated list in `lib/scraping/targets.ts`:

```ts
export const SCRAPE_TARGETS = [
  { merchant: 'amazon', url: 'https://www.amazon.in/b?node=18316023031', extractor: 'amazon' },
  { merchant: 'flipkart', url: 'https://www.flipkart.com/offers-store', extractor: 'flipkart' },
  { merchant: 'swiggy', url: 'https://www.swiggy.com/offers-near-me', extractor: 'swiggy' },
  { merchant: 'makemytrip', url: 'https://www.makemytrip.com/offers/', extractor: 'generic' },
  { merchant: 'myntra', url: 'https://www.myntra.com/offers', extractor: 'generic' },
  // Expand carefully — each target needs validation
]
```

**Do NOT scrape bank websites for card terms** — gray area legally and they change rarely. Manual verification is more reliable.

### 16.2 Pipeline

```
[Inngest cron: every 6 hours]
       ↓
   For each target:
     1. scrape_runs row inserted (status='running')
     2. Firecrawl fetches the page (markdown mode preferred)
     3. Send markdown to Groq with offer-extract prompt
        → Returns array of structured offers
     4. For each offer:
        - Compute source_hash = sha256(merchant + title + valid_until)
        - Upsert into offers (on conflict do update is_active, scraped_at)
     5. Mark scrape_runs status='success' with counts
```

### 16.3 Extractor Prompt (Groq)

```
SYSTEM: Extract bank/card offers from this merchant page markdown. Output a JSON array with each item:
{
  "title": string,
  "description": string,
  "applicableIssuers": string[],   // ['HDFC', 'ICICI'] etc.
  "applicableNetworks": ('visa'|'mastercard'|'amex'|'rupay')[],
  "discountType": 'flat'|'percent'|'cashback'|'instant',
  "discountValue": number,
  "minTxnAmount": number | null,
  "maxDiscount": number | null,
  "validFrom": string | null,    // ISO date
  "validUntil": string | null,
}
Skip non-card promotions. Return [] if none found.
```

### 16.4 Surfacing Offers in UI

- Dashboard: optional "Offers for your cards" section — only added later if `app/dashboard/page.tsx` already has a slot for it (it doesn't currently; skip in Phase 1).
- Card detail page: future "Active Offers" tab (Phase 3).

---

## 17. BACKGROUND JOBS

All scheduled work runs on Inngest. Functions live in `lib/jobs/*.ts` and are registered via `app/api/inngest/route.ts`.

| Job | Trigger | Purpose |
|---|---|---|
| `scrapeOffers` | cron `0 */6 * * *` | Refresh offers from all targets |
| `parseStatement` | event `analyzer.statement.uploaded` | Pipeline §15 |
| `cleanupOldStatements` | cron `0 2 * * *` | Delete `statements/*` older than 7 days |
| `expireOldOffers` | cron `0 3 * * *` | Mark `offers.is_active = false` where `valid_until < today` |
| `refreshCardData` | cron `0 4 * * 0` (weekly) | Print cards with `data_last_verified_at < 60 days ago` for editorial review |
| `computeRewardExpiry` | cron `0 9 * * *` (daily 9 AM IST) | (Phase 3) Send notifications for expiring rewards |

---

## 18. DIFFERENTIATING FEATURES (BEYOND MIGRATION)

These are added **without changing existing UI** by either:
- Creating new routes
- Or adding minimal slots to existing UI **only if** there's a natural insertion point in the current JSX.

The user has explicitly approved this list. Order = priority.

### 18.1 ⭐ Net Annual Value in Compare (Phase 1)

- New row added to `comparisonFeatures` array on `app/compare/page.tsx` line 36.
- Backend in §14.
- Default profile: ₹50K/mo, 25% each across 4 cats.
- One row only — not a redesign.

### 18.2 ⭐ Verified Data Badge (Phase 1)

- The card detail page's existing "Quick Facts" card already has rows. Add ONE row for "Last verified: {date}" only if the existing rendering pattern supports it without restructuring.
- Hydrated from `cards.data_last_verified_at`.

### 18.3 ⭐ Real Statement Analyzer (Phase 2)

- §15. The UI already exists — only the data flow changes.

### 18.4 ⭐ Offer Aggregation (Phase 2)

- New page `app/offers/page.tsx` (use existing UI components — `Card`, `Badge` — for layout consistent with rest of site).
- Add to header navigation? **NO** — header stays unchanged. Surface offers via:
  - A future dashboard slot (when added)
  - Direct URL only for now: `/offers`

### 18.5 ⭐ Card-Use Optimizer (Phase 3)

The single most viral feature. Build as new route `/optimizer`:
- Form: merchant name + amount + select user's cards
- Output: ranked list of which card gives best return for this transaction
- Backend: query rules table per card, apply caps based on user's month-to-date usage from `transactions`
- Browser extension and WhatsApp bot are post-launch.

### 18.6 Reward Expiry Tracker (Phase 3)

- Background job (§17) computes expiry per user_card.
- Surface as new route `/rewards/expiry` and via email (Resend).

### 18.7 Eligibility Pre-Check (Phase 3)

- Form on `/eligibility` route: income, employment, city, age, credit score (or skip).
- Returns each card with status: `eligible | borderline | ineligible`.
- Filter chip on `/cards` page (added to existing filter sidebar — only if there's room — otherwise standalone page).

### 18.8 Verified Reviews (Phase 3)

- `reviews` table is already in schema.
- Build review submission UI on a new route; reviews show on card detail's existing "Reviews" tab (if present) or skip until UI slot exists.

### 18.9 Methodology / Trust Page (Phase 1)

- New static route `/methodology` — explains how data is verified, how net value is calculated, how the AI advisor works. Plain markdown rendering, uses existing `Card` UI primitives.

---

## 19. IMPLEMENTATION PHASES

Execute in strict order. Each phase ships a working app.

### PHASE 1 — Foundation (data + auth) [~1 week]

**Goal:** Static data fully replaced; auth works; existing pages render from DB with no UI change.

1. Install dependencies (§4).
2. Create `.env.local` from example.
3. Create Supabase project. Run migrations from §6 in order.
4. Create storage buckets and RLS policies (§7, §8).
5. Build `lib/db/client.ts`, `server.ts`, `admin.ts`.
6. Write `scripts/seed-cards.ts` — reads existing `lib/data/cards.ts` exports, transforms to new schema, writes to Supabase. Uploads any local images from `supabase/seed/seed-images/{slug}.webp`.
7. Write `scripts/seed-reward-rules.ts` — manually-curated rules per card.
8. Build `lib/db/cards.ts` with the same exported function names; hydrate to UI shape.
9. Update all 8 importers (§3.3) to use the new module. **Verify pixel-identical render.**
10. Build auth pages under `app/auth/*`. Wire "Get Started" button.
11. Build `middleware.ts` for protected routes.
12. Add `/methodology` route.
13. Add Net Annual Value row to compare page (§18.1).

**Validation:** Visit every page. Screenshot before & after migration; UI must be identical except the new "Net Annual Value" row in compare.

### PHASE 2 — Real functionality (advisor, analyzer, dashboard) [~2 weeks]

**Goal:** All buttons in the UI do real things. Mock data replaced with real user data.

1. Build deterministic scoring engine (`lib/ai/scoring.ts`).
2. Set up Groq client + prompt files. Test each prompt locally.
3. Build `POST /api/advisor/recommend`. Wire the existing 3-step advisor flow.
4. Build dashboard server wrapper + data queries. Wire all 6 props (`userCards`, `spendingData`, etc.). Empty state for new users.
5. Build "Add Card" flow (`POST /api/cards/add`). The "Add New Card" button on dashboard already links to `/cards`; add a follow-up `/cards/[id]/add` micro-flow that posts to the API.
6. Set up Inngest (`lib/jobs/client.ts`, `app/api/inngest/route.ts`).
7. Build statement upload pipeline (§15). Wire analyzer page.
8. Build TanStack Query provider, wrap layout (in a provider component that wraps `{children}` inside `ThemeProvider` — header/footer placement unchanged).

**Validation:** Sign up → add a card → upload a sample statement → see real insights. Run advisor with different profiles → recommendations change meaningfully.

### PHASE 3 — Differentiators (offers, optimizer, expiry) [~2 weeks]

1. Set up Firecrawl integration. Test scraping one merchant locally.
2. Build offer extractors + Inngest scrape job. Run for first time, populate `offers`.
3. Build `/offers` page.
4. Build `/optimizer` page (§18.5).
5. Build reward expiry tracker (§18.6).
6. Build eligibility pre-check (§18.7).
7. Add Sentry, PostHog, Helicone before launch.

**Validation:** End-to-end test from signup to using optimizer. Soft-launch to fintech communities (Reddit, Twitter).

---

## 20. VALIDATION CHECKLIST

Run these checks at the end of each phase. Do not advance until all pass.

### Phase 1

- [ ] `pnpm dev` runs without errors
- [ ] Home page shows 6 popular cards from DB (not from `lib/data/cards.ts`)
- [ ] `/cards` filtering, sort, search work identically to before
- [ ] `/cards/[slug]` for every card from DB renders identical UI
- [ ] `/compare` works with `?cards=` URL param
- [ ] `/compare` shows new "Net Annual Value" row
- [ ] "Get Started" button navigates to `/auth/sign-in`
- [ ] Sign-up flow completes; row inserted in `profiles`
- [ ] `/dashboard` redirects to sign-in when logged out
- [ ] No `lib/data/cards.ts` imports remain in `app/` or `components/`
- [ ] Diff `git diff components/ app/page.tsx app/cards/[id]/card-details-client.tsx` — no JSX changes (only import lines)

### Phase 2

- [ ] Advisor returns different cards for different profiles (not always the same top 4)
- [ ] Advisor explanations are card-specific and reference user's spending
- [ ] Dashboard with no cards shows zeros (no crash)
- [ ] Dashboard with cards shows real spending data
- [ ] Statement upload: PDF → row in `analyzer_runs` → transactions appear → insights render
- [ ] Adding the same card twice with different last-four works
- [ ] RLS test: User A cannot read User B's `user_cards` (test with two accounts)

### Phase 3

- [ ] Scrape job populates `offers` table
- [ ] Optimizer returns correct best card for sample transactions
- [ ] Expiry tracker computes correct dates

---

## 21. DEPLOYMENT NOTES

- **Hosting:** Vercel (Next.js) + Supabase managed Postgres + Inngest cloud. All have free tiers.
- **Domain:** Configure custom domain in Vercel; update `NEXT_PUBLIC_SITE_URL`.
- **Secrets:** Add all env vars in Vercel project settings. **Never commit `.env.local`.**
- **DB migrations on deploy:** run via Supabase CLI in CI, or apply manually before deploy until you have a CI pipeline.
- **Robots/SEO:** Add `app/robots.ts` and `app/sitemap.ts` — sitemap dynamically lists all card slugs from DB.
- **Rate limits:** apply Upstash ratelimit to `/api/advisor/recommend`, `/api/analyzer/upload`, `/api/compare/value`. 30 req/min/user.
- **Analytics:** Vercel Analytics already wired (production only) — leave as is.

---

## APPENDIX A — Quick Reference for Common Tasks

### A.1 Add a new card to the catalog

1. Edit `scripts/seed-cards.ts` to include the new card (or insert directly via Supabase dashboard).
2. Add reward rules in `scripts/seed-reward-rules.ts`.
3. Drop image `seed-images/{slug}.webp`.
4. Run `pnpm tsx scripts/seed-cards.ts`.
5. Verify on `/cards`.

### A.2 Update card data verification timestamp

```sql
update cards set data_last_verified_at = now() where slug = 'hdfc-infinia';
```

Run weekly editorial sweep — see §17 `refreshCardData`.

### A.3 Test a Groq prompt locally

`scripts/test-prompts.ts` (create as needed) — runs a single prompt with sample input, prints output and Zod parse result.

### A.4 Where to add a new page

1. Create `app/{route}/page.tsx`.
2. If interactive, split into Server (data fetch) + Client (interaction).
3. Use `Card`, `Badge`, `Button` from `components/ui/*` to match site visual identity.
4. Do NOT add to header navigation unless absolutely necessary — keep header at 6 items.

---

## APPENDIX B — Files That Must Not Be Modified

This is the **strict do-not-touch list**:

```
components/cards/card-grid-item.tsx
components/cards/card-filters.tsx
components/cards/credit-card-visual.tsx
components/home/category-section.tsx
components/home/cta-section.tsx
components/home/featured-cards-section.tsx     ← only the data import line may change
components/home/hero-section.tsx               ← only the data import line may change
components/home/how-it-works-section.tsx
components/home/stats-section.tsx
components/layout/footer.tsx
components/layout/header.tsx                   ← only the "Get Started" button gets href
components/theme-provider.tsx
components/ui/*                                ← entire folder
app/globals.css
app/layout.tsx
styles/*
```

Every JSX expression, Tailwind class, animation prop, and copy string in these files is locked.

---

## APPENDIX C — Key Decisions Already Made (Do Not Re-Litigate)

- **Money:** integer rupees for card fees, bigint paise for transactions.
- **`card.id` in UI = `cards.slug` in DB.** Internal uuid `cards.id` is used only for joins.
- **Static `lib/data/cards.ts` stays in repo as fallback** for now. Remove after Phase 2 once DB is the only source.
- **Card images:** Supabase Storage `card-images` bucket, public, naming `cards/{slug}.webp`. Gradient fallback via existing `cardColor` field.
- **Card ratings/reviews:** existing `rating` and `review_count` on cards table are placeholder until real reviews flow ships in Phase 3. Display them but document on `/methodology` that they're aggregated estimates.
- **Auth:** Supabase Auth with email magic link primary, phone OTP optional.
- **AI provider:** Groq primary, no fallback in Phase 1 (acceptable; degrade gracefully to deterministic-only).
- **No bank API integration** in any phase — Account Aggregator is post-v1.
- **No bill payment** ever — out of scope.

---

## APPENDIX D — Cost-Aware Defaults

- Cache every Groq response by input hash for 24h (advisor) or 7d (offer extraction).
- Rate limit aggressively: advisor 30/day/user, analyzer 5/day/user.
- Use `GROQ_MODEL_FAST` (Llama 3.1 8B) for classification; reserve `GROQ_MODEL_REASONING` (Llama 3.3 70B) for explanations and statement parsing.
- Inngest free tier: 50K runs/month — sufficient for early users.
- Upstash Redis free tier: 10K commands/day — sufficient.
- Supabase free tier: 500MB DB, 1GB Storage — fine for 13-100 cards + a few hundred users.

---

**END OF SPEC.** Build phase 1 first. Validate. Then phase 2. Do not skip ahead. Do not modify locked UI files.
