
-- Enforce real product price on each order line
CREATE OR REPLACE FUNCTION public.enforce_order_item_price()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_price numeric;
BEGIN
  IF NEW.quantity IS NULL OR NEW.quantity < 1 THEN
    RAISE EXCEPTION 'Invalid quantity';
  END IF;

  IF NEW.product_id IS NOT NULL THEN
    SELECT COALESCE(p.sale_price, p.price) INTO v_price
    FROM public.products p
    WHERE p.id = NEW.product_id;

    IF v_price IS NULL THEN
      RAISE EXCEPTION 'Unknown product';
    END IF;

    NEW.price := v_price;
  ELSIF NEW.price IS NULL OR NEW.price < 0 THEN
    RAISE EXCEPTION 'Invalid price';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_order_item_price_trg ON public.order_items;
CREATE TRIGGER enforce_order_item_price_trg
BEFORE INSERT ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.enforce_order_item_price();

-- Recalculate order totals from the persisted line items
CREATE OR REPLACE FUNCTION public.recalc_order_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_subtotal numeric;
  v_shipping numeric;
  v_cod numeric;
  v_payment text;
BEGIN
  SELECT COALESCE(SUM(oi.price * oi.quantity), 0) INTO v_subtotal
  FROM public.order_items oi
  WHERE oi.order_id = NEW.order_id;

  SELECT o.payment_method INTO v_payment FROM public.orders o WHERE o.id = NEW.order_id;

  v_shipping := CASE WHEN v_subtotal >= 500 THEN 0 ELSE 50 END;
  v_cod := CASE WHEN v_payment = 'cod' THEN 20 ELSE 0 END;

  UPDATE public.orders
  SET subtotal = v_subtotal,
      shipping_cost = v_shipping,
      cod_fee = v_cod,
      total = v_subtotal + v_shipping + v_cod
  WHERE id = NEW.order_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS recalc_order_totals_trg ON public.order_items;
CREATE TRIGGER recalc_order_totals_trg
AFTER INSERT ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.recalc_order_totals();
