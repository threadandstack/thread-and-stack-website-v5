
-- Enable extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- blog_content_cache: pre-rendered HTML for blog posts
CREATE TABLE public.blog_content_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notion_id text NOT NULL UNIQUE,
  slug text NOT NULL,
  title text NOT NULL,
  html_content text NOT NULL,
  header_image_url text,
  description text,
  reading_time text,
  theme text,
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_content_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blog content cache"
  ON public.blog_content_cache FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can manage blog content cache"
  ON public.blog_content_cache FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- portfolio_listing_cache: listing metadata for portfolio gallery
CREATE TABLE public.portfolio_listing_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  database_id text NOT NULL,
  notion_page_id text NOT NULL UNIQUE,
  name text NOT NULL,
  tags text[] DEFAULT '{}'::text[],
  text text,
  month_year text,
  date date,
  cover_image text,
  has_nda boolean NOT NULL DEFAULT false,
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_listing_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read portfolio listing cache"
  ON public.portfolio_listing_cache FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can manage portfolio listing cache"
  ON public.portfolio_listing_cache FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- sync_metadata: tracks last sync timestamp per content type
CREATE TABLE public.sync_metadata (
  sync_type text PRIMARY KEY,
  last_synced_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sync_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage sync metadata"
  ON public.sync_metadata FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed initial sync types
INSERT INTO public.sync_metadata (sync_type, last_synced_at)
VALUES
  ('blog', '2000-01-01T00:00:00Z'),
  ('portfolio', '2000-01-01T00:00:00Z');
