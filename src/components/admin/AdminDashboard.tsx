import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Package,
  ShoppingCart,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useDashboardStats,
  useRecentActivity,
  useTopProducts,
  useOrderStatusData,
  useSalesData
} from '@/hooks';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard = ({ title, value, change, changeLabel, icon, trend = 'neutral' }: StatCardProps) => {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : null;
  
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-serif">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                {TrendIcon && (
                  <TrendIcon 
                    className={cn(
                      "h-3 w-3",
                      trend === 'up' ? "text-green-500" : trend === 'down' ? "text-red-500" : "text-muted-foreground"
                    )} 
                  />
                )}
                <span className={cn(
                  "text-xs",
                  trend === 'up' ? "text-green-500" : trend === 'down' ? "text-red-500" : "text-muted-foreground"
                )}>
                  {change > 0 ? '+' : ''}{change}% {changeLabel}
                </span>
              </div>
            )}
          </div>
          <div className="text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface RecentOrderProps {
  order: any;
  onView: (id: string) => void;
}

const RecentOrder = ({ order, onView }: RecentOrderProps) => {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    processing: 'bg-purple-100 text-purple-800 border-purple-200',
    shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <ShoppingCart className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm">{order.customer_name}</p>
          <p className="text-xs text-muted-foreground">{order.order_number}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-medium text-sm">AED {order.total.toLocaleString()}</p>
          <Badge 
            variant="outline" 
            className={cn("text-xs", statusColors[order.status])}
          >
            {order.status}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(order.id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface TopProductProps {
  product: any;
  index: number;
}

const TopProduct = ({ product, index }: TopProductProps) => {
  return (
    <div className="text-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
        <Package className="h-6 w-6 text-primary" />
      </div>
      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
        {index + 1}
      </div>
      <p className="font-medium text-sm truncate">{product.name}</p>
      <p className="text-xs text-muted-foreground">{product.total_sold} sold</p>
      <p className="text-sm font-serif text-primary mt-1">AED {product.revenue.toLocaleString()}</p>
    </div>
  );
};

interface AdminDashboardProps {
  onViewOrder: (id: string) => void;
  onViewAllOrders: () => void;
  onViewProducts: () => void;
  onViewQuotes: () => void;
}

export const AdminDashboard = ({ 
  onViewOrder, 
  onViewAllOrders, 
  onViewProducts, 
  onViewQuotes 
}: AdminDashboardProps) => {
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity(5);
  const { data: topProducts, isLoading: productsLoading } = useTopProducts(5);
  const { data: orderStatusData, isLoading: statusLoading } = useOrderStatusData();
  const { data: salesData, isLoading: salesLoading } = useSalesData(parseInt(timeRange));

  const isLoading = statsLoading || activityLoading || productsLoading || statusLoading || salesLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Add New Product",
      description: "Create a new product listing",
      icon: <Package className="h-4 w-4" />,
      action: onViewProducts,
      variant: "default" as const
    },
    {
      title: "View All Orders",
      description: "Manage customer orders",
      icon: <ShoppingCart className="h-4 w-4" />,
      action: onViewAllOrders,
      variant: "outline" as const
    },
    {
      title: "Manage Quotes",
      description: "Review wholesale requests",
      icon: <FileText className="h-4 w-4" />,
      action: onViewQuotes,
      variant: "outline" as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`AED ${(stats?.totalRevenue || 0).toLocaleString()}`}
          change={12.5}
          changeLabel="from last month"
          trend="up"
          icon={<DollarSign className="h-8 w-8" />}
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          change={8.2}
          changeLabel="from last month"
          trend="up"
          icon={<ShoppingCart className="h-8 w-8" />}
        />
        <StatCard
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
          change={-2.1}
          changeLabel="from last week"
          trend="down"
          icon={<FileText className="h-8 w-8" />}
        />
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockProducts || 0}
          changeLabel="items need restock"
          icon={<AlertTriangle className="h-8 w-8" />}
          trend="neutral"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="border-border lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif text-lg">Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onViewAllOrders}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {recentActivity?.map((order) => (
                  <RecentOrder
                    key={order.id}
                    order={order}
                    onView={onViewOrder}
                  />
                ))}
                {(!recentActivity || recentActivity.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent orders
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.action}
                className="w-full justify-start gap-2"
              >
                {action.icon}
                {action.title}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Top Products</CardTitle>
            <CardDescription>Best performing items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {topProducts?.map((product, index) => (
                <TopProduct
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
              {(!topProducts || topProducts.length === 0) && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No products available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Order Status</CardTitle>
            <CardDescription>Current order distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderStatusData?.map((status) => (
                <div key={status.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{status.status}</span>
                    <span className="text-sm text-muted-foreground">{status.count}</span>
                  </div>
                  <Progress value={status.percentage} className="h-2" />
                </div>
              ))}
              {(!orderStatusData || orderStatusData.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No order data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
