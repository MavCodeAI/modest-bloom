import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Package, 
  FileText, 
  ShoppingBag,
  Check,
  X,
  Menu,
  Eye,
  Truck,
  Clock,
  Search,
  Download,
  BarChart3,
  TrendingUp,
  DollarSign,
  LogOut,
  RefreshCw,
  MoreVertical,
  ArrowUpRight,
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/useAdminAuth';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, Product } from '@/hooks/useProducts';
import { useAdminOrders, useUpdateOrderStatus, OrderWithItems } from '@/hooks/useAdminOrders';
import { useWholesaleQuotes, useUpdateQuoteStatus, WholesaleQuote } from '@/hooks/useWholesaleQuotes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const productSchema = z.object({
  name: z.string().min(2, 'Name required'),
  slug: z.string().min(2, 'Slug required'),
  price: z.number().min(1, 'Price required'),
  sale_price: z.number().nullable().optional(),
  description: z.string().min(10, 'Description required'),
  images: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  is_wholesale: z.boolean(),
  in_stock: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

const Admin = () => {
  const { logout } = useAdminAuth();
  const { toast } = useToast();
  
  // Data hooks
  const { data: products, isLoading: loadingProducts, refetch: refetchProducts } = useProducts();
  const { data: ordersData, isLoading: loadingOrders } = useAdminOrders();
  const { data: quotes, isLoading: loadingQuotes } = useWholesaleQuotes();
  
  const orders = ordersData?.orders || [];
  
  // Mutations
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const updateOrderStatus = useUpdateOrderStatus();
  const updateQuoteStatus = useUpdateQuoteStatus();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'quotes' | 'orders'>('dashboard');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      is_wholesale: false,
      in_stock: true,
      sizes: ['50', '52', '54', '56', '58', '60'],
      tags: ['new_drop'],
      images: [],
      colors: [],
    },
  });

  const openNewProduct = () => {
    setEditingProduct(null);
    reset({
      name: '',
      slug: '',
      price: 0,
      sale_price: null,
      description: '',
      images: [],
      sizes: ['50', '52', '54', '56', '58', '60'],
      colors: [],
      tags: ['new_drop'],
      is_wholesale: false,
      in_stock: true,
    });
    setIsDialogOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      slug: product.slug,
      price: product.price,
      sale_price: product.sale_price,
      description: product.description || '',
      images: product.images || [],
      sizes: product.sizes || ['50', '52', '54', '56', '58', '60'],
      colors: product.colors || [],
      tags: product.tags || [],
      is_wholesale: product.is_wholesale,
      in_stock: product.in_stock,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          ...data,
        });
      } else {
        await createProduct.mutateAsync({
          name: data.name,
          slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
          description: data.description,
          price: data.price,
          sale_price: data.sale_price || null,
          images: data.images || [],
          sizes: data.sizes || ['50', '52', '54', '56', '58', '60'],
          colors: data.colors || [],
          tags: data.tags || ['new_drop'],
          category_id: null,
          in_stock: data.in_stock,
          is_wholesale: data.is_wholesale,
          min_order_quantity: 1,
        });
      }
      setIsDialogOpen(false);
      reset();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProductMutation.mutateAsync(id);
    }
  };

  const handleUpdateQuoteStatus = async (id: string, status: string) => {
    await updateQuoteStatus.mutateAsync({ id, status });
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    await updateOrderStatus.mutateAsync({ id, status });
  };

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingQuotes = (quotes || []).filter(q => q.status === 'pending').length;
    
    return {
      totalRevenue,
      pendingQuotes,
      totalOrders: orders.length,
      totalProducts: (products || []).length,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
    };
  }, [orders, quotes, products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchTerm) return products;
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const TabButton = ({ tab, label, icon }: { tab: typeof activeTab; label: string; icon?: React.ReactNode }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setIsMobileNavOpen(false);
      }}
      className={cn(
        "w-full text-left px-4 py-3 text-sm font-medium capitalize transition-colors flex items-center gap-3",
        activeTab === tab
          ? "text-primary bg-primary/10 border-l-2 border-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {icon}
      {label}
    </button>
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      shipped: 'default',
      delivered: 'default',
      processed: 'default',
      completed: 'default',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border py-3 sm:py-4 sticky top-0 z-50">
        <div className="luxury-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] p-0">
                <div className="py-6">
                  <h2 className="font-serif text-lg px-4 mb-4">Navigation</h2>
                  <nav className="space-y-1">
                    <TabButton tab="dashboard" label="Dashboard" icon={<BarChart3 className="h-4 w-4" />} />
                    <TabButton tab="products" label="Products" icon={<Package className="h-4 w-4" />} />
                    <TabButton tab="quotes" label="Quotes" icon={<FileText className="h-4 w-4" />} />
                    <TabButton tab="orders" label="Orders" icon={<ShoppingBag className="h-4 w-4" />} />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="font-serif text-lg sm:text-2xl">
              <span className="text-foreground">Modest Way Fashion</span>
              <span className="text-foreground hidden sm:inline"> Admin</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchProducts();
                toast({ title: 'Data refreshed' });
              }}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-2 border-red-500/20 text-red-500 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
            <a 
              href="/"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View Store →
            </a>
          </div>
        </div>
      </header>

      <main className="luxury-container py-4 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-card rounded-lg p-3 sm:p-6 border border-border">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <Package className="h-6 w-6 sm:h-10 sm:w-10 text-primary" />
              <div className="text-center sm:text-left">
                {loadingProducts ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-xl sm:text-2xl font-serif">{analytics.totalProducts}</p>
                )}
                <p className="text-[10px] sm:text-sm text-muted-foreground">Products</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-3 sm:p-6 border border-border">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <FileText className="h-6 w-6 sm:h-10 sm:w-10 text-primary" />
              <div className="text-center sm:text-left">
                {loadingQuotes ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-xl sm:text-2xl font-serif">{analytics.pendingQuotes}</p>
                )}
                <p className="text-[10px] sm:text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-3 sm:p-6 border border-border">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <ShoppingBag className="h-6 w-6 sm:h-10 sm:w-10 text-primary" />
              <div className="text-center sm:text-left">
                {loadingOrders ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-xl sm:text-2xl font-serif">{analytics.totalOrders}</p>
                )}
                <p className="text-[10px] sm:text-sm text-muted-foreground">Orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex gap-4 mb-6 border-b border-border">
          {(['dashboard', 'products', 'quotes', 'orders'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-3 px-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px",
                activeTab === tab
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-serif">AED {analytics.totalRevenue.toLocaleString()}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-500">+12.5%</span>
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-serif">{analytics.totalOrders}</p>
                    </div>
                    <ShoppingBag className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Quotes</p>
                      <p className="text-2xl font-serif">{analytics.pendingQuotes}</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                      <p className="text-2xl font-serif">AED {Math.round(analytics.averageOrderValue).toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{order.customer_name}</p>
                            <p className="text-xs text-muted-foreground">{order.order_number}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">AED {order.total.toLocaleString()}</p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              <Button onClick={openNewProduct} className="gap-2">
                <Plus size={16} />
                Add Product
              </Button>
            </div>

            {loadingProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No products found</p>
                <Button onClick={openNewProduct} className="mt-4 gap-2">
                  <Plus size={16} />
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="border-border overflow-hidden">
                    <div className="aspect-[4/3] relative">
                      <img
                        src={product.images?.[0] || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {!product.in_stock && (
                        <Badge className="absolute top-2 right-2" variant="destructive">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <p className="text-primary font-serif text-lg">AED {product.price.toLocaleString()}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.tags?.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditProduct(product)}
                          className="flex-1 gap-1"
                        >
                          <Pencil size={14} />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quotes Tab */}
        {activeTab === 'quotes' && (
          <div>
            <h2 className="font-serif text-xl mb-6">Wholesale Quotes</h2>
            {loadingQuotes ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : (quotes || []).length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No quotes yet</p>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quote #</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(quotes || []).map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-mono text-sm">{quote.quote_number}</TableCell>
                        <TableCell>{quote.business_name}</TableCell>
                        <TableCell>
                          <div>
                            <p>{quote.contact_name}</p>
                            <p className="text-xs text-muted-foreground">{quote.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{quote.country}</TableCell>
                        <TableCell>{getStatusBadge(quote.status)}</TableCell>
                        <TableCell>{new Date(quote.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleUpdateQuoteStatus(quote.id, 'processed')}>
                                <Check className="h-4 w-4 mr-2" />
                                Mark Processed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateQuoteStatus(quote.id, 'completed')}>
                                <Check className="h-4 w-4 mr-2" />
                                Mark Completed
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="font-serif text-xl mb-6">Orders</h2>
            {loadingOrders ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                        <TableCell>
                          <div>
                            <p>{order.customer_name}</p>
                            <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-serif">AED {order.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.payment_method}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedOrder(order);
                                setIsOrderModalOpen(true);
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}>
                                <Check className="h-4 w-4 mr-2" />
                                Confirm
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}>
                                <Truck className="h-4 w-4 mr-2" />
                                Mark Shipped
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}>
                                <Check className="h-4 w-4 mr-2" />
                                Mark Delivered
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input 
                  id="slug" 
                  {...register('slug')} 
                  placeholder="auto-generated-from-name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (AED)</Label>
                <Input
                  id="price"
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="sale_price">Original Price (Optional)</Label>
                <Input
                  id="sale_price"
                  type="number"
                  {...register('sale_price', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label>Image URLs (comma separated)</Label>
              <Input
                placeholder="/images/product-1.jpeg, /images/product-2.jpeg"
                defaultValue={(watch('images') || []).join(', ')}
                onChange={(e) => {
                  const urls = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  setValue('images', urls);
                }}
              />
            </div>

            <div>
              <Label>Tags (comma separated)</Label>
              <Input
                placeholder="new_drop, best_seller, sale"
                defaultValue={(watch('tags') || []).join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  setValue('tags', tags);
                }}
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="in_stock"
                  checked={watch('in_stock')}
                  onCheckedChange={(checked) => setValue('in_stock', checked)}
                />
                <Label htmlFor="in_stock">In Stock</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_wholesale"
                  checked={watch('is_wholesale')}
                  onCheckedChange={(checked) => setValue('is_wholesale', checked)}
                />
                <Label htmlFor="is_wholesale">Wholesale</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
                {createProduct.isPending || updateProduct.isPending ? 'Saving...' : 'Save Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Order Details Modal */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Order Details - {selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer_phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Shipping Address</Label>
                  <p className="text-sm">{selectedOrder.shipping_address}</p>
                  <p className="text-sm">{selectedOrder.city}, {selectedOrder.emirate}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Items</Label>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-3">
                        {item.product_image && (
                          <img src={item.product_image} alt="" className="w-12 h-12 object-cover rounded" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">Size: {item.size} × {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-serif">AED {item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>AED {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>AED {(selectedOrder.shipping_cost || 0).toLocaleString()}</span>
                </div>
                {selectedOrder.cod_fee && selectedOrder.cod_fee > 0 && (
                  <div className="flex justify-between">
                    <span>COD Fee</span>
                    <span>AED {selectedOrder.cod_fee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-serif text-lg mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>AED {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
