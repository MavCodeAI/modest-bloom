import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Eye, 
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  useAdminOrders,
  useAdminUpdateOrderStatus,
  useBulkUpdateOrderStatus,
  useAdminDeleteOrder,
  useExportOrders,
  type OrderWithItems,
  type OrderFilters
} from '@/hooks';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-purple-100 text-purple-800 border-purple-200',
  shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  confirmed: <CheckCircle className="h-4 w-4" />,
  processing: <Clock className="h-4 w-4" />,
  shipped: <Truck className="h-4 w-4" />,
  delivered: <CheckCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
};

const OrderTableRow = ({ 
  order, 
  onView,
  onUpdateStatus,
  isSelected,
  onSelect
}: {
  order: OrderWithItems;
  onView: (order: OrderWithItems) => void;
  onUpdateStatus: (id: string, status: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(order.id)}
        />
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{order.order_number}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{order.customer_name}</p>
          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <p className="text-sm">{order.shipping_address}</p>
          <p className="text-sm text-muted-foreground">
            {order.city}, {order.emirate}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-right">
          <p className="font-medium">AED {order.total.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">
            {order.items?.length || 0} items
          </p>
        </div>
      </TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          className={cn("gap-1", statusColors[order.status])}
        >
          {statusIcons[order.status]}
          {order.status}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(order)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'confirmed')}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Confirmed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'processing')}>
              <Clock className="h-4 w-4 mr-2" />
              Mark Processing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'shipped')}>
              <Truck className="h-4 w-4 mr-2" />
              Mark Shipped
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'delivered')}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Delivered
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onUpdateStatus(order.id, 'cancelled')}
              className="text-red-600"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

const OrderDetailsDialog = ({ 
  order, 
  open, 
  onClose, 
  onUpdateStatus 
}: {
  order: OrderWithItems | null;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (status: string) => void;
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Order Details - {order.order_number}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="font-medium mb-3">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{order.customer_email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.customer_phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{order.payment_method}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Shipping Information */}
            <div>
              <h3 className="font-medium mb-3">Shipping Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">{order.shipping_address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">City</p>
                    <p className="font-medium">{order.city}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Emirate</p>
                    <p className="font-medium">{order.emirate}</p>
                  </div>
                </div>
                {order.postal_code && (
                  <div>
                    <p className="text-muted-foreground">Postal Code</p>
                    <p className="font-medium">{order.postal_code}</p>
                  </div>
                )}
                {order.delivery_notes && (
                  <div>
                    <p className="text-muted-foreground">Delivery Notes</p>
                    <p className="font-medium">{order.delivery_notes}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="font-medium mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.product_image && (
                        <img 
                          src={item.product_image} 
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Size: {item.size} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">AED {item.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        AED {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div>
              <h3 className="font-medium mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p className="font-medium">AED {order.subtotal.toLocaleString()}</p>
                </div>
                {order.shipping_cost && (
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Shipping Cost</p>
                    <p className="font-medium">AED {order.shipping_cost.toLocaleString()}</p>
                  </div>
                )}
                {order.cod_fee && (
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">COD Fee</p>
                    <p className="font-medium">AED {order.cod_fee.toLocaleString()}</p>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-base font-medium">
                  <p>Total</p>
                  <p className="text-primary">AED {order.total.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div>
              <h3 className="font-medium mb-3">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(statusColors).map((status) => (
                  <Button
                    key={status}
                    variant={order.status === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdateStatus(status)}
                    disabled={order.status === status}
                    className="gap-2"
                  >
                    {statusIcons[status]}
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

interface AdminOrdersProps {
  onViewOrder?: (order: OrderWithItems) => void;
}

export const AdminOrders = ({ onViewOrder }: AdminOrdersProps) => {
  const [filters, setFilters] = useState<OrderFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  
  const { toast } = useToast();
  
  const { data: ordersData, isLoading, error } = useAdminOrders(filters, currentPage);
  const updateStatusMutation = useAdminUpdateOrderStatus();
  const bulkUpdateMutation = useBulkUpdateOrderStatus();
  const deleteMutation = useAdminDeleteOrder();
  const exportMutation = useExportOrders();

  const handleUpdateOrderStatus = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleViewOrder = (order: OrderWithItems) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
    onViewOrder?.(order);
  };

  const handleSelectOrder = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) 
        ? prev.filter(o => o !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === ordersData?.orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(ordersData?.orders.map(o => o.id) || []);
    }
  };

  const handleBulkUpdate = (status: string) => {
    if (selectedOrders.length === 0) return;
    
    bulkUpdateMutation.mutate({
      orderIds: selectedOrders,
      status
    });
    setSelectedOrders([]);
  };

  const handleExport = () => {
    exportMutation.mutate(filters);
  };

  const filteredOrders = ordersData?.orders.filter(order => {
    if (searchTerm && !order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading orders: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif">Orders</h2>
          <p className="text-muted-foreground">
            Manage customer orders ({ordersData?.totalCount || 0} total)
          </p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export Orders
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {Object.values(filters).filter(v => v !== undefined).length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {Object.values(filters).filter(v => v !== undefined).length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Orders</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Payment Method</label>
                  <Select
                    value={filters.paymentMethod}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, paymentMethod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Methods" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Methods</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                      <SelectItem value="card_on_delivery">Card on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="space-y-2">
                    <Input
                      type="date"
                      placeholder="From"
                      value={filters.dateFrom || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    />
                    <Input
                      type="date"
                      placeholder="To"
                      value={filters.dateTo || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {selectedOrders.length} orders selected
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleBulkUpdate('confirmed')}
          >
            Mark Confirmed
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleBulkUpdate('processing')}
          >
            Mark Processing
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleBulkUpdate('shipped')}
          >
            Mark Shipped
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelectedOrders([])}>
            Clear Selection
          </Button>
        </div>
      )}

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.length === filteredOrders?.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Shipping</TableCell>
                <TableCell className="text-right">Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders?.map((order) => (
                <OrderTableRow
                  key={order.id}
                  order={order}
                  onView={handleViewOrder}
                  onUpdateStatus={handleUpdateOrderStatus}
                  isSelected={selectedOrders.includes(order.id)}
                  onSelect={handleSelectOrder}
                />
              ))}
              {filteredOrders?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {ordersData && ordersData.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, ordersData.totalCount)} of {ordersData.totalCount} orders
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {ordersData.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(ordersData.totalPages, prev + 1))}
              disabled={currentPage === ordersData.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        order={selectedOrder}
        open={isOrderDetailsOpen}
        onClose={() => setIsOrderDetailsOpen(false)}
        onUpdateStatus={(status) => {
          if (selectedOrder) {
            handleUpdateOrderStatus(selectedOrder.id, status);
          }
        }}
      />
    </div>
  );
};
