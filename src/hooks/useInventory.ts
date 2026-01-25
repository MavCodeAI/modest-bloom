import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InventoryItem {
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
  current_stock: number;
  reserved_stock: number;
  available_stock: number;
  low_stock_threshold: number;
  last_restocked: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface StockMovement {
  id: string;
  product_id: string;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  notes: string | null;
  created_at: string;
  product?: {
    name: string;
    slug: string;
  };
}

export interface LowStockAlert {
  product_id: string;
  product_name: string;
  current_stock: number;
  min_order_quantity: number;
  days_since_last_sale: number;
}

export const useInventory = (filters?: {
  category?: string;
  inStock?: boolean;
  lowStock?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['inventory', filters],
    queryFn: async (): Promise<InventoryItem[]> => {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters?.inStock !== undefined) {
        query = query.eq('in_stock', filters.inStock);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculate stock information
      const productsWithStock = await Promise.all(
        (data || []).map(async (product) => {
          // Get current stock from order items
          const { data: orderItems } = await supabase
            .from('order_items')
            .select('quantity')
            .eq('product_id', product.id);

          const totalSold = orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
          const currentStock = product.min_order_quantity || 0;
          const reservedStock = 0; // Could be calculated from pending orders
          const availableStock = currentStock - reservedStock;

          return {
            ...product,
            current_stock: currentStock,
            reserved_stock: reservedStock,
            available_stock: availableStock,
            low_stock_threshold: Math.max(1, Math.floor((product.min_order_quantity || 1) * 0.2)),
            last_restocked: product.updated_at
          } as InventoryItem;
        })
      );

      // Filter by low stock if requested
      if (filters?.lowStock) {
        return productsWithStock.filter(item => 
          item.available_stock <= item.low_stock_threshold
        );
      }

      return productsWithStock;
    },
  });
};

// Stock movements functionality - currently without database table
// These are placeholder functions that work with product min_order_quantity
export const useStockMovements = (productId?: string) => {
  return useQuery({
    queryKey: ['stock-movements', productId],
    queryFn: async (): Promise<StockMovement[]> => {
      // Since stock_movements table doesn't exist, return empty array
      // Stock is tracked via min_order_quantity field in products table
      return [];
    },
  });
};

export const useLowStockAlerts = () => {
  return useQuery({
    queryKey: ['low-stock-alerts'],
    queryFn: async (): Promise<LowStockAlert[]> => {
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          min_order_quantity,
          created_at
        `)
        .eq('in_stock', true);

      if (error) throw error;

      const alerts: LowStockAlert[] = [];

      for (const product of products || []) {
        // Get recent sales (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const { data: recentSales } = await supabase
          .from('order_items')
          .select('quantity')
          .eq('product_id', product.id)
          .gte('created_at', thirtyDaysAgo);

        const currentStock = product.min_order_quantity || 0;
        const lowStockThreshold = Math.max(1, Math.floor(currentStock * 0.2));

        if (currentStock <= lowStockThreshold) {
          alerts.push({
            product_id: product.id,
            product_name: product.name,
            current_stock: currentStock,
            min_order_quantity: product.min_order_quantity || 1,
            days_since_last_sale: 0 // Could be calculated from last sale date
          });
        }
      }

      return alerts;
    },
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
      movementType,
      reason,
      notes
    }: {
      productId: string;
      quantity: number;
      movementType: 'in' | 'out' | 'adjustment';
      reason: string;
      notes?: string;
    }) => {
      // First, get the product's current stock
      const { data: currentProduct } = await supabase
        .from('products')
        .select('min_order_quantity')
        .eq('id', productId)
        .single();

      if (!currentProduct) throw new Error('Product not found');

      let newStock = currentProduct.min_order_quantity || 0;
      
      if (movementType === 'in') {
        newStock += quantity;
      } else if (movementType === 'out') {
        newStock -= quantity;
      } else if (movementType === 'adjustment') {
        newStock = quantity;
      }

      // Update the product's stock using min_order_quantity field
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          min_order_quantity: newStock,
          in_stock: newStock > 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (updateError) throw updateError;

      return { productId, newStock };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'اسٹاک اپڈیٹ ہو گیا',
        description: 'پروڈکٹ اسٹاک کامیابی سے اپڈیٹ ہو گیا۔',
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

export const useBulkUpdateStock = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      updates
    }: {
      updates: Array<{
        productId: string;
        quantity: number;
        movementType: 'in' | 'out' | 'adjustment';
        reason: string;
        notes?: string;
      }>;
    }) => {
      const results = [];

      for (const update of updates) {
        try {
          const { data: currentProduct } = await supabase
            .from('products')
            .select('min_order_quantity')
            .eq('id', update.productId)
            .single();

          if (!currentProduct) continue;

          let newStock = currentProduct.min_order_quantity || 0;
          
          if (update.movementType === 'in') {
            newStock += update.quantity;
          } else if (update.movementType === 'out') {
            newStock -= update.quantity;
          } else if (update.movementType === 'adjustment') {
            newStock = update.quantity;
          }

          await supabase
            .from('products')
            .update({ 
              min_order_quantity: newStock,
              in_stock: newStock > 0,
              updated_at: new Date().toISOString()
            })
            .eq('id', update.productId);

          results.push({ productId: update.productId, success: true });
        } catch (error) {
          results.push({ productId: update.productId, success: false, error });
        }
      }

      return results;
    },
    onSuccess: (results) => {
      const successCount = results.filter(r => r.success).length;
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'بلک اپڈیٹ کامیاب',
        description: `${successCount} پروڈکٹس کا اسٹاک اپڈیٹ ہو گیا۔`,
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
