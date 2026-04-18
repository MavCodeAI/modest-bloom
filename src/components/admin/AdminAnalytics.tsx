import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import {
  DollarSign,
  ShoppingBag,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Package,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { OrderWithItems } from '@/hooks/useAdminOrders';
import type { WholesaleQuote } from '@/hooks/useWholesaleQuotes';
import type { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface AdminAnalyticsProps {
  orders: OrderWithItems[];
  quotes: WholesaleQuote[];
  products: Product[];
  loading: boolean;
  onAddProduct: () => void;
  onViewOrders: () => void;
  onViewQuotes: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'hsl(var(--muted-foreground))',
  confirmed: 'hsl(var(--primary))',
  shipped: 'hsl(var(--accent))',
  delivered: 'hsl(142 71% 45%)',
  cancelled: 'hsl(var(--destructive))',
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  loading,
}: {
  label: string;
  value: string | number;
  icon: typeof DollarSign;
  trend?: string;
  loading?: boolean;
}) => (
  <Card>
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="font-serif text-2xl truncate">{value}</p>
          )}
          {trend && !loading && (
            <div className="flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export function AdminAnalytics({
  orders,
  quotes,
  products,
  loading,
  onAddProduct,
  onViewOrders,
  onViewQuotes,
}: AdminAnalyticsProps) {
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingQuotes = quotes.filter((q) => q.status === 'pending').length;
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const lowStock = products.filter((p) => !p.in_stock).length;
    return {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      pendingQuotes,
      avgOrderValue,
      lowStock,
    };
  }, [orders, quotes, products]);

  // Revenue trend (last 7 days)
  const revenueTrend = useMemo(() => {
    const days: { date: string; label: string; revenue: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString().split('T')[0];
      days.push({
        date: key,
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: 0,
        orders: 0,
      });
    }
    orders.forEach((o) => {
      const k = o.created_at.split('T')[0];
      const slot = days.find((d) => d.date === k);
      if (slot) {
        slot.revenue += o.total;
        slot.orders += 1;
      }
    });
    return days;
  }, [orders]);

  // Orders by status
  const statusBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    orders.forEach((o) => counts.set(o.status, (counts.get(o.status) || 0) + 1));
    return Array.from(counts.entries()).map(([status, count]) => ({
      name: status,
      value: count,
      color: STATUS_COLORS[status] || 'hsl(var(--muted-foreground))',
    }));
  }, [orders]);

  const recentActivity = useMemo(() => {
    const orderEvents = orders.slice(0, 4).map((o) => ({
      id: `o-${o.id}`,
      type: 'order' as const,
      title: `New order ${o.order_number}`,
      meta: `${o.customer_name} · AED ${o.total.toLocaleString()}`,
      status: o.status,
      date: o.created_at,
    }));
    const quoteEvents = quotes.slice(0, 3).map((q) => ({
      id: `q-${q.id}`,
      type: 'quote' as const,
      title: `Quote ${q.quote_number}`,
      meta: `${q.business_name} · ${q.country}`,
      status: q.status,
      date: q.created_at,
    }));
    return [...orderEvents, ...quoteEvents]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }, [orders, quotes]);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Revenue"
          value={`AED ${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+12.5%"
          loading={loading}
        />
        <StatCard
          label="Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          loading={loading}
        />
        <StatCard
          label="Avg Order"
          value={`AED ${Math.round(stats.avgOrderValue).toLocaleString()}`}
          icon={TrendingUp}
          loading={loading}
        />
        <StatCard
          label="Pending Quotes"
          value={stats.pendingQuotes}
          icon={FileText}
          loading={loading}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Revenue (Last 7 days)</CardTitle>
            <CardDescription>Daily revenue and order count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="label"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value: number, name) =>
                      name === 'revenue' ? [`AED ${value.toLocaleString()}`, 'Revenue'] : [value, 'Orders']
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#revGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Orders by Status</CardTitle>
            <CardDescription>Current breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {statusBreakdown.length === 0 ? (
              <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
                No orders yet
              </div>
            ) : (
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 8,
                        fontSize: 12,
                        textTransform: 'capitalize',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      wrapperStyle={{ fontSize: 11, textTransform: 'capitalize' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest orders and quote requests</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No activity yet
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {recentActivity.map((item) => (
                  <li
                    key={item.id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center gap-3"
                  >
                    <div
                      className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                        item.type === 'order' ? 'bg-primary/10' : 'bg-secondary/10'
                      )}
                    >
                      {item.type === 'order' ? (
                        <ShoppingBag className="h-4 w-4 text-primary" />
                      ) : (
                        <FileText className="h-4 w-4 text-secondary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.meta}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="capitalize text-[10px]">
                        {item.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {new Date(item.date).toLocaleDateString('en-AE', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Quick Actions</CardTitle>
            <CardDescription>Get things done faster</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={onAddProduct} className="w-full justify-start gap-2">
              <Package className="h-4 w-4" />
              Add new product
            </Button>
            <Button
              onClick={onViewOrders}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Manage orders
            </Button>
            <Button
              onClick={onViewQuotes}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <FileText className="h-4 w-4" />
              Review quotes
              {stats.pendingQuotes > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {stats.pendingQuotes}
                </Badge>
              )}
            </Button>

            {stats.lowStock > 0 && (
              <div className="mt-4 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-destructive" />
                  <p className="text-sm font-medium text-destructive">
                    {stats.lowStock} product{stats.lowStock !== 1 ? 's' : ''} out of stock
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Review your inventory to avoid lost sales.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
