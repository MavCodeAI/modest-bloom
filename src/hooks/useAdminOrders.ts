import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export interface OrderFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  customerEmail?: string;
  orderNumber?: string;
  minTotal?: number;
  maxTotal?: number;
  paymentMethod?: string;
}

export interface OrderWithItems {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  emirate: string;
  postal_code: string | null;
  delivery_notes: string | null;
  subtotal: number;
  shipping_cost: number | null;
  cod_fee: number | null;
  total: number;
  payment_method: string;
  status: string;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  size: string;
  quantity: number;
  price: number;
  created_at: string;
}

export const useAdminOrders = (filters?: OrderFilters, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['admin-orders', filters, page, limit],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.customerEmail) {
        query = query.ilike('customer_email', `%${filters.customerEmail}%`);
      }

      if (filters?.orderNumber) {
        query = query.ilike('order_number', `%${filters.orderNumber}%`);
      }

      if (filters?.paymentMethod) {
        query = query.eq('payment_method', filters.paymentMethod);
      }

      if (filters?.minTotal) {
        query = query.gte('total', filters.minTotal);
      }

      if (filters?.maxTotal) {
        query = query.lte('total', filters.maxTotal);
      }

      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        orders: data as OrderWithItems[],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: page
      };
    },
  });
};

export const useAdminOrder = (id: string) => {
  return useQuery({
    queryKey: ['admin-order', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          profiles:profiles!inner(full_name, email, phone)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as OrderWithItems & { profiles: { full_name: string | null; email: string | null; phone: string | null } | null };
    },
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      estimatedDelivery 
    }: { 
      id: string; 
      status: string; 
      estimatedDelivery?: string | null 
    }) => {
      const updateData: TablesUpdate<'orders'> = { status };
      
      if (estimatedDelivery !== undefined) {
        updateData.estimated_delivery = estimatedDelivery;
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'آرڈر سٹیٹس اپڈیٹ ہو گیا',
        description: 'آرڈر سٹیٹس کامیابی سے اپڈیٹ ہو گیا۔',
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

export const useBulkUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      orderIds, 
      status 
    }: { 
      orderIds: string[]; 
      status: string; 
    }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .in('id', orderIds)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'بلک اپڈیٹ کامیاب',
        description: `${data.length} آرڈرز کا سٹیٹس اپڈیٹ ہو گیا۔`,
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

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'آرڈر ڈیلیٹ ہو گیا',
        description: 'آرڈر کامیابی سے ڈیلیٹ ہو گیا۔',
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

export const useExportOrders = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (filters?: OrderFilters) => {
      let query = supabase
        .from('orders')
        .select(`
          order_number,
          customer_name,
          customer_email,
          customer_phone,
          shipping_address,
          city,
          emirate,
          total,
          status,
          payment_method,
          created_at,
          items:order_items(product_name, quantity, price, size)
        `)
        .order('created_at', { ascending: false });

      // Apply same filters as useAdminOrders
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.customerEmail) {
        query = query.ilike('customer_email', `%${filters.customerEmail}%`);
      }
      if (filters?.orderNumber) {
        query = query.ilike('order_number', `%${filters.orderNumber}%`);
      }
      if (filters?.paymentMethod) {
        query = query.eq('payment_method', filters.paymentMethod);
      }
      if (filters?.minTotal) {
        query = query.gte('total', filters.minTotal);
      }
      if (filters?.maxTotal) {
        query = query.lte('total', filters.maxTotal);
      }
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'ایکسپورٹ کامیاب',
        description: 'آرڈرز ڈیٹا کامیابی سے ایکسپورٹ ہو گیا۔',
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
