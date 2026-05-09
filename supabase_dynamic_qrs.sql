-- Create the table for dynamic QR codes
CREATE TABLE IF NOT EXISTS public.dynamic_qrs (
    id text PRIMARY KEY,
    title text NOT NULL,
    destination_url text NOT NULL,
    scan_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.dynamic_qrs ENABLE ROW LEVEL SECURITY;

-- Allow public read access (necessary for the redirection route to read the destination URL)
CREATE POLICY "Public can view dynamic_qrs" 
ON public.dynamic_qrs 
FOR SELECT 
USING (true);

-- Allow authenticated users (admins) to insert, update, and delete
CREATE POLICY "Admins can manage dynamic_qrs" 
ON public.dynamic_qrs 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Also, since we are tracking scans, we need to allow updating the scan_count without authentication.
-- Wait, if it's unauthenticated, they shouldn't be able to edit the destination URL.
-- To securely update `scan_count` publicly, we should ideally use a Supabase RPC (stored procedure).
-- Let's create an RPC for incrementing the scan count securely.

CREATE OR REPLACE FUNCTION increment_qr_scan(qr_id text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.dynamic_qrs
  SET scan_count = scan_count + 1
  WHERE id = qr_id;
$$;
