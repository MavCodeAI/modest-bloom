-- Fix overly permissive RLS policies for orders (guest checkout needs special handling)
-- Drop the too permissive policies
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Create order items" ON public.order_items;

-- Create more specific policies for guest checkout
-- Guest orders: allow insert but validate required fields are present
CREATE POLICY "Anyone can create orders with valid data" ON public.orders 
FOR INSERT 
WITH CHECK (
  customer_name IS NOT NULL 
  AND customer_email IS NOT NULL 
  AND customer_phone IS NOT NULL 
  AND shipping_address IS NOT NULL
);

-- Order items: only allow insert if the order exists
CREATE POLICY "Insert order items for existing orders" ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id)
);

-- Also fix wholesale_quotes - require valid data
DROP POLICY IF EXISTS "Anyone can create quotes" ON public.wholesale_quotes;
CREATE POLICY "Anyone can create quotes with valid data" ON public.wholesale_quotes 
FOR INSERT 
WITH CHECK (
  business_name IS NOT NULL 
  AND contact_name IS NOT NULL 
  AND email IS NOT NULL 
  AND phone IS NOT NULL
);