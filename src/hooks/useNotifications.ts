import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  action_url?: string;
  action_text?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  read_at?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  title_template: string;
  message_template: string;
  type: 'info' | 'success' | 'warning' | 'error';
  trigger_event: string;
  is_active: boolean;
  created_at: string;
}

export const useNotifications = (unreadOnly: boolean = false) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['notifications', user?.id, unreadOnly],
    queryFn: async (): Promise<Notification[]> => {
      if (!user) return [];

      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (unreadOnly) {
        query = query.eq('read', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
  });
};

export const useUnreadNotificationCount = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unread-notification-count', user?.id],
    queryFn: async (): Promise<number> => {
      if (!user) return 0;

      const { data, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
      return data?.length || 0;
    },
    enabled: !!user,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
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

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
      toast({
        title: 'سبھی نوٹیفیکیشن پڑھے گئے',
        description: 'تمام نوٹیفیکیشنز کو پڑھا ہوا نشان زد کر دیا گیا۔',
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

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
      toast({
        title: 'نوٹیفیکیشن ڈیلیٹ ہو گیا',
        description: 'نوٹیفیکیشن کامیابی سے ڈیلیٹ ہو گیا۔',
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

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: Omit<Notification, 'id' | 'created_at' | 'read' | 'read_at'>) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
    },
  });
};

// Hook for creating order status notifications
export const useOrderNotificationService = () => {
  const createNotification = useCreateNotification();

  const notifyOrderStatusChange = async (
    userId: string | null,
    orderNumber: string,
    oldStatus: string,
    newStatus: string,
    customerEmail?: string
  ) => {
    const statusMessages: Record<string, { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }> = {
      pending: {
        title: 'آرڈر موصول ہوا',
        message: `آپ کا آرڈر ${orderNumber} موصول ہو گیا ہے۔`,
        type: 'info'
      },
      confirmed: {
        title: 'آرڈر کنفرم ہو گیا',
        message: `آپ کا آرڈر ${orderNumber} کنفرم ہو گیا ہے۔`,
        type: 'success'
      },
      processing: {
        title: 'آرڈر پر کارروائی جاری ہے',
        message: `آپ کا آرڈر ${orderNumber} تیار ہو رہا ہے۔`,
        type: 'info'
      },
      shipped: {
        title: 'آرڈر بھیج دیا گیا',
        message: `آپ کا آرڈر ${orderNumber} بھیج دیا گیا ہے۔`,
        type: 'success'
      },
      delivered: {
        title: 'آرڈر پہنچ گیا',
        message: `آپ کا آرڈر ${orderNumber} کامیابی سے پہنچ گیا ہے۔`,
        type: 'success'
      },
      cancelled: {
        title: 'آرڈر منسوخ ہو گیا',
        message: `آپ کا آرڈر ${orderNumber} منسوخ کر دیا گیا ہے۔`,
        type: 'warning'
      }
    };

    const notification = statusMessages[newStatus];
    if (!notification) return;

    // Create notification for logged-in user
    if (userId) {
      await createNotification.mutateAsync({
        user_id: userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        action_url: `/orders/${orderNumber}`,
        action_text: 'آرڈر دیکھیں',
        metadata: {
          order_number: orderNumber,
          old_status: oldStatus,
          new_status: newStatus
        }
      });
    }

    // Here you could also implement email notification for guest orders
    if (customerEmail && !userId) {
      // Send email notification (implement email service)
      // TODO: Implement proper email service
      // console.log(`Email notification sent to ${customerEmail}: ${notification.title}`);
    }
  };

  return { notifyOrderStatusChange };
};

// Hook for stock notifications
export const useStockNotificationService = () => {
  const createNotification = useCreateNotification();

  const notifyLowStock = async (productName: string, currentStock: number) => {
    // Get all admin users
    const { data: adminUsers } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (!adminUsers) return;

    const notifications = adminUsers.map(admin => 
      createNotification.mutateAsync({
        user_id: admin.user_id,
        title: 'کم اسٹاک کا الرٹ',
        message: `پروڈکٹ ${productName} کا اسٹاک کم ہو رہا ہے۔ موجودہ اسٹاک: ${currentStock}`,
        type: 'warning',
        action_url: '/admin/inventory',
        action_text: 'اسٹیک مینج کریں',
        metadata: {
          product_name: productName,
          current_stock: currentStock
        }
      })
    );

    await Promise.all(notifications);
  };

  return { notifyLowStock };
};
