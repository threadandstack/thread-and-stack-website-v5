CREATE TABLE public.events_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notion_id text NOT NULL UNIQUE,
  slug text NOT NULL,
  title text NOT NULL,
  summary text,
  html_content text NOT NULL DEFAULT '',
  cover_image_url text,
  role text,
  format text,
  start_date date,
  end_date date,
  location text,
  venue text,
  organiser text,
  topics text[] NOT NULL DEFAULT '{}',
  event_url text,
  slides_url text,
  recording_url text,
  featured boolean NOT NULL DEFAULT false,
  last_edited_time timestamp with time zone,
  synced_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.events_cache TO anon;
GRANT SELECT ON public.events_cache TO authenticated;
GRANT ALL ON public.events_cache TO service_role;

ALTER TABLE public.events_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are publicly readable"
ON public.events_cache FOR SELECT
USING (true);

CREATE POLICY "Service role manages events"
ON public.events_cache FOR ALL
TO service_role
USING (true) WITH CHECK (true);

CREATE INDEX events_cache_slug_idx ON public.events_cache (slug);
CREATE INDEX events_cache_start_date_idx ON public.events_cache (start_date DESC);