

## Issues Found

**1. Mobile menu Admin میں نہیں کھلتا**
`src/pages/Admin.tsx` کا header `sticky top-0 z-50` ہے، لیکن header کے اندر موجود `Sheet` component ایک overlay/portal open کرتا ہے جو `z-50` پر ہے — وہ portal تو render ہوتا ہے، لیکن اصل بٹن tap area پر ایک issue ہے: hamburger button drawer `Sheet` کے ساتھ ٹھیک ہے لیکن mobile پر `<header>` اور main content کے درمیان touch event propagation کا کوئی مسئلہ نہیں نظر آتا۔ اصل مسئلہ یہ ہے کہ `SheetTrigger asChild` کے اوپر `className="md:hidden"` لگا ہوا ہے — `asChild` کے ساتھ یہ className child Button پر صحیح طرح pass نہیں ہوتی، اور بعض صورتوں میں button render ہی نہیں ہوتا۔ Fix: `md:hidden` کو wrapper `div` پر لگانا، یا `SheetTrigger` کے بجائے controlled `open`/`onOpenChange` state کے ساتھ plain button استعمال کرنا۔

**2. Order status تبدیل نہیں ہوتا (Order palace حالت نہیں بدلتی)**
Database میں `orders` table کی RLS policy:
```
"Admins can update orders" — USING: has_role(auth.uid(), 'admin')
```
Admin panel PIN-based local auth استعمال کرتا ہے (`AdminAuthContext`), Supabase Auth سے login نہیں ہوتا۔ یعنی `auth.uid()` `NULL` ہے → RLS policy fail ہوتی ہے → `update` silently 0 rows لوٹاتا ہے یا error دیتا ہے۔ یہی وجہ ہے کہ status badge update نہیں ہوتا۔

## Fix Plan

### Fix 1 — Mobile menu (file: `src/pages/Admin.tsx`)
- `SheetTrigger asChild` سے `className="md:hidden"` ہٹا کر، بٹن کو `<div className="md:hidden">` wrapper میں ڈالنا تاکہ trigger ہمیشہ proper Button کے طور پر mobile میں render ہو۔
- Confirm کرنا کہ `Sheet`'s `open`/`onOpenChange` state درست wired ہے (پہلے سے ہے).

### Fix 2 — Order status update working (RLS کے بغیر admin updates)
چونکہ admin panel Supabase Auth استعمال نہیں کرتا، دو options:

**Option A (recommended, secure):** Admin operations کے لیے ایک Supabase Edge Function بنائیں جو service role key استعمال کر کے order status update کرے۔ PIN check edge function میں ہو۔

**Option B (quick fix, less secure):** RLS policy تبدیل کر کے `orders` table پر `UPDATE` کو anonymous role کے لیے بھی allow کریں (صرف status field) — لیکن یہ سب کو order تبدیل کرنے دے گا، ٹھیک نہیں۔

**Recommended approach: Option A**
1. ایک edge function بنائیں: `supabase/functions/admin-update-order/index.ts` جو request body سے `{ id, status, pin }` لے، PIN verify کرے (`345345`), پھر service role client سے order update کرے۔
2. `config.toml` میں function add کریں `verify_jwt = false`.
3. `useUpdateOrderStatus` hook کو modify کریں کہ `supabase.functions.invoke('admin-update-order', { body: { id, status, pin } })` call کرے۔
4. PIN کو `AdminAuthContext` سے نکالیں اور hook میں pass کریں — یا pin کو edge function میں hardcode رکھیں (موجودہ pattern کی طرح)۔
5. وہی fix `useUpdateQuoteStatus` پر بھی apply کریں کیونکہ wholesale_quotes پر بھی غالباً same RLS issue ہو گا۔

### Files to edit
- `src/pages/Admin.tsx` — mobile menu trigger fix
- `src/hooks/useAdminOrders.ts` — `useUpdateOrderStatus` کو edge function invoke کرنے کے لیے بدلیں
- `src/hooks/useWholesaleQuotes.ts` — same fix for quote status
- **Create:** `supabase/functions/admin-update-order/index.ts` (handles both orders + quotes status updates with PIN check)
- **Create:** `supabase/config.toml` block for the new function (`verify_jwt = false`)

