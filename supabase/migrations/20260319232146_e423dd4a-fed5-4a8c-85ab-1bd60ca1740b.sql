CREATE TABLE public.hackathon_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  email text NOT NULL,
  source text NOT NULL DEFAULT 'notion-hackathon-london',
  want_future_templates boolean NOT NULL DEFAULT false,
  want_community boolean NOT NULL DEFAULT false
);

ALTER TABLE public.hackathon_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit hackathon leads"
  ON public.hackathon_leads
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only admins can view hackathon leads"
  ON public.hackathon_leads
  FOR SELECT
  TO authenticated
  USING (auth.email() = ANY (ARRAY['br@brendanrodgers.uk'::text, 'br@threadandstack.com'::text]));