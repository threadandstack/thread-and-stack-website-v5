CREATE TABLE public.masterclass_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role_org TEXT,
  message TEXT,
  mode TEXT NOT NULL DEFAULT 'register',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  consent_given BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.masterclass_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit masterclass registrations"
ON public.masterclass_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Only admins can view masterclass registrations"
ON public.masterclass_registrations
FOR SELECT
TO authenticated
USING (auth.email() = ANY (ARRAY['br@brendanrodgers.uk'::text, 'br@threadandstack.com'::text]));

CREATE INDEX idx_masterclass_registrations_created_at ON public.masterclass_registrations (created_at DESC);
CREATE INDEX idx_masterclass_registrations_email ON public.masterclass_registrations (email);