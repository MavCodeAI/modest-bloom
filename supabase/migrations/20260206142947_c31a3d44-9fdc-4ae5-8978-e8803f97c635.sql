-- Drop existing restrictive INSERT policy
DROP POLICY IF EXISTS "Anyone can create quotes with valid data" ON public.wholesale_quotes;

-- Create new policy that allows anyone (including anonymous/unauthenticated users) to create quotes
CREATE POLICY "Anyone can create quotes with valid data" 
ON public.wholesale_quotes 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  business_name IS NOT NULL 
  AND contact_name IS NOT NULL 
  AND email IS NOT NULL 
  AND phone IS NOT NULL
);