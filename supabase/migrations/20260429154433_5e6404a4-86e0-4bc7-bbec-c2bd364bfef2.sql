-- Bookings captured from the drawer
CREATE TABLE public.power_hour_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role_org TEXT,
  focus TEXT,
  source TEXT NOT NULL DEFAULT 'charity-meetup-april26',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  coupon_code TEXT,
  stripe_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  amount_paid INTEGER,
  consent_given BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.power_hour_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a Power-Hour booking"
ON public.power_hour_bookings
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Only admins can view Power-Hour bookings"
ON public.power_hour_bookings
FOR SELECT TO authenticated
USING (auth.email() = ANY (ARRAY['br@brendanrodgers.uk'::text, 'br@threadandstack.com'::text]));

CREATE POLICY "Service role can manage Power-Hour bookings"
ON public.power_hour_bookings
FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE INDEX idx_power_hour_bookings_session ON public.power_hour_bookings(stripe_session_id);
CREATE INDEX idx_power_hour_bookings_email ON public.power_hour_bookings(email);

-- Track coupon usage to enforce caps
CREATE TABLE public.coupon_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  code TEXT NOT NULL,
  stripe_session_id TEXT,
  email TEXT
);

ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage coupon redemptions"
ON public.coupon_redemptions
FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE POLICY "Only admins can view coupon redemptions"
ON public.coupon_redemptions
FOR SELECT TO authenticated
USING (auth.email() = ANY (ARRAY['br@brendanrodgers.uk'::text, 'br@threadandstack.com'::text]));

CREATE INDEX idx_coupon_redemptions_code ON public.coupon_redemptions(code);

-- Helper function to count uses of a coupon code (case-insensitive)
CREATE OR REPLACE FUNCTION public.count_coupon_redemptions(_code TEXT)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int FROM public.coupon_redemptions WHERE upper(code) = upper(_code);
$$;