import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: number;
  monthlyRevenue: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  total_sold: number;
  revenue: number;
}

export interface OrderStatusData {
  status: string;
  count: number;
  percentage: number;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const [
        revenueResult,
        ordersResult,
        customersResult,
        productsResult,
        pendingResult,
        lowStockResult,
        recentResult,
        monthlyResult
      ] = await Promise.all([
        // Total revenue
        supabase
          .from('orders')
          .select('total')
          .in('status', ['delivered', 'confirmed', 'processing', 'shipped']),
        
        // Total orders
        supabase
          .from('orders')
          .select('id', { count: 'exact' }),
        
        // Total customers
        supabase
          .from('profiles')
          .select('id', { count: 'exact' }),
        
        // Total products
        supabase
          .from('products')
          .select('id', { count: 'exact' }),
        
        // Pending orders
        supabase
          .from('orders')
          .select('id', { count: 'exact' })
          .eq('status', 'pending'),
        
        // Low stock products
        supabase
          .from('products')
          .select('id', { count: 'exact' })
          .eq('in_stock', false),
        
        // Recent orders (last 7 days)
        supabase
          .from('orders')
          .select('id', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        
        // Monthly revenue
        supabase
          .from('orders')
          .select('total')
          .in('status', ['delivered', 'confirmed', 'processing', 'shipped'])
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      const totalOrders = ordersResult.count || 0;
      const totalCustomers = customersResult.count || 0;
      const totalProducts = productsResult.count || 0;
      const pendingOrders = pendingResult.count || 0;
      const lowStockProducts = lowStockResult.count || 0;
      const recentOrders = recentResult.count || 0;
      const monthlyRevenue = monthlyResult.data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

      return {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
        lowStockProducts,
        recentOrders,
        monthlyRevenue
      };
    },
  });
};

export const useSalesData = (days: number = 30) => {
  return useQuery({
    queryKey: ['sales-data', days],
    queryFn: async (): Promise<SalesData[]> => {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('orders')
        .select('total, created_at')
        .in('status', ['delivered', 'confirmed', 'processing', 'shipped'])
        .gte('created_at', startDate)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by date
      const groupedData = data?.reduce((acc: { [key: string]: { revenue: number; orders: number } }, order) => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { revenue: 0, orders: 0 };
        }
        acc[date].revenue += order.total || 0;
        acc[date].orders += 1;
        return acc;
      }, {});

      return Object.entries(groupedData || {}).map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders
      }));
    },
  });
};

export const useTopProducts = (limit: number = 10) => {
  return useQuery({
    queryKey: ['top-products', limit],
    queryFn: async (): Promise<TopProduct[]> => {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          product_id,
          product_name,
          quantity,
          price
        `);

      if (error) throw error;

      // Aggregate by product
      const productMap = new Map<string, TopProduct>();
      
      data?.forEach(item => {
        const existing = productMap.get(item.product_id || '');
        if (existing) {
          existing.total_sold += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          productMap.set(item.product_id || '', {
            id: item.product_id || '',
            name: item.product_name,
            total_sold: item.quantity,
            revenue: item.price * item.quantity
          });
        }
      });

      return Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit);
    },
  });
};

export const useOrderStatusData = () => {
  return useQuery({
    queryKey: ['order-status-data'],
    queryFn: async (): Promise<OrderStatusData[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('status');

      if (error) throw error;

      // Count by status
      const statusCounts = data?.reduce((acc: { [key: string]: number }, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      const total = data?.length || 0;
      
      const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      
      return statuses.map(status => ({
        status,
        count: statusCounts?.[status] || 0,
        percentage: total > 0 ? ((statusCounts?.[status] || 0) / total) * 100 : 0
      }));
    },
  });
};

export const useRecentActivity = (limit: number = 20) => {
  return useQuery({
    queryKey: ['recent-activity', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          customer_name,
          status,
          total,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
  });
};
