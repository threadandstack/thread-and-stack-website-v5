REVOKE EXECUTE ON FUNCTION public.count_coupon_redemptions(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.count_coupon_redemptions(TEXT) TO service_role;