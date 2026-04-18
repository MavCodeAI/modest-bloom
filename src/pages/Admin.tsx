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
  Eye,
  Truck,
  Search,
  RefreshCw,
  MoreVertical,
} from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, Product } from '@/hooks/useProducts';
import { useAdminOrders, useUpdateOrderStatus, OrderWithItems } from '@/hooks/useAdminOrders';
import { useWholesaleQuotes, useUpdateQuoteStatus } from '@/hooks/useWholesaleQuotes';
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
  DialogFooter,
} from '@/components/ui/dialog';
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
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ProductImageUploader } from '@/components/admin/ProductImageUploader';
import { VariantManager } from '@/components/admin/VariantManager';
import { VariantInventoryManager } from '@/components/admin/VariantInventoryManager';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import type { AdminTab } from '@/components/admin/AdminSidebar';
import { OrderTimeline } from '@/components/order/OrderTimeline';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const productSchema = z.object({
  name: z.string().min(2, 'Name required'),
  slug: z.string().min(2, 'Slug required'),
  price: z.number().min(1, 'Price required'),
  sale_price: z.number().nullable().optional(),
  wholesale_price: z.number().nullable().optional(),
  description: z.string().min(10, 'Description required'),
  images: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  is_wholesale: z.boolean(),
  in_stock: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

const TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of your store performance' },
  products: { title: 'Products', subtitle: 'Manage your catalog' },
  orders: { title: 'Orders', subtitle: 'Process and fulfill customer orders' },
  quotes: { title: 'Wholesale Quotes', subtitle: 'B2B quote requests' },
};

const Admin = () => {
  const { toast } = useToast();

  const { data: products, isLoading: loadingProducts, refetch: refetchProducts } = useProducts();
  const { data: ordersData, isLoading: loadingOrders, refetch: refetchOrders } = useAdminOrders();
  const { data: quotes, isLoading: loadingQuotes, refetch: refetchQuotes } = useWholesaleQuotes();

  const orders = ordersData?.orders || [];

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const updateOrderStatus = useUpdateOrderStatus();
  const updateQuoteStatus = useUpdateQuoteStatus();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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
      wholesale_price: null,
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
      wholesale_price: product.wholesale_price ?? null,
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
      const finalSlug = data.slug?.trim() || slugify(data.name);
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          ...data,
          slug: finalSlug,
        });
      } else {
        await createProduct.mutateAsync({
          name: data.name,
          slug: finalSlug,
          description: data.description,
          price: data.price,
          sale_price: data.sale_price || null,
          wholesale_price: data.wholesale_price || null,
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
      // mutation handles toast
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

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchTerm) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleRefresh = () => {
    refetchProducts();
    refetchOrders();
    refetchQuotes();
    toast({ title: 'Data refreshed' });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      shipped: 'default',
      delivered: 'default',
      processed: 'default',
      completed: 'default',
      cancelled: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'secondary'} className="capitalize">
        {status}
      </Badge>
    );
  };

  const headerActions =
    activeTab === 'products' ? (
      <Button onClick={openNewProduct} size="sm" className="gap-2">
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add Product</span>
      </Button>
    ) : null;

  return (
    <AdminLayout
      active={activeTab}
      onTabChange={setActiveTab}
      title={TITLES[activeTab].title}
      subtitle={TITLES[activeTab].subtitle}
      onRefresh={handleRefresh}
      actions={headerActions}
    >
      {/* DASHBOARD */}
      {activeTab === 'dashboard' && (
        <AdminAnalytics
          orders={orders}
          quotes={quotes || []}
          products={products || []}
          loading={loadingOrders || loadingQuotes || loadingProducts}
          onAddProduct={() => {
            setActiveTab('products');
            openNewProduct();
          }}
          onViewOrders={() => setActiveTab('orders')}
          onViewQuotes={() => setActiveTab('quotes')}
        />
      )}

      {/* PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-72" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No products found</p>
                <Button onClick={openNewProduct} className="gap-2">
                  <Plus size={16} />
                  Add Your First Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                    <img
                      src={product.images?.[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!product.in_stock && (
                      <Badge className="absolute top-2 right-2" variant="destructive">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <p className="text-primary font-serif text-lg">
                      AED {product.price.toLocaleString()}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2 min-h-[20px]">
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
                        className="text-destructive hover:bg-destructive/10"
                        aria-label="Delete product"
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

      {/* QUOTES */}
      {activeTab === 'quotes' && (
        <div>
          {loadingQuotes ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (quotes || []).length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No quotes yet</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
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
            </Card>
          )}
        </div>
      )}

      {/* ORDERS */}
      {activeTab === 'orders' && (
        <div>
          {loadingOrders ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
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
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsOrderModalOpen(true);
                                }}
                              >
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
            </Card>
          )}
        </div>
      )}

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl w-[calc(100vw-1rem)] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  {...register('name', {
                    onChange: (e) => {
                      if (!editingProduct) {
                        setValue('slug', slugify(e.target.value));
                      }
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <div className="flex gap-2">
                  <Input id="slug" {...register('slug')} placeholder="auto-generated-from-name" />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setValue('slug', slugify(watch('name') || ''))}
                    title="Regenerate from name"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price (AED)</Label>
                <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
                {errors.price && (
                  <p className="text-destructive text-xs mt-1">{errors.price.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="sale_price">Compare-at Price</Label>
                <Input
                  id="sale_price"
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  {...register('sale_price', {
                    setValueAs: (v) => (v === '' || v == null ? null : Number(v)),
                  })}
                />
              </div>
              <div>
                <Label htmlFor="wholesale_price">Wholesale Price</Label>
                <Input
                  id="wholesale_price"
                  type="number"
                  step="0.01"
                  placeholder="Bulk price"
                  {...register('wholesale_price', {
                    setValueAs: (v) => (v === '' || v == null ? null : Number(v)),
                  })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} {...register('description')} />
              {errors.description && (
                <p className="text-destructive text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label>Product Images</Label>
              <ProductImageUploader
                images={watch('images') || []}
                onChange={(imgs) => setValue('images', imgs, { shouldDirty: true })}
              />
            </div>

            <div>
              <Label className="mb-2 block">Sizes</Label>
              <VariantManager
                type="size"
                values={watch('sizes') || []}
                onChange={(vals) => setValue('sizes', vals, { shouldDirty: true })}
              />
            </div>

            <div>
              <Label className="mb-2 block">Colors</Label>
              <VariantManager
                type="color"
                values={watch('colors') || []}
                onChange={(vals) => setValue('colors', vals, { shouldDirty: true })}
              />
            </div>

            {editingProduct && (
              <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
                <div>
                  <Label className="text-base font-semibold">Per-Variant Inventory</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    ہر size + color combination کا اپنا stock count set کریں۔
                  </p>
                </div>
                <VariantInventoryManager
                  productId={editingProduct.id}
                  sizes={watch('sizes') || []}
                  colors={watch('colors') || []}
                />
              </div>
            )}

            <div>
              <Label>Tags (comma separated)</Label>
              <Input
                placeholder="new_drop, best_seller, sale"
                defaultValue={(watch('tags') || []).join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
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
        <DialogContent className="max-w-2xl w-[calc(100vw-1rem)] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Order Details - {selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (() => {
            // Always read from latest orders array so status reflects updates
            const liveOrder = orders.find((o) => o.id === selectedOrder.id) || selectedOrder;
            const isCancelled = liveOrder.status === 'cancelled';
            const isDelivered = liveOrder.status === 'delivered';
            return (
              <div className="space-y-4">
                {/* Live Status Timeline */}
                <div>
                  <Label className="text-muted-foreground mb-2 block">Order Status</Label>
                  <OrderTimeline status={liveOrder.status} showHeader={false} />
                </div>

                {/* Status update controls */}
                {!isDelivered && !isCancelled && (
                  <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border bg-muted/30">
                    <span className="text-xs font-medium text-muted-foreground self-center mr-1">
                      Update status:
                    </span>
                    {liveOrder.status !== 'confirmed' && liveOrder.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateOrderStatus(liveOrder.id, 'confirmed')}
                        disabled={updateOrderStatus.isPending}
                        className="gap-1"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Confirm
                      </Button>
                    )}
                    {(liveOrder.status === 'pending' || liveOrder.status === 'confirmed') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateOrderStatus(liveOrder.id, 'shipped')}
                        disabled={updateOrderStatus.isPending}
                        className="gap-1"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        Mark Shipped
                      </Button>
                    )}
                    {liveOrder.status !== 'delivered' && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateOrderStatus(liveOrder.id, 'delivered')}
                        disabled={updateOrderStatus.isPending}
                        className="gap-1"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Mark Delivered
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm('Cancel this order? This will notify the customer.')) {
                          handleUpdateOrderStatus(liveOrder.id, 'cancelled');
                        }
                      }}
                      disabled={updateOrderStatus.isPending}
                      className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto"
                    >
                      Cancel order
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Customer</Label>
                    <p className="font-medium">{liveOrder.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{liveOrder.customer_email}</p>
                    <p className="text-sm text-muted-foreground">{liveOrder.customer_phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Shipping Address</Label>
                    <p className="text-sm">{liveOrder.shipping_address}</p>
                    <p className="text-sm">
                      {liveOrder.city}, {liveOrder.emirate}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Items</Label>
                  <div className="space-y-2 mt-2">
                    {liveOrder.items?.map((item) => {
                      const colorParts = item.color?.split(':');
                      const colorName = colorParts?.[0]?.trim();
                      const colorHex = colorParts?.[1]?.trim();
                      return (
                        <div
                          key={item.id}
                          className="flex justify-between items-center p-2 bg-muted/50 rounded"
                        >
                          <div className="flex items-center gap-3">
                            {item.product_image && (
                              <img src={item.product_image} alt="" className="w-12 h-12 object-cover rounded" />
                            )}
                            <div>
                              <p className="font-medium text-sm">{item.product_name}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                                <span>Size: {item.size}</span>
                                {colorName && (
                                  <>
                                    <span>·</span>
                                    <span className="flex items-center gap-1">
                                      <span
                                        className="inline-block w-2.5 h-2.5 rounded-full ring-1 ring-border"
                                        style={{ backgroundColor: colorHex || '#ccc' }}
                                      />
                                      {colorName}
                                    </span>
                                  </>
                                )}
                                <span>· × {item.quantity}</span>
                              </p>
                            </div>
                          </div>
                          <p className="font-serif">AED {item.price.toLocaleString()}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>AED {liveOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>AED {(liveOrder.shipping_cost || 0).toLocaleString()}</span>
                  </div>
                  {liveOrder.cod_fee && liveOrder.cod_fee > 0 && (
                    <div className="flex justify-between">
                      <span>COD Fee</span>
                      <span>AED {liveOrder.cod_fee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-serif text-lg mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>AED {liveOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Admin;
