import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  inStock?: boolean;
  isWholesale?: boolean;
  sortBy?: 'name' | 'price' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  category_id: string | null;
  images: string[] | null;
  sizes: string[] | null;
  colors: string[] | null;
  tags: string[] | null;
  in_stock: boolean | null;
  is_wholesale: boolean | null;
  min_order_quantity: number | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  relevance_score?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  facets: {
    categories: Array<{ id: string; name: string; count: number }>;
    sizes: Array<{ size: string; count: number }>;
    colors: Array<{ color: string; count: number }>;
    tags: Array<{ tag: string; count: number }>;
    priceRanges: Array<{ min: number; max: number; count: number }>;
  };
}

export const useAdvancedSearch = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ['advanced-search', filters],
    queryFn: async (): Promise<SearchResponse> => {
      const {
        query,
        category,
        minPrice,
        maxPrice,
        sizes,
        colors,
        tags,
        inStock,
        isWholesale,
        sortBy = 'created_at',
        sortOrder = 'desc',
        page = 1,
        limit = 20
      } = filters;

      let dbQuery = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug)
        `, { count: 'exact' });

      // Text search
      if (query) {
        dbQuery = dbQuery.or(`
          name.ilike.%${query}%, 
          description.ilike.%${query}%, 
          tags.cs.{${query}}
        `);
      }

      // Category filter
      if (category) {
        dbQuery = dbQuery.eq('category_id', category);
      }

      // Price range filter
      if (minPrice !== undefined) {
        dbQuery = dbQuery.gte('price', minPrice);
      }
      if (maxPrice !== undefined) {
        dbQuery = dbQuery.lte('price', maxPrice);
      }

      // Size filter
      if (sizes && sizes.length > 0) {
        dbQuery = dbQuery.contains('sizes', sizes);
      }

      // Color filter
      if (colors && colors.length > 0) {
        dbQuery = dbQuery.contains('colors', colors);
      }

      // Tags filter
      if (tags && tags.length > 0) {
        dbQuery = dbQuery.contains('tags', tags);
      }

      // Stock filter
      if (inStock !== undefined) {
        dbQuery = dbQuery.eq('in_stock', inStock);
      }

      // Wholesale filter
      if (isWholesale !== undefined) {
        dbQuery = dbQuery.eq('is_wholesale', isWholesale);
      }

      // Sorting
      dbQuery = dbQuery.order(sortBy, { ascending: sortOrder === 'asc' });

      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      dbQuery = dbQuery.range(from, to);

      const { data, error, count } = await dbQuery;

      if (error) throw error;

      // Calculate relevance score if there's a query
      const resultsWithScore = (data || []).map(product => {
        let score = 0;
        
        if (query) {
          const queryLower = query.toLowerCase();
          const nameMatch = product.name.toLowerCase().includes(queryLower);
          const descMatch = product.description?.toLowerCase().includes(queryLower);
          const tagMatch = product.tags?.some(tag => 
            tag.toLowerCase().includes(queryLower)
          );

          if (nameMatch) score += 10;
          if (descMatch) score += 5;
          if (tagMatch) score += 3;
        }

        return {
          ...product,
          relevance_score: score
        } as SearchResult;
      });

      // Sort by relevance score if there's a query
      if (query) {
        resultsWithScore.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
      }

      // Get facets
      const facets = await getSearchFacets(filters);

      return {
        results: resultsWithScore,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: page,
        facets
      };
    },
  });
};

const getSearchFacets = async (filters: SearchFilters) => {
  const { query, category, minPrice, maxPrice } = filters;

  let baseQuery = supabase.from('products').select(`
    category_id,
    sizes,
    colors,
    tags,
    price,
    categories!inner(name)
  `);

  // Apply same filters as main search but without pagination
  if (query) {
    baseQuery = baseQuery.or(`
      name.ilike.%${query}%, 
      description.ilike.%${query}%, 
      tags.cs.{${query}}
    `);
  }

  if (category) {
    baseQuery = baseQuery.eq('category_id', category);
  }

  if (minPrice !== undefined) {
    baseQuery = baseQuery.gte('price', minPrice);
  }

  if (maxPrice !== undefined) {
    baseQuery = baseQuery.lte('price', maxPrice);
  }

  const { data: facetData } = await baseQuery;

  if (!facetData) {
    return {
      categories: [],
      sizes: [],
      colors: [],
      tags: [],
      priceRanges: []
    };
  }

  // Calculate facets
  const categoryMap = new Map<string, { id: string; name: string; count: number }>();
  const sizeMap = new Map<string, number>();
  const colorMap = new Map<string, number>();
  const tagMap = new Map<string, number>();

  facetData.forEach(item => {
    // Categories
    if (item.category_id && item.categories) {
      const existing = categoryMap.get(item.category_id);
      if (existing) {
        existing.count++;
      } else {
        categoryMap.set(item.category_id, {
          id: item.category_id,
          name: (item.categories as { name: string }).name,
          count: 1
        });
      }
    }

    // Sizes
    item.sizes?.forEach(size => {
      sizeMap.set(size, (sizeMap.get(size) || 0) + 1);
    });

    // Colors
    item.colors?.forEach(color => {
      colorMap.set(color, (colorMap.get(color) || 0) + 1);
    });

    // Tags
    item.tags?.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  // Price ranges
  const prices = facetData.map(item => item.price).filter(p => p !== null) as number[];
  const priceRanges = calculatePriceRanges(prices);

  return {
    categories: Array.from(categoryMap.values()),
    sizes: Array.from(sizeMap.entries()).map(([size, count]) => ({ size, count })),
    colors: Array.from(colorMap.entries()).map(([color, count]) => ({ color, count })),
    tags: Array.from(tagMap.entries()).map(([tag, count]) => ({ tag, count })),
    priceRanges
  };
};

const calculatePriceRanges = (prices: number[]) => {
  if (prices.length === 0) return [];

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;
  const step = range / 5; // 5 price ranges

  const ranges = [];
  for (let i = 0; i < 5; i++) {
    const rangeMin = min + (step * i);
    const rangeMax = i === 4 ? max : min + (step * (i + 1));
    
    const count = prices.filter(p => p >= rangeMin && p < rangeMax).length;
    
    if (count > 0) {
      ranges.push({
        min: Math.round(rangeMin),
        max: Math.round(rangeMax),
        count
      });
    }
  }

  return ranges;
};

// Hook for search suggestions
export const useSearchSuggestions = (query: string, limit: number = 5) => {
  return useQuery({
    queryKey: ['search-suggestions', query, limit],
    queryFn: async (): Promise<string[]> => {
      if (!query || query.length < 2) return [];

      const { data, error } = await supabase
        .from('products')
        .select('name, tags')
        .or(`name.ilike.%${query}%, tags.cs.{${query}}`)
        .limit(limit * 2); // Get more to have better suggestions

      if (error) throw error;

      const suggestions = new Set<string>();

      data?.forEach(product => {
        // Add product name if it contains the query
        if (product.name.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(product.name);
        }

        // Add matching tags
        product.tags?.forEach(tag => {
          if (tag.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(tag);
          }
        });
      });

      return Array.from(suggestions).slice(0, limit);
    },
    enabled: query.length >= 2,
  });
};

// Hook for popular searches
export const usePopularSearches = () => {
  return useQuery({
    queryKey: ['popular-searches'],
    queryFn: async (): Promise<Array<{ term: string; count: number }>> => {
      // This would typically come from a search analytics table
      // For now, return some static popular terms
      return [
        { term: 'shirt', count: 150 },
        { term: 'pants', count: 120 },
        { term: 'dress', count: 100 },
        { term: 'jacket', count: 85 },
        { term: 'shoes', count: 75 }
      ];
    },
  });
};

// Hook for recently viewed products
export const useRecentlyViewed = (userId?: string) => {
  return useQuery({
    queryKey: ['recently-viewed', userId],
    queryFn: async () => {
      // This would typically come from a recently_viewed table
      // For now, return empty array
      return [];
    },
    enabled: !!userId,
  });
};
