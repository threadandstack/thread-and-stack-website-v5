
CREATE TABLE public.portfolio_access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_access_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage access codes"
  ON public.portfolio_access_codes FOR ALL
  TO authenticated
  USING (auth.email() = ANY (ARRAY['br@brendanrodgers.uk'::text, 'br@threadandstack.com'::text]))
  WITH CHECK (auth.email() = ANY (ARRAY['br@brendanrodgers.uk'::text, 'br@threadandstack.com'::text]));

CREATE TABLE public.portfolio_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id uuid REFERENCES public.portfolio_access_codes(id) ON DELETE SET NULL,
  portfolio text NOT NULL,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert logs"
  ON public.portfolio_access_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only admins can view access logs"
  ON public.portfolio_access_logs FOR SELECT
  TO authenticated
  USING (auth.email() = ANY (ARRAY['br@brendanrodgers.uk'::text, 'br@threadandstack.com'::text]));
