import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://obtomojdduiokwubwqqw.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9idG9tb2pkZHVpb2t3dWJ3cXF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI0MDc0MCwiZXhwIjoyMDg0ODE2NzQwfQ.example'; // You'll need to provide the service key

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Sample categories data
const categories = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Abayas',
    slug: 'abayas',
    description: 'Elegant and modest abayas for every occasion',
    image_url: '/images/categories/abayas.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Hijabs',
    slug: 'hijabs',
    description: 'Beautiful hijabs in various colors and materials',
    image_url: '/images/categories/hijabs.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Modest Dresses',
    slug: 'modest-dresses',
    description: 'Stylish modest dresses for modern women',
    image_url: '/images/categories/dresses.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Prayer Outfits',
    slug: 'prayer-outfits',
    description: 'Comfortable prayer outfits for daily use',
    image_url: '/images/categories/prayer.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Modest Tops',
    slug: 'modest-tops',
    description: 'Modest tops and blouses for everyday wear',
    image_url: '/images/categories/tops.jpg'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Modest Bottoms',
    slug: 'modest-bottoms',
    description: 'Modest skirts and pants for complete outfits',
    image_url: '/images/categories/bottoms.jpg'
  }
];

// Sample products data
const products = [
  // Abayas
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    name: 'Classic Black Abaya',
    slug: 'classic-black-abaya',
    description: 'Timeless black abaya with elegant embroidery',
    price: 299.00,
    sale_price: 249.00,
    category_id: '550e8400-e29b-41d4-a716-446655440001',
    images: ['/images/products/abaya-black-1.jpg', '/images/products/abaya-black-2.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    tags: ['classic', 'bestseller'],
    in_stock: true,
    is_wholesale: false,
    min_order_quantity: 1
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    name: 'Navy Blue Elegant Abaya',
    slug: 'navy-blue-elegant-abaya',
    description: 'Sophisticated navy blue abaya with subtle details',
    price: 349.00,
    sale_price: null,
    category_id: '550e8400-e29b-41d4-a716-446655440001',
    images: ['/images/products/abaya-navy-1.jpg', '/images/products/abaya-navy-2.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy'],
    tags: ['elegant', 'new'],
    in_stock: true,
    is_wholesale: false,
    min_order_quantity: 1
  },
  // Add more products as needed...
];

async function seedDatabase() {
  try {
    console.log('Seeding categories...');
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'id' });

    if (categoriesError) {
      console.error('Error inserting categories:', categoriesError);
      return;
    }

    console.log('Categories seeded successfully!');

    console.log('Seeding products...');
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .upsert(products, { onConflict: 'id' });

    if (productsError) {
      console.error('Error inserting products:', productsError);
      return;
    }

    console.log('Products seeded successfully!');
    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
