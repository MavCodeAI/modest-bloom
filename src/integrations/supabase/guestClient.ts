import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

/**
 * Client used only during guest checkout. It sends the private checkout code
 * so the guest can read back the order they just created (and nothing else).
 */
export const createGuestCheckoutClient = (guestToken: string) =>
  createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'x-guest-token': guestToken } },
  });
