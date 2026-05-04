-- Add explicit RLS policies to scrape_runs and scrape_sources to clear the
-- rls_enabled_no_policy advisor while keeping admin-only writes (service_role
-- always bypasses RLS).

-- scrape_sources: source list is config metadata, safe to expose read-only.
create policy "scrape_sources_public_read"
  on public.scrape_sources
  for select
  to anon, authenticated
  using (true);

-- scrape_runs: keep private. Explicit deny clarifies intent and silences advisor.
create policy "scrape_runs_no_public_access"
  on public.scrape_runs
  for select
  to anon, authenticated
  using (false);
