# Supabase Migrations

Migrations applied to the shared CredStack Supabase project (`vmamruspuqtapyfloevy`).

## Workflow

1. Author migration as `YYYYMMDDHHMMSS_name.sql` in this directory.
2. Apply via Supabase MCP (`apply_migration`) or `supabase db push`.
3. Commit the file in the same PR as related code changes.

The shared Supabase project is the source of truth; migrations here track
what has been applied so any teammate can reproduce the schema.
