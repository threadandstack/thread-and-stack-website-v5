-- Fix 1: Add admin-only SELECT policy for leads table
-- This prevents unauthorized access to customer contact information
CREATE POLICY "Only admins can view leads"
ON public.leads
FOR SELECT
TO authenticated
USING (auth.email() IN ('br@brendanrodgers.uk', 'br@threadandstack.com'));

-- Fix 2: Replace permissive storage policies with admin-only policies

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can upload OG images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update OG images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete OG images" ON storage.objects;

-- Create admin-only INSERT policy
CREATE POLICY "Only admins can upload OG images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'og-images' AND
  auth.email() IN ('br@brendanrodgers.uk', 'br@threadandstack.com')
);

-- Create admin-only UPDATE policy
CREATE POLICY "Only admins can modify OG images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'og-images' AND
  auth.email() IN ('br@brendanrodgers.uk', 'br@threadandstack.com')
);

-- Create admin-only DELETE policy
CREATE POLICY "Only admins can delete OG images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'og-images' AND
  auth.email() IN ('br@brendanrodgers.uk', 'br@threadandstack.com')
);