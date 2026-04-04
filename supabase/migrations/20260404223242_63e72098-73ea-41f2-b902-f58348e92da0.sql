CREATE TABLE public.portfolio_content_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notion_page_id text NOT NULL UNIQUE,
  name text NOT NULL,
  html_content text NOT NULL,
  cover_image text,
  tags text[] DEFAULT '{}',
  month_year text,
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_content_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.portfolio_content_cache
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow service role insert/update" ON public.portfolio_content_cache
  FOR ALL TO service_role USING (true) WITH CHECK (true);