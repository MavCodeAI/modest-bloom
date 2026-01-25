import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://obtomojdduiokwubwqqw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9idG9tb2pkZHVpb2t3dWJ3cXF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNDA3NDAsImV4cCI6MjA4NDgxNjc0MH0.nndlHWJ_6k4quo3rkY24sxEu5HMzzR-26X6R2Jt_Eh8';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test if we can read from categories table
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Connection error:', error);
      return;
    }
    
    console.log('Connection successful!');
    console.log('Categories found:', data?.length || 0);
    
    // Test if we can read from products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (productsError) {
      console.error('Products table error:', productsError);
    } else {
      console.log('Products found:', products?.length || 0);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testConnection();
