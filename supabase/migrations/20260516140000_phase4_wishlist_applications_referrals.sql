-- Phase 4: card tiers + wishlist + application tracker + referral tracker
-- All user-scoped tables RLS-gated to the owner.

do $$ begin
  create type public.card_tier as enum ('entry','lifestyle','premium','super_premium','secured','student');
exception when duplicate_object then null; end $$;

alter table public.cards
  add column if not exists tier public.card_tier;

create index if not exists idx_cards_tier on public.cards(tier);

-- Wishlists
create table if not exists public.user_wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, card_id)
);

alter table public.user_wishlists enable row level security;

create policy "wishlist_owner_read" on public.user_wishlists
  for select to authenticated using (user_id = (select auth.uid()));
create policy "wishlist_owner_insert" on public.user_wishlists
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "wishlist_owner_update" on public.user_wishlists
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "wishlist_owner_delete" on public.user_wishlists
  for delete to authenticated using (user_id = (select auth.uid()));

-- Application tracker
do $$ begin
  create type public.application_status as enum ('applied','under_review','approved','rejected','received');
exception when duplicate_object then null; end $$;

create table if not exists public.user_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  applied_date date not null,
  status public.application_status not null default 'applied',
  reference_number text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_applications_user on public.user_applications(user_id);
create index if not exists idx_applications_status on public.user_applications(status);

alter table public.user_applications enable row level security;

create policy "applications_owner_read" on public.user_applications
  for select to authenticated using (user_id = (select auth.uid()));
create policy "applications_owner_insert" on public.user_applications
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "applications_owner_update" on public.user_applications
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "applications_owner_delete" on public.user_applications
  for delete to authenticated using (user_id = (select auth.uid()));

create trigger trg_applications_updated_at
  before update on public.user_applications
  for each row execute function public.update_updated_at_column();

-- Referral tracker
do $$ begin
  create type public.referral_status as enum ('pending','credited','rejected');
exception when duplicate_object then null; end $$;

create table if not exists public.user_referrals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  card_id uuid references public.cards(id) on delete set null,
  referred_name text not null,
  expected_bonus integer default 0,
  status public.referral_status not null default 'pending',
  referred_date date not null default current_date,
  credited_date date,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_referrals_user on public.user_referrals(user_id);

alter table public.user_referrals enable row level security;

create policy "referrals_owner_read" on public.user_referrals
  for select to authenticated using (user_id = (select auth.uid()));
create policy "referrals_owner_insert" on public.user_referrals
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "referrals_owner_update" on public.user_referrals
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "referrals_owner_delete" on public.user_referrals
  for delete to authenticated using (user_id = (select auth.uid()));
