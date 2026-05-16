-- Phase 4 follow-up: forex card type + verification metadata + expert short summary.
-- Already applied via MCP; this file source-controls the change.

alter type public.non_credit_card_type add value if not exists 'forex';

alter table public.non_credit_cards
  add column if not exists variant text,
  add column if not exists verification_status text default 'verified'
    check (verification_status in ('verified','pending')),
  add column if not exists notes text;

alter table public.expert_reviews
  add column if not exists short_summary text;
