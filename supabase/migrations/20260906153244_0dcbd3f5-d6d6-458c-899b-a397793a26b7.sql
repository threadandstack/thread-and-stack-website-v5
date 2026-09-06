ALTER TABLE public.blog_posts_cache ADD COLUMN IF NOT EXISTS og_image_url text;
ALTER TABLE public.blog_content_cache ADD COLUMN IF NOT EXISTS og_image_url text;