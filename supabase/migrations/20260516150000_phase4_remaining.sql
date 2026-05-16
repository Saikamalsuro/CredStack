-- Phase 4 / Phase 2-3 remaining items.
-- Adds review votes, expert reviews, and helpful-count RPCs.

create table if not exists public.card_review_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  review_id uuid not null references public.reviews(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, review_id)
);

create index if not exists idx_review_votes_review on public.card_review_votes(review_id);

alter table public.card_review_votes enable row level security;

create policy "votes_public_read" on public.card_review_votes
  for select to anon, authenticated using (true);
create policy "votes_owner_insert" on public.card_review_votes
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "votes_owner_delete" on public.card_review_votes
  for delete to authenticated using (user_id = (select auth.uid()));

create table if not exists public.expert_reviews (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  reviewer_name text not null,
  reviewer_title text,
  body text not null,
  rating numeric(2,1) check (rating >= 1 and rating <= 5),
  pros text[] default '{}',
  cons text[] default '{}',
  use_case text,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (card_id, reviewer_name)
);

create index if not exists idx_expert_reviews_card on public.expert_reviews(card_id);

alter table public.expert_reviews enable row level security;

create policy "expert_reviews_public_read" on public.expert_reviews
  for select to anon, authenticated using (true);

create or replace function public.increment_helpful_count(p_review_id uuid)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  update public.reviews set helpful_count = coalesce(helpful_count, 0) + 1 where id = p_review_id;
$$;

create or replace function public.decrement_helpful_count(p_review_id uuid)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  update public.reviews set helpful_count = greatest(0, coalesce(helpful_count, 0) - 1) where id = p_review_id;
$$;

grant execute on function public.increment_helpful_count(uuid) to authenticated;
grant execute on function public.decrement_helpful_count(uuid) to authenticated;
