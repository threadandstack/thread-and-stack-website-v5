CREATE TABLE public.build_updates_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notion_id text NOT NULL UNIQUE,
  slug text NOT NULL,
  title text NOT NULL,
  build_name text,
  build_slug text,
  version text,
  description text,
  intro text,
  html_content text NOT NULL DEFAULT '',
  header_image_url text,
  reading_time text,
  theme text,
  published_date date,
  featured boolean NOT NULL DEFAULT false,
  last_edited_time timestamptz,
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.build_updates_cache TO anon;
GRANT SELECT ON public.build_updates_cache TO authenticated;
GRANT ALL ON public.build_updates_cache TO service_role;

ALTER TABLE public.build_updates_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read build updates"
  ON public.build_updates_cache FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage build updates"
  ON public.build_updates_cache FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX build_updates_cache_build_slug_idx ON public.build_updates_cache (build_slug);
CREATE INDEX build_updates_cache_last_edited_idx ON public.build_updates_cache (last_edited_time DESC);