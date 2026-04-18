
User wants:
1. Admin mobile responsiveness improvements (menu + overall)
2. Size variants management in admin product form
3. Color variants management in admin product form

Looking at current state: products table already has `sizes` (default S/M/L/XL) and `colors` arrays. Need to check Admin.tsx product form to see what's currently there.

The product form likely has basic text inputs. Need proper UI for adding/removing size and color chips.

## Plan

### 1. Size & Color variants UI in Admin product form (`src/pages/Admin.tsx`)
Add two new sections in the Add/Edit Product dialog:

**Sizes manager:**
- Quick-add preset buttons: `XS, S, M, L, XL, XXL, 3XL, Free Size, 52, 54, 56, 58, 60` (Abaya standard sizes)
- Custom size input + "Add" button
- Selected sizes shown as removable chips (Badge with X)
- Stored in `sizes: string[]` array

**Colors manager:**
- Color name input + color picker (HTML `<input type="color">`)
- "Add Color" button → adds to list
- Each color shown as a chip: small swatch circle + color name + remove X
- Stored as `colors: string[]` (format: `"Name:#hex"` or just name; keep simple as name strings to match existing schema)
- Preset palette: Black, Navy, Beige, Maroon, Olive, Grey, Brown, White

### 2. Admin Mobile Responsiveness (`src/pages/Admin.tsx` + sub-components)
- Verify hamburger Sheet menu works (already fixed previously) and improve drawer content
- Make stats cards stack properly on mobile (`grid-cols-2 lg:grid-cols-4`)
- Tabs: switch to horizontal scroll on mobile (`overflow-x-auto`) with smaller text
- Product/Order tables: ensure they're wrapped in `overflow-x-auto` containers
- Dialog forms: full-screen on mobile (`max-w-full sm:max-w-2xl h-screen sm:h-auto`)
- Reduce padding on mobile (`p-3 sm:p-6`)
- Action buttons in headers: stack vertically on mobile (`flex-col sm:flex-row`)
- Bottom safe-area padding for forms with sticky save button

### 3. Reusable component
Create `src/components/admin/VariantManager.tsx` — generic chip-based add/remove for both sizes and colors (color variant shows swatch).

### Files to edit
- `src/pages/Admin.tsx` — wire VariantManager into product form, mobile responsive polish
- `src/components/admin/VariantManager.tsx` — **new**, reusable size/color chip manager
- Possibly `src/components/admin/AdminProducts.tsx` — table mobile overflow wrapper if needed

### Out of scope
- No DB schema changes (sizes & colors arrays already exist)
- No per-variant inventory (would need new `product_variants` table — ask separately if needed)
