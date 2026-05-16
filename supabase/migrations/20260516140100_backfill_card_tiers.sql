-- Backfill card.tier based on annual fee + secured indicator.
-- Idempotent: only sets rows where tier is null.

update public.cards set tier = 'secured'::card_tier where slug = 'idfc-wow' and tier is null;

update public.cards
set tier = case
  when annual_fee = 0 or is_lifetime_free = true then 'entry'::card_tier
  when annual_fee <= 600 then 'entry'::card_tier
  when annual_fee <= 2000 then 'lifestyle'::card_tier
  when annual_fee <= 7000 then 'premium'::card_tier
  else 'super_premium'::card_tier
end
where tier is null;
