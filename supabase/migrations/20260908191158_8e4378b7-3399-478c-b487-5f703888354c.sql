ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS guest_token uuid;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS guest_token uuid;

DROP POLICY IF EXISTS "Insert order items for own or fresh guest order" ON public.order_items;
CREATE POLICY "Insert order items for own or verified guest order"
ON public.order_items FOR INSERT TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND (
        (o.user_id IS NOT NULL AND o.user_id = auth.uid())
        OR (
          o.user_id IS NULL
          AND o.guest_token IS NOT NULL
          AND order_items.guest_token = o.guest_token
          AND o.created_at > (now() - interval '15 minutes')
        )
      )
  )
);

CREATE POLICY "Only admins can delete orders"
ON public.orders FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone can create quotes with valid data" ON public.wholesale_quotes;
CREATE POLICY "Anyone can create quotes with valid data"
ON public.wholesale_quotes FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(business_name)) BETWEEN 2 AND 120
  AND length(btrim(contact_name)) BETWEEN 2 AND 120
  AND email ~* '^[A-Za-z0-9._%%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND length(email) <= 160
  AND length(btrim(phone)) BETWEEN 6 AND 32
  AND length(btrim(country)) BETWEEN 2 AND 80
  AND (message IS NULL OR length(message) <= 2000)
);

REVOKE EXECUTE ON FUNCTION public.enforce_order_item_price() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalc_order_totals() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_order_pricing() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_quote_number() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;