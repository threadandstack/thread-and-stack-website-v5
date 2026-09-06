ALTER TABLE public.build_updates_cache ADD COLUMN IF NOT EXISTS og_image_url text;
ALTER TABLE public.events_cache ADD COLUMN IF NOT EXISTS og_image_url text;