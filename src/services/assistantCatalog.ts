// Live catalog access for the AI concierge.
// Pulls REAL products from the store database (no demo data).

import { supabase } from '@/integrations/supabase/client';
import { MockAssistantProduct } from '@/types/assistant';

interface CatalogCache {
  items: MockAssistantProduct[];
  fetchedAt: number;
}

let cache: CatalogCache | null = null;
const TTL_MS = 5 * 60 * 1000;

const colorName = (raw: string) => (raw || '').split(':')[0].trim();

export const loadCatalog = async (): Promise<MockAssistantProduct[]> => {
  if (cache && Date.now() - cache.fetchedAt < TTL_MS) return cache.items;

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase.from('categories').select('id, name'),
  ]);

  const catMap = new Map<string, string>();
  (categories || []).forEach((c) => catMap.set(c.id, c.name));

  const items: MockAssistantProduct[] = (products || []).map((p) => {
    const colors = (p.colors || []).map(colorName).filter(Boolean);
    const price = Number(p.sale_price ?? p.price);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      sku: `MWF-${String(p.id).slice(0, 6).toUpperCase()}`,
      price,
      originalPrice: p.sale_price ? Number(p.price) : undefined,
      wholesalePrice: p.wholesale_price ? Number(p.wholesale_price) : undefined,
      category: (p.category_id && catMap.get(p.category_id)) || 'Abayas',
      color: colors[0] || 'Black',
      colors,
      sizes: p.sizes || [],
      inStock: p.in_stock ?? true,
      image: (p.images && p.images[0]) || '/placeholder.svg',
      description: p.description || '',
      tags: p.tags || [],
      isWholesale: p.is_wholesale ?? false,
    };
  });

  cache = { items, fetchedAt: Date.now() };
  return items;
};

export const clearCatalogCache = () => {
  cache = null;
};

const haystack = (p: MockAssistantProduct) =>
  [p.name, p.category, p.description, p.color, ...(p.colors || []), ...(p.tags || [])]
    .join(' ')
    .toLowerCase();

/** Keyword search across the real catalog. */
export const searchCatalog = async (
  query: string,
  limit = 4
): Promise<MockAssistantProduct[]> => {
  const items = await loadCatalog();
  const words = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (words.length === 0) return items.slice(0, limit);

  const scored = items
    .map((p) => {
      const text = haystack(p);
      const score = words.reduce((s, w) => (text.includes(w) ? s + 1 : s), 0);
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.p);
};

export const filterCatalog = async (
  predicate: (p: MockAssistantProduct) => boolean,
  limit = 4
): Promise<MockAssistantProduct[]> => {
  const items = await loadCatalog();
  const matched = items.filter(predicate);
  return (matched.length > 0 ? matched : items).slice(0, limit);
};
