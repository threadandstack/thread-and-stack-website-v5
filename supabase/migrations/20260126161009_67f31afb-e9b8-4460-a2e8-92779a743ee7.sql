-- Add genre column to fiction_favorites for constellation grouping
ALTER TABLE public.fiction_favorites 
ADD COLUMN IF NOT EXISTS genre TEXT;

-- Create index for efficient genre-based queries
CREATE INDEX IF NOT EXISTS idx_fiction_favorites_genre ON public.fiction_favorites(genre);