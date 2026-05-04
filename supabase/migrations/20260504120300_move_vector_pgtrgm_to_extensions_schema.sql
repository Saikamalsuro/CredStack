-- Move vector and pg_trgm extensions out of the public schema (extension_in_public
-- advisor). OIDs are preserved so existing types (cards.embedding vector(384)),
-- HNSW index, and trigram GIN index continue to work.

create schema if not exists extensions;
grant usage on schema extensions to anon, authenticated, service_role;

alter extension vector  set schema extensions;
alter extension pg_trgm set schema extensions;

-- Functions referencing extension types/operators need extensions on search_path.
alter function public.fuzzy_match_card(text)
  set search_path = public, extensions, pg_temp;
alter function public.get_similar_card_slugs(text, integer)
  set search_path = public, extensions, pg_temp;
