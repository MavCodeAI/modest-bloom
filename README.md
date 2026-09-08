# Modestwayfashion.com 

Master Prompt: Modest Way Fashion (Luxury Abaya E-commerce)

Role:
You are a Senior Full-Stack Engineer and Luxury UI/UX Designer specialized in high-end fashion e-commerce.

Goal:
Build a complete, production-ready frontend for "Modest Way Fashion," a premium UAE-based Abaya brand. The app must serve two audiences: Retail Customers (B2C) and Wholesale Partners (B2B). It must use LocalStorage to simulate a real database for a fully functional demo (Cart, Admin Product Management, Quote Requests).



1. Tech Stack (Non-Negotiable)





Framework: React 19 + Vite (TypeScript)



Styling: Tailwind CSS v4 (using OKLCH color space for wide-gamut luxury colors)



Components: shadcn/ui (Radix UI based) + Lucide React icons



Routing: wouter (lightweight, hash-based routing for easy deployment)



State Management: React Context API + LocalStorage persistence



Forms: React Hook Form + Zod validation



2. Design System: "Midnight Bloom" (Dark Luxury)

Vibe: Exclusive, Cinematic, High-Fashion, "Vogue Arabia" aesthetic.

Color Palette (Tailwind Tokens):





Background: Deep Navy (oklch(0.15 0.05 260)) - A rich, dark canvas.



Foreground (Text): Soft Off-White (oklch(0.90 0.02 260)) - Readable but not harsh.



Primary/Accent: Champagne Rose (oklch(0.70 0.10 25)) - Used for buttons, price tags, and call-to-actions.



Surface/Cards: Lighter Navy (oklch(0.18 0.04 260)) - Subtle separation for cards.



Borders: Muted Navy (oklch(0.25 0.03 260)) - Very subtle boundaries.

Typography:





Headings: Playfair Display (Serif) - Elegant, high-contrast, editorial.



Body: Mulish (Sans-serif) - Clean, geometric, legible.

UI Rules:





Radius: 12px (0.75rem) for a soft, premium feel.



Glassmorphism: Header and overlays should use backdrop-blur-md with bg-background/80.



Spacing: Generous whitespace. Section padding py-24.



Images: All product cards must use a 4:5 Aspect Ratio (Editorial Standard).



3. Core Features & Scope

A. Customer Storefront (B2C)





Navbar: Sticky, glass-effect. Links: New In, Abayas, Printed, Sets, Kaftans, Sale, Wholesale. Icons: Search, Profile, Cart Drawer (with badge).



Home Page (11 Sections):





Hero: Full-screen video/image, overlay gradient, "UAE-born. Culture-inspired.", Dual CTAs.



New Drops: Grid of 4 latest items.



Promo Tiles: 2 large editorial banners (e.g., "Printed Velvet Collection").



Editorial Banner: Full-width "Editor's Pick" section.



Weekly Drop: Curated carousel/grid.



Testimonials: Dark strip with gold stars.



Favorite Collections: 3-column category highlights.



Express Strip: Icons for "Dispatch from Dubai", "Worldwide Shipping".



Best Sellers: Top rated items.



Abaya of the Week: Featured spotlight product.



Wholesale Strip: CTA for B2B partners.



Shop Page:





Sidebar filters: Categories, Colors, Price Range (Slider).



Sorting: Newest, Price Low-High, Price High-Low.



Product Grid: Responsive layout.



Product Detail Page (PDP):





Image Gallery (Left), Details (Right).



Size Selector (50, 52, 54, 56, 58, 60).



"Add to Cart" button (Retail only).



Accordions for Description, Shipping, Returns.



Cart & Checkout:





Cart Drawer: Slide-out side cart. Edit quantities, remove items.



Checkout Page: Mock form (Contact, Shipping, Payment placeholder). Clears cart on "Order".

B. Wholesale Portal (B2B)





Landing Page: "Partner Program" benefits, logistics info, "Apply Now" CTA.



Wholesale Catalog:





Hidden Prices: Products shown without prices.



CTA: "Request Quote" button instead of "Add to Cart".



Quote Request Form:





Fields: Business Name, Contact Person, Region (UAE/GCC/Intl), Volume, Message.



Submission: Saves to localStorage ('mw_quotes').

C. Admin Dashboard (Internal Tool)





Access: /admin.



Dashboard: Stats widgets (Total Products, Pending Quotes).



Product Manager: Table view. Add/Edit/Delete products.





Fields: Name, Price, Category, Description, Image URL, Tags (new_drop, best_seller), Wholesale (Yes/No).



Quote Manager: View wholesale inquiries. Mark status as "Processed".



4. Data Logic (Simulated Backend)





Use a StoreContext to manage global state.



Initialization: On first load, seed localStorage with dummy data (10-12 high-quality mock products).



Persistence: All changes (New products, Orders, Quotes) must save to localStorage so they persist after refresh.



5. Output Requirements





Project Structure: Clean folder structure (src/components, src/pages, src/contexts, src/lib).



Responsive: Mobile-first approach. Hamburger menu for mobile.



Performance: Lazy load images, optimize re-renders.

Execute this plan to generate the full application.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://midnight-abaya-boutique.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/81be4b95-f331-4c2b-a17b-df5c0df8b10a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
