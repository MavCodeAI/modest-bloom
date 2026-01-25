-- Insert sample categories
INSERT INTO public.categories (id, name, slug, description, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Abayas', 'abayas', 'Elegant and modest abayas for every occasion', '/images/categories/abayas.jpg'),
('550e8400-e29b-41d4-a716-446655440002', 'Hijabs', 'hijabs', 'Beautiful hijabs in various colors and materials', '/images/categories/hijabs.jpg'),
('550e8400-e29b-41d4-a716-446655440003', 'Modest Dresses', 'modest-dresses', 'Stylish modest dresses for modern women', '/images/categories/dresses.jpg'),
('550e8400-e29b-41d4-a716-446655440004', 'Prayer Outfits', 'prayer-outfits', 'Comfortable prayer outfits for daily use', '/images/categories/prayer.jpg'),
('550e8400-e29b-41d4-a716-446655440005', 'Modest Tops', 'modest-tops', 'Modest tops and blouses for everyday wear', '/images/categories/tops.jpg'),
('550e8400-e29b-41d4-a716-446655440006', 'Modest Bottoms', 'modest-bottoms', 'Modest skirts and pants for complete outfits', '/images/categories/bottoms.jpg');

-- Insert sample products for Abayas category
INSERT INTO public.products (id, name, slug, description, price, sale_price, category_id, images, sizes, colors, tags, in_stock, is_wholesale, min_order_quantity) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Classic Black Abaya', 'classic-black-abaya', 'Timeless black abaya with elegant embroidery', 299.00, 249.00, '550e8400-e29b-41d4-a716-446655440001', ARRAY['/images/products/abaya-black-1.jpg', '/images/products/abaya-black-2.jpg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black'], ARRAY['classic', 'bestseller'], true, false, 1),
('660e8400-e29b-41d4-a716-446655440002', 'Navy Blue Elegant Abaya', 'navy-blue-elegant-abaya', 'Sophisticated navy blue abaya with subtle details', 349.00, NULL, '550e8400-e29b-41d4-a716-446655440001', ARRAY['/images/products/abaya-navy-1.jpg', '/images/products/abaya-navy-2.jpg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Navy'], ARRAY['elegant', 'new'], true, false, 1),
('660e8400-e29b-41d4-a716-446655440003', 'Embroidered Special Occasion Abaya', 'embroidered-special-occasion-abaya', 'Luxurious abaya with intricate embroidery for special events', 599.00, NULL, '550e8400-e29b-41d4-a716-446655440001', ARRAY['/images/products/abaya-embroidered-1.jpg', '/images/products/abaya-embroidered-2.jpg'], ARRAY['M', 'L', 'XL'], ARRAY['Black', 'Burgundy'], ARRAY['luxury', 'special'], true, false, 1);

-- Insert sample products for Hijabs category
INSERT INTO public.products (id, name, slug, description, price, sale_price, category_id, images, sizes, colors, tags, in_stock, is_wholesale, min_order_quantity) VALUES
('660e8400-e29b-41d4-a716-446655440004', 'Premium Jersey Hijab', 'premium-jersey-hijab', 'Soft and comfortable jersey hijab for daily wear', 79.00, NULL, '550e8400-e29b-41d4-a716-446655440002', ARRAY['/images/products/hijab-jersey-1.jpg'], ARRAY['One Size'], ARRAY['Black', 'White', 'Navy', 'Gray', 'Beige'], ARRAY['basic', 'essential'], true, true, 5),
('660e8400-e29b-41d4-a716-446655440005', 'Chiffon Square Hijab', 'chiffon-square-hijab', 'Lightweight chiffon hijab perfect for formal occasions', 99.00, 79.00, '550e8400-e29b-41d4-a716-446655440002', ARRAY['/images/products/hijab-chiffon-1.jpg'], ARRAY['One Size'], ARRAY['Pink', 'Lavender', 'Mint', 'Peach'], ARRAY['elegant', 'sale'], true, false, 1),
('660e8400-e29b-41d4-a716-446655440006', 'Printed Modal Hijab', 'printed-modal-hijab', 'Beautiful printed modal hijab with unique designs', 129.00, NULL, '550e8400-e29b-41d4-a716-446655440002', ARRAY['/images/products/hijab-printed-1.jpg'], ARRAY['One Size'], ARRAY['Multi'], ARRAY['trending', 'unique'], true, false, 1);

-- Insert sample products for Modest Dresses category
INSERT INTO public.products (id, name, slug, description, price, sale_price, category_id, images, sizes, colors, tags, in_stock, is_wholesale, min_order_quantity) VALUES
('660e8400-e29b-41d4-a716-446655440007', 'Maxi Modest Dress', 'maxi-modest-dress', 'Elegant maxi dress with long sleeves and modest cut', 399.00, NULL, '550e8400-e29b-41d4-a716-446655440003', ARRAY['/images/products/dress-maxi-1.jpg', '/images/products/dress-maxi-2.jpg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Navy', 'Burgundy', 'Forest Green'], ARRAY['elegant', 'formal'], true, false, 1),
('660e8400-e29b-41d4-a716-446655440008', 'Casual Modest Day Dress', 'casual-modest-day-dress', 'Comfortable casual dress perfect for everyday wear', 249.00, 199.00, '550e8400-e29b-41d4-a716-446655440003', ARRAY['/images/products/dress-casual-1.jpg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Beige', 'Gray', 'Light Blue'], ARRAY['casual', 'sale', 'comfortable'], true, false, 1),
('660e8400-e29b-41d4-a716-446655440009', 'Wrap Modest Dress', 'wrap-modest-dress', 'Stylish wrap dress with modest styling', 329.00, NULL, '550e8400-e29b-41d4-a716-446655440003', ARRAY['/images/products/dress-wrap-1.jpg'], ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Black', 'Red', 'Royal Blue'], ARRAY['versatile', 'trending'], true, false, 1);

-- Insert sample products for Prayer Outfits category
INSERT INTO public.products (id, name, slug, description, price, sale_price, category_id, images, sizes, colors, tags, in_stock, is_wholesale, min_order_quantity) VALUES
('660e8400-e29b-41d4-a716-446655440010', 'Complete Prayer Set', 'complete-prayer-set', 'Complete prayer outfit with top and bottom', 199.00, NULL, '550e8400-e29b-41d4-a716-446655440004', ARRAY['/images/products/prayer-set-1.jpg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['White', 'Light Gray', 'Beige'], ARRAY['essential', 'complete'], true, false, 1),
('660e8400-e29b-41d4-a716-446655440011', 'Luxury Prayer Abaya', 'luxury-prayer-abaya', 'Premium quality prayer abaya with fine details', 349.00, NULL, '550e8400-e29b-41d4-a716-446655440004', ARRAY['/images/products/prayer-luxury-1.jpg'], ARRAY['M', 'L', 'XL'], ARRAY['White', 'Cream'], ARRAY['luxury', 'premium'], true, false, 1);

-- Insert sample products for Modest Tops category
INSERT INTO public.products (id, name, slug, description, price, sale_price, category_id, images, sizes, colors, tags, in_stock, is_wholesale, min_order_quantity) VALUES
('660e8400-e29b-41d4-a716-446655440012', 'Long Sleeve Tunic Top', 'long-sleeve-tunic-top', 'Versatile long tunic top perfect for modest styling', 149.00, NULL, '550e8400-e29b-41d4-a716-446655440005', ARRAY['/images/products/top-tunic-1.jpg'], ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['White', 'Black', 'Navy', 'Pink'], ARRAY['versatile', 'basic'], true, true, 3),
('660e8400-e29b-41d4-a716-446655440013', 'Elegant Blouse', 'elegant-blouse', 'Sophisticated blouse with modest neckline', 189.00, 149.00, '550e8400-e29b-41d4-a716-446655440005', ARRAY['/images/products/top-blouse-1.jpg'], ARRAY['S', 'M', 'L'], ARRAY['Ivory', 'Lavender', 'Mint'], ARRAY['elegant', 'sale'], true, false, 1),
('660e8400-e29b-41d4-a716-446655440014', 'Casual Cotton Top', 'casual-cotton-top', 'Comfortable cotton top for everyday wear', 129.00, NULL, '550e8400-e29b-41d4-a716-446655440005', ARRAY['/images/products/top-cotton-1.jpg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['White', 'Gray', 'Navy'], ARRAY['casual', 'comfortable'], true, false, 1);

-- Insert sample products for Modest Bottoms category
INSERT INTO public.products (id, name, slug, description, price, sale_price, category_id, images, sizes, colors, tags, in_stock, is_wholesale, min_order_quantity) VALUES
('660e8400-e29b-41d4-a716-446655440015', 'Maxi Skirt', 'maxi-skirt', 'Elegant long skirt with comfortable fit', 179.00, NULL, '550e8400-e29b-41d4-a716-446655440006', ARRAY['/images/products/skirt-maxi-1.jpg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Navy', 'Brown'], ARRAY['elegant', 'versatile'], true, false, 1),
('660e8400-e29b-41d4-a716-446655440016', 'Modest Wide Leg Pants', 'modest-wide-leg-pants', 'Comfortable wide leg pants for modest styling', 199.00, NULL, '550e8400-e29b-41d4-a716-446655440006', ARRAY['/images/products/pants-wide-1.jpg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Gray', 'Beige'], ARRAY['comfortable', 'modern'], true, false, 1),
('660e8400-e29b-41d4-a716-446655440017', 'A-Line Modest Skirt', 'a-line-modest-skirt', 'Classic A-line skirt with modest length', 159.00, 129.00, '550e8400-e29b-41d4-a716-446655440006', ARRAY['/images/products/skirt-aline-1.jpg'], ARRAY['S', 'M', 'L'], ARRAY['Black', 'Navy', 'Burgundy'], ARRAY['classic', 'sale'], true, false, 1);
