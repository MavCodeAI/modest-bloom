-- Add wholesale_price column to products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS wholesale_price numeric;

-- Create public storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: anyone can view, anyone can upload/update/delete in product-images bucket
-- (admin panel uses PIN auth so we cannot rely on auth.uid(); the bucket is intended for admin use only via the admin UI)
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');