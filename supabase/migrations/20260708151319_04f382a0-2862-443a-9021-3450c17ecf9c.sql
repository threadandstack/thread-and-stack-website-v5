
-- Xero connection (single-row table storing OAuth tokens for the connected org)
CREATE TABLE public.xero_connection (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  tenant_name TEXT,
  refresh_token TEXT NOT NULL,
  access_token TEXT,
  access_token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.xero_connection TO service_role;

ALTER TABLE public.xero_connection ENABLE ROW LEVEL SECURITY;

-- No policies: locked to service_role only. Edge functions use service role.

CREATE TRIGGER update_xero_connection_updated_at
BEFORE UPDATE ON public.xero_connection
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Track Xero sync state per booking
ALTER TABLE public.power_hour_bookings
  ADD COLUMN IF NOT EXISTS xero_contact_id TEXT,
  ADD COLUMN IF NOT EXISTS xero_invoice_id TEXT,
  ADD COLUMN IF NOT EXISTS xero_invoice_number TEXT,
  ADD COLUMN IF NOT EXISTS xero_synced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS xero_sync_error TEXT,
  ADD COLUMN IF NOT EXISTS discount_amount INTEGER;
