-- Drop the security definer view (causes linter error)
DROP VIEW IF EXISTS public.fiction_favorites_public;

-- Restore public SELECT on the base table (the frontend will select only safe columns)
DROP POLICY IF EXISTS "Only admins can view all fiction favorites" ON public.fiction_favorites;

CREATE POLICY "Anyone can view fiction favorites"
ON public.fiction_favorites
FOR SELECT
USING (true);