-- Add column for featured related blog post
ALTER TABLE public.page_seo 
ADD COLUMN IF NOT EXISTS featured_related_blog_slug TEXT;