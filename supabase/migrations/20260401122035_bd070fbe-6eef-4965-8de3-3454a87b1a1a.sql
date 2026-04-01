
CREATE TABLE public.blog_posts_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notion_id text UNIQUE NOT NULL,
  slug text NOT NULL,
  title text NOT NULL,
  description text,
  intro text,
  header_image_url text,
  reading_time text,
  theme text,
  published_date date,
  featured boolean DEFAULT false,
  synced_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blog cache"
  ON public.blog_posts_cache FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify blog cache"
  ON public.blog_posts_cache FOR ALL
  TO authenticated
  USING (auth.email() IN ('br@brendanrodgers.uk', 'br@threadandstack.com'))
  WITH CHECK (auth.email() IN ('br@brendanrodgers.uk', 'br@threadandstack.com'));
