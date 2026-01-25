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

// Since notifications table doesn't exist, we'll use in-memory notifications
// and provide hooks that will work when the table is created later

export const useNotifications = (unreadOnly: boolean = false) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['notifications', user?.id, unreadOnly],
    queryFn: async (): Promise<Notification[]> => {
      // Return empty array since notifications table doesn't exist
      return [];
    },
    enabled: !!user,
  });
};

export const useUnreadNotificationCount = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unread-notification-count', user?.id],
    queryFn: async (): Promise<number> => {
      // Return 0 since notifications table doesn't exist
      return 0;
    },
    enabled: !!user,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      // Placeholder - would update when notifications table exists
      return { id: notificationId };
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
      // Placeholder - would update when notifications table exists
      return null;
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
      // Placeholder - would delete when notifications table exists
      return null;
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
      // Placeholder - would insert when notifications table exists
      return { 
        id: crypto.randomUUID(), 
        ...notification, 
        read: false, 
        created_at: new Date().toISOString() 
      };
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

    // Create notification for logged-in user (currently just logs since table doesn't exist)
    if (userId) {
      try {
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
      } catch (error) {
        // Silently fail since table doesn't exist
        console.log('Notification would be sent:', notification);
      }
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

    // Currently just logs since table doesn't exist
    console.log(`Low stock alert for ${productName}: ${currentStock} remaining`);
  };

  return { notifyLowStock };
};
