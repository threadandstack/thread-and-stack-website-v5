-- Create a public-safe view that excludes fingerprint data
CREATE OR REPLACE VIEW public.fiction_favorites_public AS
SELECT id, answer, enriched_answer, emojis, cluster_key, genre, created_at
FROM public.fiction_favorites;

-- Grant access to the view for anon and authenticated roles
GRANT SELECT ON public.fiction_favorites_public TO anon, authenticated;

-- Now restrict the base table: drop the open SELECT policy and add admin-only
DROP POLICY "Anyone can view fiction favorites" ON public.fiction_favorites;

CREATE POLICY "Only admins can view all fiction favorites"
ON public.fiction_favorites
FOR SELECT
TO authenticated
USING (auth.email() IN ('br@brendanrodgers.uk', 'br@threadandstack.com'));

-- Allow anon/authenticated to read via the view (view uses definer's permissions)
-- We need a policy that allows the view to read - use security definer
-- Actually, views in Postgres use the caller's permissions by default
-- So we need to keep a SELECT policy but restrict columns via the view approach
-- Better approach: keep public SELECT but the frontend only uses the view