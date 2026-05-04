-- Lock search_path on user-defined functions to prevent schema-hijack attacks
-- (function_search_path_mutable advisor).

alter function public.update_updated_at_column() set search_path = public, pg_temp;
alter function public.fuzzy_match_card(text)        set search_path = public, pg_temp;
