
-- Extend note_source enum
ALTER TYPE public.note_source ADD VALUE IF NOT EXISTS 'link';
ALTER TYPE public.note_source ADD VALUE IF NOT EXISTS 'image';
ALTER TYPE public.note_source ADD VALUE IF NOT EXISTS 'text';
ALTER TYPE public.note_source ADD VALUE IF NOT EXISTS 'video';

-- New columns on notes
ALTER TABLE public.notes
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS media_path text,
  ADD COLUMN IF NOT EXISTS cover_image_path text,
  ADD COLUMN IF NOT EXISTS cover_image_url text,
  ADD COLUMN IF NOT EXISTS extracted_text text,
  ADD COLUMN IF NOT EXISTS cover_width integer,
  ADD COLUMN IF NOT EXISTS cover_height integer;

-- Storage RLS: users can manage files in their own folder {user_id}/...
CREATE POLICY "users read own inspiration media"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'inspiration-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "users upload own inspiration media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'inspiration-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "users update own inspiration media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'inspiration-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "users delete own inspiration media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'inspiration-media' AND auth.uid()::text = (storage.foldername(name))[1]);
