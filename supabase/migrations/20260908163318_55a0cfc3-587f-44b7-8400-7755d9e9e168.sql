-- 1. Orders: remove guest (user_id IS NULL) read bypass
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Order items: remove guest read bypass
DROP POLICY IF EXISTS "View order items with order" ON public.order_items;
CREATE POLICY "Users can view own order items"
ON public.order_items FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.orders o
  WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
));

-- 3. Order items insert: only into own order, or a guest order created seconds ago
DROP POLICY IF EXISTS "Insert order items for existing orders" ON public.order_items;
CREATE POLICY "Insert order items for own or fresh guest order"
ON public.order_items FOR INSERT
TO anon, authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.orders o
  WHERE o.id = order_items.order_id
    AND (
      o.user_id = auth.uid()
      OR (o.user_id IS NULL AND o.created_at > now() - interval '10 minutes')
    )
));

-- 4. Orders insert: cannot spoof another user's id
DROP POLICY IF EXISTS "Anyone can create orders with valid data" ON public.orders;
CREATE POLICY "Anyone can create orders with valid data"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (
  (user_id IS NULL OR user_id = auth.uid())
  AND customer_name <> ''
  AND customer_email <> ''
  AND customer_phone <> ''
  AND shipping_address <> ''
);

-- 5. Server-side pricing enforcement
CREATE OR REPLACE FUNCTION public.enforce_order_pricing()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_subtotal numeric;
BEGIN
  v_subtotal := COALESCE(NEW.subtotal, 0);
  IF v_subtotal < 0 THEN
    RAISE EXCEPTION 'Invalid subtotal';
  END IF;

  NEW.shipping_cost := CASE WHEN v_subtotal >= 500 THEN 0 ELSE 50 END;
  NEW.cod_fee := CASE WHEN NEW.payment_method = 'cod' THEN 20 ELSE 0 END;
  NEW.total := v_subtotal + NEW.shipping_cost + NEW.cod_fee;
  NEW.status := 'pending';
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_order_pricing() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS enforce_order_pricing_trg ON public.orders;
CREATE TRIGGER enforce_order_pricing_trg
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.enforce_order_pricing();

-- 6. Lock down trigger helper functions from direct API calls
REVOKE ALL ON FUNCTION public.generate_order_number() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.generate_quote_number() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- 7. Storage: product-images write restricted to admins
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND (COALESCE(qual, '') LIKE '%product-images%' OR COALESCE(with_check, '') LIKE '%product-images%')
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', p.policyname);
  END LOOP;
END $$;

CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));