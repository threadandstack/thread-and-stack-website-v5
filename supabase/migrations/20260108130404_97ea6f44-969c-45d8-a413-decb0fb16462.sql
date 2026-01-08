-- Create updated_at function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create page_seo table for managing social share images and SEO metadata
CREATE TABLE public.page_seo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT NOT NULL UNIQUE,
    page_title TEXT,
    meta_description TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image_path TEXT,
    twitter_title TEXT,
    twitter_description TEXT,
    twitter_image_path TEXT,
    canonical_url TEXT,
    keywords TEXT[],
    no_index BOOLEAN DEFAULT false,
    no_follow BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;

-- Allow public read access (SEO data needs to be publicly readable)
CREATE POLICY "Anyone can read page SEO data"
ON public.page_seo
FOR SELECT
USING (true);

-- Create storage bucket for OG images
INSERT INTO storage.buckets (id, name, public)
VALUES ('og-images', 'og-images', true);

-- Allow public read access to OG images
CREATE POLICY "OG images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'og-images');

-- Create updated_at trigger
CREATE TRIGGER update_page_seo_updated_at
BEFORE UPDATE ON public.page_seo
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();