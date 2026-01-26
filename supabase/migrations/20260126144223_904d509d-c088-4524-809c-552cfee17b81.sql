-- Add metadata columns to fiction_favorites
ALTER TABLE public.fiction_favorites
ADD COLUMN IF NOT EXISTS device_type text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS timezone text,
ADD COLUMN IF NOT EXISTS is_repeat_visitor boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS user_agent text;