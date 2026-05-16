-- Debit + prepaid card catalogue (9.2 from ROADMAP).
-- Data seeded separately via scripts/seed-non-credit-cards.ts.

do $$ begin
  create type public.non_credit_card_type as enum ('debit','prepaid');
exception when duplicate_object then null; end $$;

create table if not exists public.non_credit_cards (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  issuer text not null,
  card_type public.non_credit_card_type not null,
  network public.card_network not null,
  annual_fee integer not null default 0,
  joining_fee integer not null default 0,
  forex_markup_pct numeric not null default 0,
  atm_withdrawal_limit_daily integer,
  pos_limit_daily integer,
  key_features text[] not null default '{}',
  linked_account_required boolean not null default true,
  image_url text,
  card_color_gradient text not null default '',
  apply_url text,
  data_pending boolean not null default false,
  data_last_verified_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_noncredit_issuer on public.non_credit_cards(issuer);
create index if not exists idx_noncredit_type on public.non_credit_cards(card_type);

alter table public.non_credit_cards enable row level security;

create policy "noncredit_public_read" on public.non_credit_cards
  for select to anon, authenticated using (is_active = true);
