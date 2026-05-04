-- Public storage buckets serve files via /object/public/... which bypasses RLS.
-- Broad SELECT policies on storage.objects only enable the LIST API, exposing
-- every file in the bucket. Drop them; direct public URLs continue to work.

drop policy if exists "card_assets_public_read" on storage.objects;
drop policy if exists "card_images_public_read" on storage.objects;
