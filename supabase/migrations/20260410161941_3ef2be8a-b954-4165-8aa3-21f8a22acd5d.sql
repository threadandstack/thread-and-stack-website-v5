
-- Create the notion-media storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('notion-media', 'notion-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Anyone can view notion media"
ON storage.objects FOR SELECT
USING (bucket_id = 'notion-media');

-- Allow service role to upload
CREATE POLICY "Service role can upload notion media"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'notion-media');

-- Allow service role to update/overwrite
CREATE POLICY "Service role can update notion media"
ON storage.objects FOR UPDATE
TO service_role
USING (bucket_id = 'notion-media');

-- Allow service role to delete
CREATE POLICY "Service role can delete notion media"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'notion-media');
