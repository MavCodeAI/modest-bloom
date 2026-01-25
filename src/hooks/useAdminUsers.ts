import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminUser {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
  total_orders?: number;
  total_spent?: number;
  is_active: boolean;
}

export interface UserFilters {
  role?: 'admin' | 'user';
  search?: string;
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
  minOrders?: number;
  minSpent?: number;
}

export const useAdminUsers = (filters?: UserFilters, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['admin-users', filters, page, limit],
    queryFn: async () => {
      // First get profiles
      let profileQuery = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters?.search) {
        profileQuery = profileQuery.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
      }

      if (filters?.dateFrom) {
        profileQuery = profileQuery.gte('created_at', filters.dateFrom);
      }

      if (filters?.dateTo) {
        profileQuery = profileQuery.lte('created_at', filters.dateTo);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      profileQuery = profileQuery.range(from, to);

      const { data: profiles, error: profileError, count } = await profileQuery;

      if (profileError) throw profileError;

      // Get roles for each user
      const userIds = profiles?.map(p => p.user_id) || [];
      
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      const roleMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);

      // Get additional user stats
      const usersWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Get order stats
          const { data: orderStats } = await supabase
            .from('orders')
            .select('total')
            .eq('user_id', profile.user_id);

          const totalOrders = orderStats?.length || 0;
          const totalSpent = orderStats?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

          // Check if user meets additional filters
          if (filters?.minOrders && totalOrders < filters.minOrders) {
            return null;
          }

          if (filters?.minSpent && totalSpent < filters.minSpent) {
            return null;
          }

          const role = roleMap.get(profile.user_id) || 'user';
          
          if (filters?.role && role !== filters.role) {
            return null;
          }

          return {
            id: profile.id,
            user_id: profile.user_id,
            email: profile.email,
            full_name: profile.full_name,
            phone: profile.phone,
            role: role as 'admin' | 'user',
            created_at: profile.created_at,
            updated_at: profile.updated_at,
            total_orders: totalOrders,
            total_spent: totalSpent,
            is_active: true
          } as AdminUser;
        })
      );

      // Filter out null results and apply active filter if needed
      let filteredUsers = usersWithStats.filter(user => user !== null) as AdminUser[];
      
      if (filters?.isActive !== undefined) {
        filteredUsers = filteredUsers.filter(user => user.is_active === filters.isActive);
      }

      return {
        users: filteredUsers,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: page
      };
    },
  });
};

export const useAdminUser = (userId: string) => {
  return useQuery({
    queryKey: ['admin-user', userId],
    queryFn: async () => {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      // Get user's role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      // Get user's orders
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total,
          status,
          created_at,
          items:order_items(quantity, product_name, price)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Get user's wishlist
      const { data: wishlist } = await supabase
        .from('wishlist')
        .select(`
          *,
          product:products(name, price, images)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const totalOrders = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

      return {
        id: profile.id,
        user_id: profile.user_id,
        email: profile.email,
        full_name: profile.full_name,
        phone: profile.phone,
        role: (roleData?.role || 'user') as 'admin' | 'user',
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        total_orders: totalOrders,
        total_spent: totalSpent,
        is_active: true,
        orders: orders || [],
        wishlist: wishlist || []
      } as AdminUser & { orders: any[]; wishlist: any[] };
    },
    enabled: !!userId,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      role 
    }: { 
      userId: string; 
      role: 'admin' | 'user' 
    }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: role
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user'] });
      toast({
        title: 'یوزر رول اپڈیٹ ہو گیا',
        description: 'یوزر کا رول کامیابی سے اپڈیٹ ہو گیا۔',
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

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      // This would typically update a status field in the users table
      // For now, we'll just remove the user's roles
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user'] });
      toast({
        title: 'یوزر ڈی ایکٹیویٹ ہو گیا',
        description: 'یوزر کامیابی سے ڈی ایکٹیویٹ ہو گیا۔',
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

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      // Delete user's profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Delete user's roles
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) throw roleError;

      // Note: Deleting from auth.users requires admin privileges
      // This would typically be done through a server function
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'یوزر ڈیلیٹ ہو گیا',
        description: 'یوزر کامیابی سے ڈیلیٹ ہو گیا۔',
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

export const useUserStats = () => {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const [
        totalUsers,
        adminUsers,
        activeUsers,
        newUsers,
        usersWithOrders
      ] = await Promise.all([
        // Total users
        supabase
          .from('profiles')
          .select('id', { count: 'exact' }),
        
        // Admin users
        supabase
          .from('user_roles')
          .select('id', { count: 'exact' })
          .eq('role', 'admin'),
        
        // Active users (signed in last 30 days)
        supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        
        // New users (last 30 days)
        supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        
        // Users with orders
        supabase
          .from('orders')
          .select('user_id', { count: 'exact', head: true })
          .not('user_id', 'is', null)
      ]);

      return {
        totalUsers: totalUsers.count || 0,
        adminUsers: adminUsers.count || 0,
        activeUsers: activeUsers.count || 0,
        newUsers: newUsers.count || 0,
        usersWithOrders: usersWithOrders.count || 0
      };
    },
  });
};

export const useExportUsers = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (filters?: UserFilters) => {
      let query = supabase
        .from('profiles')
        .select(`
          user_id,
          full_name,
          phone,
          email,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'ایکسپورٹ کامیاب',
        description: 'یوزر ڈیٹا کامیابی سے ایکسپورٹ ہو گیا۔',
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
