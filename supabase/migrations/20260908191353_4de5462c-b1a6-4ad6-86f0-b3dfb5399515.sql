CREATE POLICY "Guests can view their own order with checkout code"
ON public.orders FOR SELECT TO anon, authenticated
USING (
  user_id IS NULL
  AND guest_token IS NOT NULL
  AND guest_token::text = nullif(current_setting('request.headers', true)::json ->> 'x-guest-token', '')
);