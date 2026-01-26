-- Create table for fiction favorites submissions
CREATE TABLE public.fiction_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  answer TEXT NOT NULL,
  enriched_answer TEXT,
  emojis TEXT,
  cluster_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fiction_favorites ENABLE ROW LEVEL SECURITY;

-- Anyone can submit (anonymous)
CREATE POLICY "Anyone can submit fiction favorites"
ON public.fiction_favorites
FOR INSERT
WITH CHECK (true);

-- Anyone can view all submissions
CREATE POLICY "Anyone can view fiction favorites"
ON public.fiction_favorites
FOR SELECT
USING (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.fiction_favorites;