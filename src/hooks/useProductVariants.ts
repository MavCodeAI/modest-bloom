import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock: number;
  sku: string | null;
  price_override: number | null;
  created_at: string;
  updated_at: string;
}

export const useProductVariants = (productId: string | undefined) => {
  return useQuery({
    queryKey: ['product-variants', productId],
    queryFn: async () => {
      if (!productId) return [] as ProductVariant[];
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .order('color', { ascending: true });
      if (error) throw error;
      return (data || []) as ProductVariant[];
    },
    enabled: !!productId,
  });
};

export const useUpsertVariants = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      productId,
      variants,
    }: {
      productId: string;
      variants: Array<Pick<ProductVariant, 'size' | 'color' | 'stock'> & { sku?: string | null; price_override?: number | null }>;
    }) => {
      // Replace strategy: delete all then insert (simple + correct for combo changes)
      const { error: delErr } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', productId);
      if (delErr) throw delErr;

      if (variants.length === 0) return [];

      const rows = variants.map(v => ({
        product_id: productId,
        size: v.size,
        color: v.color,
        stock: v.stock,
        sku: v.sku ?? null,
        price_override: v.price_override ?? null,
      }));

      const { data, error } = await supabase
        .from('product_variants')
        .insert(rows)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['product-variants', vars.productId] });
      toast({ title: 'انوینٹری اپڈیٹ ہو گئی', description: 'Variants stock saved.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};
