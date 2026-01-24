// Export all hooks from a central location

// Product hooks
export * from './useProducts';

// Order hooks
export { 
  useOrders, 
  useOrder, 
  useCreateOrder,
  type OrderItem,
  type Order 
} from './useOrders';

export { 
  useAdminOrders, 
  useAdminOrder, 
  useUpdateOrderStatus as useAdminUpdateOrderStatus,
  useBulkUpdateOrderStatus,
  useDeleteOrder as useAdminDeleteOrder,
  useExportOrders,
  type OrderFilters,
  type OrderWithItems 
} from './useAdminOrders';

// User management hooks
export * from './useAdminUsers';

// Inventory management hooks
export * from './useInventory';

// Notification hooks
export * from './useNotifications';

// File upload hooks
export * from './useFileUpload';

// Search hooks
export * from './useAdvancedSearch';

// Wholesale hooks
export * from './useWholesaleQuotes';

// Wishlist hooks
export * from './useWishlist';

// Analytics hooks
export * from './useAdminAnalytics';
