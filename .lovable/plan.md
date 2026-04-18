
User wants Admin Auth page UI/UX redesigned to match the main website's "Beach Luxury" theme (sandy beige + ocean teal + coral). Currently it uses dark purple/slate gradient which clashes with the brand.

Plan:

**Redesign `src/components/admin/AdminAuth.tsx`** to match the main site's Beach Luxury design system:

1. **Background**: Replace dark purple/slate gradient with brand-appropriate background — soft beige/cream gradient using `bg-gradient-to-br from-background via-muted to-background` with subtle ocean teal accent blobs.

2. **Card styling**: Use `bg-card` with proper border (`border-border`) and `shadow-card` instead of dark glass morphism. Use the project's defined `--shadow-card` and `--shadow-soft`.

3. **Typography**: 
   - Heading uses `font-serif` (Playfair Display) with `text-foreground` 
   - Replace "Modest Way Fashion" tag with proper brand styling matching navbar

4. **Icon container**: Ocean teal background (`bg-primary/10`) with `text-primary` Shield icon — keep but ensure colors map to theme tokens.

5. **PIN inputs**: 
   - Use `bg-background border-input` 
   - Focus ring uses `ring-primary` (ocean teal)
   - Text color `text-foreground`

6. **Buttons**:
   - Primary submit: default `Button` (already uses primary ocean teal)
   - Clear: `variant="outline"` with proper border tokens
   - Back to Store: `variant="ghost"` with `text-muted-foreground`

7. **Show/Hide PIN toggle**: Use `text-muted-foreground hover:text-foreground`

8. **Error alert**: Use `variant="destructive"` from existing Alert component instead of custom red styling.

9. **Security notice**: `text-xs text-muted-foreground` 

10. **Decorative blobs**: Replace purple/blue blurs with `bg-primary/10` and `bg-secondary/10` (ocean teal + coral) blurred circles for subtle brand-aligned ambiance.

11. **Mobile responsiveness**: Ensure PIN input boxes scale on small viewports (already 393px wide) — use `w-10 h-12 sm:w-12 sm:h-12` and reduce gap on mobile (`gap-1.5 sm:gap-2`).

**File to edit**: `src/components/admin/AdminAuth.tsx` only.

No database, routing, or logic changes — purely visual redesign aligned with the existing Beach Luxury design tokens defined in `src/index.css`.
