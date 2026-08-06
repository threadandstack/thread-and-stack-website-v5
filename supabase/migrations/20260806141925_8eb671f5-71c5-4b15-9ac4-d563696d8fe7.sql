ALTER TABLE public.build_updates_cache
  ADD COLUMN IF NOT EXISTS change_types text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS release_type text,
  ADD COLUMN IF NOT EXISTS changelog text;