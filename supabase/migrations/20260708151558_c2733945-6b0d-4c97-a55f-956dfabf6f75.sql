
GRANT SELECT ON public.xero_connection TO authenticated;

CREATE POLICY "Admins can view Xero connection"
ON public.xero_connection
FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'email') IN ('br@brendanrodgers.uk', 'br@threadandstack.com'));
