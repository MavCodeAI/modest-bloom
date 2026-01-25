// Quick seed script - run this after getting your service role key
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://obtomojdduiokwubwqqw.supabase.co';
// Replace SERVICE_ROLE_KEY with your actual service role key from Supabase dashboard
const SERVICE_ROLE_KEY = 'PASTE_YOUR_SERVICE_ROLE_KEY_HERE';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Minimal seed data
const categories = [
  { id: 'cat-1', name: 'Abayas', slug: 'abayas', description: 'Elegant abayas' },
  { id: 'cat-2', name: 'Hijabs', slug: 'hijabs', description: 'Beautiful hijabs' },
  { id: 'cat-3', name: 'Modest Dresses', slug: 'modest-dresses', description: 'Stylish dresses' }
];

const products = [
  {
    id: 'prod-1',
    name: 'Classic Black Abaya',
    slug: 'classic-black-abaya',
    price: 299.00,
    category_id: 'cat-1',
    description: 'Timeless black abaya',
    in_stock: true
  },
  {
    id: 'prod-2', 
    name: 'Navy Blue Abaya',
    slug: 'navy-blue-abaya',
    price: 349.00,
    category_id: 'cat-1',
    description: 'Elegant navy abaya',
    in_stock: true
  }
];

async function quickSeed() {
  try {
    console.log('Seeding categories...');
    const { error: catError } = await supabase
      .from('categories')
      .upsert(categories);
    
    if (catError) throw catError;
    console.log('Categories seeded!');
    
    console.log('Seeding products...');
    const { error: prodError } = await supabase
      .from('products')
      .upsert(products);
    
    if (prodError) throw prodError;
    console.log('Products seeded!');
    console.log('✅ Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nMake sure you replaced SERVICE_ROLE_KEY with your actual key from:');
    console.log('https://supabase.com/dashboard/project/obtomojdduiokwubwqqw/settings/api');
  }
}

quickSeed();
