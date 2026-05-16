-- Lounge visit tracking. RLS-scoped to owner.

create table if not exists public.user_lounge_visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  user_card_id uuid not null references public.user_cards(id) on delete cascade,
  visit_date date not null,
  lounge_name text not null,
  visit_type text not null check (visit_type in ('domestic','international')),
  guest_count integer default 0 check (guest_count >= 0),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_lounge_visits_user on public.user_lounge_visits(user_id);
create index if not exists idx_lounge_visits_user_card on public.user_lounge_visits(user_card_id);
create index if not exists idx_lounge_visits_visit_date on public.user_lounge_visits(visit_date desc);

alter table public.user_lounge_visits enable row level security;

create policy "lounge_visits_owner_read"
  on public.user_lounge_visits
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "lounge_visits_owner_insert"
  on public.user_lounge_visits
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "lounge_visits_owner_delete"
  on public.user_lounge_visits
  for delete
  to authenticated
  using (user_id = (select auth.uid()));
