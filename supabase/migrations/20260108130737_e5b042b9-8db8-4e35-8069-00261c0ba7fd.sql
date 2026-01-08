-- Add INSERT, UPDATE, DELETE policies for page_seo (admin management)
CREATE POLICY "Anyone can insert page SEO data"
ON public.page_seo
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update page SEO data"
ON public.page_seo
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete page SEO data"
ON public.page_seo
FOR DELETE
USING (true);

-- Add upload policy for og-images bucket
CREATE POLICY "Anyone can upload OG images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'og-images');

CREATE POLICY "Anyone can update OG images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'og-images');

CREATE POLICY "Anyone can delete OG images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'og-images');