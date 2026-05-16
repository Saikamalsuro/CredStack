-- Audit pass 3: idempotency stamp for the daily due-reminder cron.
-- After a reminder email is successfully delivered, set last_reminded_on to
-- the IST date. The cron filter then excludes rows already reminded today,
-- making any duplicate firing (manual retry, double cron) a no-op.

alter table public.card_payments
  add column if not exists last_reminded_on date;

create index if not exists card_payments_due_reminder_idx
  on public.card_payments (due_date)
  where paid_at is null;
