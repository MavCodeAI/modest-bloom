import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { initialProducts, categories as defaultCategories } from '@/lib/data';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  wholesale_price: number | null;
  category_id: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  tags: string[];
  in_stock: boolean;
  is_wholesale: boolean;
  min_order_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

const mapInitialProducts = (): Product[] => {
  return initialProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.name.toLowerCase().replace(/\s+/g, '-'),
    description: p.description,
    price: p.price,
    sale_price: p.originalPrice || null,
    wholesale_price: p.isWholesale ? Math.round(p.price * 0.7) : null,
    category_id: p.category,
    images: p.images && p.images.length > 0 ? p.images : [p.image],
    sizes: p.sizes || ['50', '52', '54', '56', '58', '60'],
    colors: p.colors || [],
    tags: p.tags || [],
    in_stock: p.inStock ?? true,
    is_wholesale: p.isWholesale ?? false,
    min_order_quantity: 1,
    created_at: p.createdAt || '2024-01-01',
    updated_at: p.createdAt || '2024-01-01',
  }));
};

export const useProducts = (options?: { category?: string; tag?: string; search?: string }) => {
  return useQuery({
    queryKey: ['products', options],
    queryFn: async () => {
      try {
        let query = supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .order('created_at', { ascending: false });

        if (options?.tag) {
          query = query.contains('tags', [options.tag]);
        }

        if (options?.search) {
          query = query.ilike('name', `%${options.search}%`);
        }

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
          let list = mapInitialProducts();
          if (options?.category) {
            list = list.filter((p) => p.category_id === options.category);
          }
          if (options?.tag) {
            list = list.filter((p) => p.tags.includes(options.tag!));
          }
          if (options?.search) {
            list = list.filter((p) => p.name.toLowerCase().includes(options.search!.toLowerCase()));
          }
          return list;
        }
        return data as Product[];
      } catch {
        let list = mapInitialProducts();
        if (options?.category) {
          list = list.filter((p) => p.category_id === options.category);
        }
        if (options?.tag) {
          list = list.filter((p) => p.tags.includes(options.tag!));
        }
        if (options?.search) {
          list = list.filter((p) => p.name.toLowerCase().includes(options.search!.toLowerCase()));
        }
        return list;
      }
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          const fallback = mapInitialProducts().find((p) => p.id === id);
          if (fallback) return fallback;
          throw error || new Error('Product not found');
        }
        return data as Product;
      } catch {
        const fallback = mapInitialProducts().find((p) => p.id === id);
        if (fallback) return fallback;
        throw new Error('Product not found');
      }
    },
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error || !data || data.length === 0) {
          return defaultCategories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.id,
            description: `${c.name} collection`,
            image_url: null,
            created_at: '2024-01-01',
          })) as Category[];
        }
        return data as Category[];
      } catch {
        return defaultCategories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.id,
          description: `${c.name} collection`,
          image_url: null,
          created_at: '2024-01-01',
        })) as Category[];
      }
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'پروڈکٹ شامل ہو گئی',
        description: 'نئی پروڈکٹ کامیابی سے شامل ہو گئی۔',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...product }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'پروڈکٹ اپڈیٹ ہو گئی',
        description: 'پروڈکٹ کامیابی سے اپڈیٹ ہو گئی۔',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'پروڈکٹ ڈیلیٹ ہو گئی',
        description: 'پروڈکٹ کامیابی سے ڈیلیٹ ہو گئی۔',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
