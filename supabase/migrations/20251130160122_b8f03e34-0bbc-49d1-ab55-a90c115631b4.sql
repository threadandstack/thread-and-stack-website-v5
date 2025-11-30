-- Create table for workshop quote requests
CREATE TABLE public.workshop_quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  phase_one TEXT,
  phase_two TEXT,
  phase_three TEXT,
  phase_four TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.workshop_quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their own quote request
CREATE POLICY "Anyone can submit quote requests"
ON public.workshop_quote_requests
FOR INSERT
TO anon
WITH CHECK (true);

-- Only authenticated users (you) can view all requests
CREATE POLICY "Authenticated users can view all requests"
ON public.workshop_quote_requests
FOR SELECT
TO authenticated
USING (true);