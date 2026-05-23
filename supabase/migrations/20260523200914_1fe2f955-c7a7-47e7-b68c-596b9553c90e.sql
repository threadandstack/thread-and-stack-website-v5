-- 1. Remove sensitive PII columns from fiction_favorites (publicly readable + on realtime)
ALTER TABLE public.fiction_favorites
  DROP COLUMN IF EXISTS user_agent,
  DROP COLUMN IF EXISTS city,
  DROP COLUMN IF EXISTS country,
  DROP COLUMN IF EXISTS timezone,
  DROP COLUMN IF EXISTS device_type,
  DROP COLUMN IF EXISTS is_repeat_visitor;

-- 2. Lock down email queue SECURITY DEFINER helpers: revoke from anon/authenticated, set search_path
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM anon, authenticated, public;

ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public;
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public;

-- 3. Add explicit admin-only SELECT policy on workshop_quote_requests (defence in depth)
CREATE POLICY "Only admins can view quote requests"
  ON public.workshop_quote_requests
  FOR SELECT
  TO authenticated
  USING (auth.email() = ANY (ARRAY['br@brendanrodgers.uk'::text, 'br@threadandstack.com'::text]));
