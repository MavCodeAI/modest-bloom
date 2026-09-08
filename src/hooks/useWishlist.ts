import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { initialProducts } from '@/lib/data';
import type { Product } from './useProducts';

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export const useWishlist = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!user) {
        // Fallback for guest users from localStorage
        try {
          const raw = localStorage.getItem('modest_fashion_store');
          if (raw) {
            const parsed = JSON.parse(raw);
            const ids: string[] = parsed.wishlist || [];
            return ids.map((id) => {
              const matched = initialProducts.find((p) => p.id === id);
              return {
                id,
                user_id: 'guest',
                product_id: id,
                created_at: new Date().toISOString(),
                product: matched
                  ? ({
                      id: matched.id,
                      name: matched.name,
                      slug: matched.id,
                      description: matched.description,
                      price: matched.price,
                      sale_price: matched.originalPrice || null,
                      wholesale_price: null,
                      images: matched.images || [matched.image],
                      sizes: matched.sizes,
                      colors: matched.colors,
                      tags: matched.tags,
                      category_id: null,
                      in_stock: matched.inStock,
                      is_wholesale: matched.isWholesale,
                      created_at: matched.createdAt,
                      updated_at: matched.createdAt,
                    } as Product)
                  : undefined,
              } as WishlistItem;
            });
          }
        } catch {
          // ignore
        }
        return [];
      }

      try {
        const { data, error } = await supabase
          .from('wishlist')
          .select(`
            *,
            product:products(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []) as WishlistItem[];
      } catch (err) {
        console.warn('Supabase wishlist unavailable, using local store:', err);
        return [];
      }
    },
    enabled: true,
  });
};

export const useToggleWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) {
        // Guest mode toggle handled by store context
        return { action: 'toggled' };
      }

      // Check if already in wishlist
      const { data: existing, error: checkError } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (checkError) {
        console.warn('Wishlist check error:', checkError);
      }

      if (existing) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('id', existing.id);

        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlist')
          .insert({ user_id: user.id, product_id: productId });

        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        title: result.action === 'removed' ? 'Removed from Wishlist' : 'Added to Wishlist ❤️',
        description:
          result.action === 'removed'
            ? 'Item has been removed from your saved items.'
            : 'Item has been added to your saved wishlist.',
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

