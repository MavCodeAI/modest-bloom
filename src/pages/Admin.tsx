import { useState, useEffect, useMemo } from 'react';
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
  CheckCircle,
  CreditCard,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  AlertCircle,
  ChevronDown,
  RefreshCw,
  Copy,
  Edit3,
  Save,
  XCircle,
  ArrowUpDown,
  MoreVertical,
  Grid3x3,
  List,
  Settings,
  LogOut,
  Bell,
  User,
  Shield,
  Zap,
  Target,
  Activity,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useStore } from '@/hooks/useStore';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Product, Order } from '@/lib/data';
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
  DialogTrigger,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const productSchema = z.object({
  name: z.string().min(2, 'Name required'),
  price: z.number().min(1, 'Price required'),
  originalPrice: z.number().optional(),
  category: z.string().min(1, 'Category required'),
  description: z.string().min(10, 'Description required'),
  image: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.string().optional(),
  tags: z.string().optional(),
  isWholesale: z.boolean(),
  inStock: z.boolean(),
  sku: z.string().optional(),
  weight: z.number().optional(),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const Admin = () => {
  const { products, quotes, orders, dispatch } = useStore();
  const { logout, resetSessionTimer, isAuthenticated } = useAdminAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'quotes' | 'orders' | 'analytics' | 'settings'>('dashboard');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'7days' | '30days' | '90days' | 'all'>('30days');
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'info' | 'warning' | 'success', timestamp: Date}>>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [productVariants, setProductVariants] = useState<Array<{size: string, color: string, stock: number}>>([]);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  // Session timer countdown
  useEffect(() => {
    if (!isAuthenticated) return;

    const timer = setInterval(() => {
      setSessionTimeLeft(prev => {
        if (prev <= 1) {
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated, logout]);

  // Reset session timer on user activity
  const handleUserActivity = () => {
    resetSessionTimer();
    setSessionTimeLeft(30 * 60);
  };

  // Track admin activities
  const logActivity = (action: string, details?: Record<string, unknown>) => {
    const activity = {
      action,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    console.log('Admin Activity:', activity);
    // In production, send this to a secure logging endpoint
  };

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
      isWholesale: false,
    },
  });

  const openNewProduct = () => {
    setEditingProduct(null);
    setUploadedImages([]);
    setProductVariants([]);
    reset({
      name: '',
      price: 0,
      category: '',
      description: '',
      image: '',
      images: [],
      sizes: ['50', '52', '54', '56', '58', '60'],
      colors: '',
      tags: 'new_drop',
      isWholesale: false,
      inStock: true,
      sku: '',
      weight: 0,
      material: '',
      careInstructions: '',
    });
    setIsDialogOpen(true);
    handleUserActivity();
    logActivity('product_create_dialog_open');
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setUploadedImages(product.images || []);
    setProductVariants([]);
    reset({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      description: product.description,
      image: product.image,
      images: product.images || [],
      sizes: product.sizes || ['50', '52', '54', '56', '58', '60'],
      colors: (product.colors || []).join(', '),
      tags: (product.tags || []).join(', '),
      isWholesale: product.isWholesale,
      inStock: product.inStock ?? true,
      sku: product.sku || '',
      weight: product.weight || 0,
      material: product.material || '',
      careInstructions: product.careInstructions || '',
    });
    setIsDialogOpen(true);
    handleUserActivity();
    logActivity('product_edit_dialog_open', { productId: product.id });
  };

  const onSubmit = (data: ProductFormData) => {
    if (uploadedImages.length === 0) {
      toast({ title: 'Please upload at least one product image', variant: 'destructive' });
      return;
    }
    
    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: data.name,
        price: data.price,
        originalPrice: data.originalPrice,
        category: data.category,
        description: data.description,
        image: data.image || uploadedImages[0] || '',
        images: uploadedImages,
        sizes: data.sizes || ['50', '52', '54', '56', '58', '60'],
        colors: data.colors ? data.colors.split(',').map(c => c.trim()) : [],
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : ['new_drop'],
        isWholesale: data.isWholesale,
        inStock: data.inStock ?? true,
        sku: data.sku || `${data.name.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-4)}`,
        weight: data.weight,
        material: data.material,
        careInstructions: data.careInstructions,
      };
      dispatch({ type: 'UPDATE_PRODUCT', payload: updated });
      toast({ title: 'Product updated successfully' });
    } else {
      const newProduct: Product = {
        id: `p${Date.now()}`,
        name: data.name,
        price: data.price,
        originalPrice: data.originalPrice,
        category: data.category,
        description: data.description,
        image: uploadedImages[0] || '',
        images: uploadedImages,
        sizes: data.sizes || ['50', '52', '54', '56', '58', '60'],
        colors: data.colors ? data.colors.split(',').map(c => c.trim()) : [],
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : ['new_drop'],
        isWholesale: data.isWholesale,
        inStock: data.inStock ?? true,
        sku: data.sku || `${data.name.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-4)}`,
        weight: data.weight,
        material: data.material,
        careInstructions: data.careInstructions,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      toast({ title: 'Product created successfully' });
    }
    setIsDialogOpen(false);
    reset();
    setUploadedImages([]);
    setProductVariants([]);
  };

  const deleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
      toast({ title: 'Product deleted' });
    }
  };

  const updateQuoteStatus = (id: string, status: 'pending' | 'processed' | 'completed') => {
    dispatch({ type: 'UPDATE_QUOTE_STATUS', payload: { id, status } });
    toast({ title: `Quote marked as ${status}` });
  };

  const updateOrderStatus = (id: string, status: 'pending' | 'confirmed' | 'shipped' | 'delivered') => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } });
    toast({ title: `Order marked as ${status}` });
  };

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingQuotes = quotes.filter(q => q.status === 'pending').length;
    const recentOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 30;
    });
    
    const topProducts = products.slice(0, 5).map(p => ({
      name: p.name,
      price: p.price,
      category: p.category
    }));
    
    const orderStatusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalRevenue,
      pendingQuotes,
      recentOrders: recentOrders.length,
      totalOrders: orders.length,
      topProducts,
      orderStatusCounts,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
    };
  }, [orders, quotes, products]);

  // Filter and sort functions
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }
    
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [products, searchTerm, filterCategory, sortBy, sortOrder]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(o => o.status === filterStatus);
    }
    
    if (dateRange !== 'all') {
      const now = new Date();
      const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff <= days;
      });
    }
    
    return filtered;
  }, [orders, filterStatus, dateRange]);

  // Bulk operations
  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === filteredProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredProducts.map(p => p.id));
    }
  };

  const bulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedItems.length} products?`)) {
      selectedItems.forEach(id => {
        dispatch({ type: 'DELETE_PRODUCT', payload: id });
      });
      setSelectedItems([]);
      toast({ title: `${selectedItems.length} products deleted` });
    }
  };

  const bulkUpdateStatus = (status: 'pending' | 'processed' | 'completed') => {
    selectedItems.forEach(id => {
      const quote = quotes.find(q => q.id === id);
      if (quote) {
        dispatch({ type: 'UPDATE_QUOTE_STATUS', payload: { id, status } });
      }
    });
    setSelectedItems([]);
    toast({ title: `${selectedItems.length} quotes updated` });
  };

  // Export functions
  const exportToCSV = (data: Record<string, string | number>[], filename: string) => {
    const csv = data.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const exportOrders = () => {
    const data = orders.map(o => ({
      ID: o.id,
      Customer: o.customer.name,
      Email: o.customer.email,
      Total: o.total,
      Status: o.status,
      Date: new Date(o.createdAt).toLocaleDateString()
    }));
    exportToCSV(data, 'orders.csv');
    toast({ title: 'Orders exported successfully' });
  };

  const exportQuotes = () => {
    const data = quotes.map(q => ({
      ID: q.id,
      Business: q.businessName,
      Contact: q.contactPerson,
      Email: q.email,
      Region: q.region,
      Volume: q.volume,
      Status: q.status,
      Date: new Date(q.createdAt).toLocaleDateString()
    }));
    exportToCSV(data, 'quotes.csv');
    toast({ title: 'Quotes exported successfully' });
  };

  // Advanced upload functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setIsUploading(true);
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedImages(prev => [...prev, result]);
          setValue('images', [...(watch('images') || []), result]);
        };
        reader.readAsDataURL(file);
      });
      setTimeout(() => setIsUploading(false), 1000);
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    const currentImages = watch('images') || [];
    setValue('images', currentImages.filter((_, i) => i !== index));
  };

  const addProductVariant = () => {
    setProductVariants(prev => [...prev, { size: '', color: '', stock: 0 }]);
  };

  const updateVariant = (index: number, field: 'size' | 'color' | 'stock', value: string | number) => {
    setProductVariants(prev => 
      prev.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const removeVariant = (index: number) => {
    setProductVariants(prev => prev.filter((_, i) => i !== index));
  };

  const generateSKU = () => {
    const name = watch('name') || '';
    const category = watch('category') || '';
    const sku = name.substring(0, 3).toUpperCase() + 
                 category.substring(0, 3).toUpperCase() + 
                 Date.now().toString().slice(-4);
    setValue('sku', sku);
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const TabButton = ({ tab, label, icon }: { tab: typeof activeTab; label: string; icon?: React.ReactNode }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setIsMobileNavOpen(false);
        handleUserActivity();
        logActivity('tab_change', { tab });
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

  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    logActivity('admin_logout');
    logout();
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
                    <TabButton tab="analytics" label="Analytics" icon={<TrendingUp className="h-4 w-4" />} />
                    <TabButton tab="settings" label="Settings" icon={<Settings className="h-4 w-4" />} />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="font-serif text-lg sm:text-2xl">
              <span className="text-white">Modest Way Fashion</span>
              <span className="text-white hidden sm:inline"> Admin</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Session Timer */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={`text-sm font-mono ${sessionTimeLeft < 300 ? 'text-red-500' : 'text-muted-foreground'}`}>
                {formatTimeLeft(sessionTimeLeft)}
              </span>
            </div>
            
            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
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
                <p className="text-xl sm:text-2xl font-serif">{products.length}</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground">Products</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-3 sm:p-6 border border-border">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <FileText className="h-6 w-6 sm:h-10 sm:w-10 text-primary" />
              <div className="text-center sm:text-left">
                <p className="text-xl sm:text-2xl font-serif">
                  {quotes.filter(q => q.status === 'pending').length}
                </p>
                <p className="text-[10px] sm:text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-3 sm:p-6 border border-border">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <ShoppingBag className="h-6 w-6 sm:h-10 sm:w-10 text-primary" />
              <div className="text-center sm:text-left">
                <p className="text-xl sm:text-2xl font-serif">{orders.length}</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground">Orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex gap-4 mb-6 border-b border-border">
          {(['dashboard', 'products', 'quotes', 'orders', 'analytics', 'settings'] as const).map((tab) => (
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

        {/* Mobile Tab Indicator */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg capitalize">{activeTab}</h2>
          <div className="flex gap-2">
            {activeTab === 'products' && (
              <Button onClick={openNewProduct} size="sm" className="gap-1">
                <Plus size={14} />
                <span className="hidden xs:inline">Add</span>
              </Button>
            )}
            {(activeTab === 'products' || activeTab === 'quotes' || activeTab === 'orders') && (
              <Button variant="outline" size="sm" className="gap-1">
                <Download size={14} />
                <span className="hidden xs:inline">Export</span>
              </Button>
            )}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Enhanced Stats */}
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
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-500">+8.2%</span>
                      </div>
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
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-yellow-500">Action needed</span>
                      </div>
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
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-500">+5.3%</span>
                      </div>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders */}
              <Card className="border-border lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{order.customer.name}</p>
                            <p className="text-xs text-muted-foreground">{order.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">AED {order.total.toLocaleString()}</p>
                          <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className="text-xs">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Quick Actions</CardTitle>
                  <CardDescription>Common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={openNewProduct} className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Product
                  </Button>
                  <Button variant="outline" onClick={exportOrders} className="w-full justify-start gap-2">
                    <Download className="h-4 w-4" />
                    Export Orders
                  </Button>
                  <Button variant="outline" onClick={exportQuotes} className="w-full justify-start gap-2">
                    <Download className="h-4 w-4" />
                    Export Quotes
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh Data
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Top Products</CardTitle>
                <CardDescription>Best performing items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {analytics.topProducts.map((product, index) => (
                    <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      <p className="text-sm font-serif text-primary mt-1">AED {product.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {activeTab === 'products' && (
          <div>
            <div className="hidden md:flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl">Products</h2>
              <div className="flex gap-2">
                <Button onClick={openNewProduct} className="gap-2">
                  <Plus size={16} />
                  Add Product
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={exportOrders}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={selectAllItems}>
                      <Grid3x3 className="h-4 w-4 mr-2" />
                      Select All
                    </DropdownMenuItem>
                    {selectedItems.length > 0 && (
                      <DropdownMenuItem onClick={bulkDelete} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Selected ({selectedItems.length})
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Advanced Filters */}
            <Card className="border-border mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="abayas">Abayas</SelectItem>
                      <SelectItem value="kaftans">Kaftans</SelectItem>
                      <SelectItem value="printed">Printed</SelectItem>
                      <SelectItem value="sets">Sets</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: 'name' | 'price' | 'date' | 'status') => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {selectedItems.length > 0 && (
                  <div className="mt-4 flex items-center justify-between p-2 bg-primary/10 rounded">
                    <span className="text-sm font-medium">{selectedItems.length} items selected</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedItems([])}>
                        Clear
                      </Button>
                      <Button size="sm" variant="destructive" onClick={bulkDelete}>
                        Delete Selected
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mobile Product Cards */}
            <div className="md:hidden space-y-3">
              {products.map((product) => (
                <div key={product.id} className="bg-card rounded-lg border border-border p-4">
                  <div className="flex gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{product.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                      <p className="text-sm text-primary mt-1">AED {product.price.toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {product.isWholesale && (
                          <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded">Wholesale</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditProduct(product)}>
                        <Pencil size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteProduct(product.id)}>
                        <Trash2 size={14} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-card rounded-lg border border-border overflow-hidden">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Wholesale</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-14 object-cover rounded"
                            />
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{product.category}</TableCell>
                        <TableCell>AED {product.price.toLocaleString()}</TableCell>
                        <TableCell>
                          {product.isWholesale ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditProduct(product)}
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteProduct(product.id)}
                            >
                              <Trash2 size={14} className="text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Quotes Tab */}
        {activeTab === 'quotes' && (
          <div>
            <h2 className="hidden md:block font-serif text-xl mb-6">Quote Requests</h2>
            
            {quotes.length === 0 ? (
              <div className="bg-card rounded-lg border border-border p-8 sm:p-12 text-center">
                <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm sm:text-base">No quote requests yet</p>
              </div>
            ) : (
              <>
                {/* Mobile Quote Cards */}
                <div className="md:hidden space-y-3">
                  {quotes.map((quote) => (
                    <div key={quote.id} className="bg-card rounded-lg border border-border p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-sm">{quote.businessName}</h3>
                          <p className="text-xs text-muted-foreground">{quote.contactPerson}</p>
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-medium",
                          quote.status === 'pending' && "bg-yellow-500/20 text-yellow-500",
                          quote.status === 'processed' && "bg-blue-500/20 text-blue-500",
                          quote.status === 'completed' && "bg-green-500/20 text-green-500"
                        )}>
                          {quote.status}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1 mb-3">
                        <p>Region: <span className="capitalize">{quote.region}</span></p>
                        <p>Volume: {quote.volume}</p>
                        <p>{quote.email}</p>
                      </div>
                      <Select
                        value={quote.status}
                        onValueChange={(value) => updateQuoteStatus(quote.id, value as 'pending' | 'processed' | 'completed')}
                      >
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processed">Processed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block bg-card rounded-lg border border-border overflow-hidden">
                  <ScrollArea className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Business</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Region</TableHead>
                          <TableHead>Volume</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quotes.map((quote) => (
                          <TableRow key={quote.id}>
                            <TableCell className="font-mono text-xs">{quote.id}</TableCell>
                            <TableCell className="font-medium">{quote.businessName}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{quote.contactPerson}</p>
                                <p className="text-muted-foreground text-xs">{quote.email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="capitalize">{quote.region}</TableCell>
                            <TableCell>{quote.volume}</TableCell>
                            <TableCell>
                              <span className={cn(
                                "px-2 py-1 rounded text-xs font-medium",
                                quote.status === 'pending' && "bg-yellow-500/20 text-yellow-500",
                                quote.status === 'processed' && "bg-blue-500/20 text-blue-500",
                                quote.status === 'completed' && "bg-green-500/20 text-green-500"
                              )}>
                                {quote.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Select
                                value={quote.status}
                                onValueChange={(value) => 
                                  updateQuoteStatus(quote.id, value as 'pending' | 'processed' | 'completed')
                                }
                              >
                                <SelectTrigger className="w-28 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processed">Processed</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl">Analytics & Insights</h2>
              <Select value={dateRange} onValueChange={(value: '7days' | '30days' | '90days' | 'all') => setDateRange(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Revenue Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-border lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Revenue Overview</CardTitle>
                  <CardDescription>Revenue trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Revenue Chart</p>
                      <p className="text-sm text-muted-foreground mt-1">Chart integration available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Conversion Rate</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">3.2%</span>
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg. Order Value</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">AED {Math.round(analytics.averageOrderValue).toLocaleString()}</span>
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Customer Retention</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">68%</span>
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cart Abandonment</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">24%</span>
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Order Status Breakdown</CardTitle>
                  <CardDescription>Distribution of order statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics.orderStatusCounts).map(([status, count]) => {
                      const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize font-medium">{status}</span>
                            <span className="text-muted-foreground">{count} orders ({percentage.toFixed(1)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Top Categories</CardTitle>
                  <CardDescription>Best performing product categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['abayas', 'kaftans', 'printed', 'sets'].map((category) => {
                      const categoryProducts = products.filter(p => p.category === category);
                      const categoryRevenue = categoryProducts.reduce((sum, p) => sum + p.price, 0);
                      const percentage = products.length > 0 ? (categoryProducts.length / products.length) * 100 : 0;
                      
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                              <Package className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium capitalize">{category}</p>
                              <p className="text-xs text-muted-foreground">{categoryProducts.length} products</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">AED {categoryRevenue.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Insights */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Customer Insights</CardTitle>
                <CardDescription>Understanding your customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-2xl font-serif">{orders.reduce((sum, order) => {
                      const customers = new Set(orders.map(o => o.customer.email));
                      return customers.size;
                    }, 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-2xl font-serif">{Math.round(analytics.averageOrderValue)}</p>
                    <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Activity className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-2xl font-serif">{analytics.recentOrders}</p>
                    <p className="text-sm text-muted-foreground">Recent Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {activeTab === 'orders' && (
          <div>
            <h2 className="hidden md:block font-serif text-xl mb-6">Orders</h2>
            
            {orders.length === 0 ? (
              <div className="bg-card rounded-lg border border-border p-8 sm:p-12 text-center">
                <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm sm:text-base">No orders yet</p>
              </div>
            ) : (
              <>
                {/* Mobile Order Cards */}
                <div className="md:hidden space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-card rounded-lg border border-border p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                          <h3 className="font-medium text-sm">{order.customer.name}</h3>
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-medium capitalize",
                          order.status === 'pending' && "bg-yellow-500/20 text-yellow-500",
                          order.status === 'confirmed' && "bg-blue-500/20 text-blue-500",
                          order.status === 'shipped' && "bg-purple-500/20 text-purple-500",
                          order.status === 'delivered' && "bg-green-500/20 text-green-500"
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-3">
                        <span className="text-muted-foreground">{order.items.length} items</span>
                        <span className="text-primary font-medium">AED {order.total.toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-3">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openOrderDetails(order)}
                          className="flex-1 h-8 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value as 'pending' | 'confirmed' | 'shipped' | 'delivered')}
                        >
                          <SelectTrigger className="flex-1 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block bg-card rounded-lg border border-border overflow-hidden">
                  <ScrollArea className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-xs">{order.id}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="font-medium">{order.customer.name}</p>
                                <p className="text-muted-foreground text-xs">{order.customer.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{order.items.length} items</TableCell>
                            <TableCell>AED {order.total.toLocaleString()}</TableCell>
                            <TableCell>
                              <span className={cn(
                                "px-2 py-1 rounded text-xs font-medium capitalize",
                                order.status === 'pending' && "bg-yellow-500/20 text-yellow-500",
                                order.status === 'confirmed' && "bg-blue-500/20 text-blue-500",
                                order.status === 'shipped' && "bg-purple-500/20 text-purple-500",
                                order.status === 'delivered' && "bg-green-500/20 text-green-500"
                              )}>
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openOrderDetails(order)}
                                  className="h-8 text-xs"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Select
                                  value={order.status}
                                  onValueChange={(value) => updateOrderStatus(order.id, value as 'pending' | 'confirmed' | 'shipped' | 'delivered')}
                                >
                                  <SelectTrigger className="w-28 h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </>
            )}
          </div>
        )}
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="font-serif text-xl">Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Store Settings */}
              <Card className="border-border lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Store Settings</CardTitle>
                  <CardDescription>Configure your store preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive email notifications for new orders</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-approve Reviews</p>
                        <p className="text-sm text-muted-foreground">Automatically approve customer reviews</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable Wholesale Mode</p>
                        <p className="text-sm text-muted-foreground">Show wholesale pricing to registered users</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Maintenance Mode</p>
                        <p className="text-sm text-muted-foreground">Temporarily disable the store</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Store Currency</Label>
                      <Select defaultValue="aed">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aed">AED - UAE Dirham</SelectItem>
                          <SelectItem value="usd">USD - US Dollar</SelectItem>
                          <SelectItem value="eur">EUR - Euro</SelectItem>
                          <SelectItem value="gbp">GBP - British Pound</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Tax Rate (%)</Label>
                      <Input type="number" placeholder="0" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Shipping Fee (AED)</Label>
                      <Input type="number" placeholder="0" className="mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-serif text-lg">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Database</span>
                    <Badge variant="default" className="text-xs">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">API Server</span>
                    <Badge variant="default" className="text-xs">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Storage</span>
                    <Badge variant="secondary" className="text-xs">78% Used</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Backup</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <Separator />
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Check Status
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Security Settings */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Security Settings</CardTitle>
                <CardDescription>Manage security and access controls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Session Timeout</p>
                        <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">IP Whitelist</p>
                        <p className="text-sm text-muted-foreground">Restrict admin access by IP</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Session Duration (minutes)</Label>
                      <Input type="number" placeholder="30" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Max Login Attempts</Label>
                      <Input type="number" placeholder="5" className="mt-1" />
                    </div>
                    <Button variant="outline" className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Update Security Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Data Management</CardTitle>
                <CardDescription>Backup and restore your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cache
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Product Name *</Label>
                    <Input id="name" {...register('name')} className="mt-1" placeholder="Enter product name" />
                    {errors.name && (
                      <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="sku" className="text-sm font-medium">SKU</Label>
                    <div className="flex gap-2 mt-1">
                      <Input id="sku" {...register('sku')} placeholder="Auto-generated" />
                      <Button type="button" variant="outline" onClick={generateSKU} className="px-3">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium">Price (AED) *</Label>
                    <Input
                      id="price"
                      type="number"
                      {...register('price', { valueAsNumber: true })}
                      className="mt-1"
                      placeholder="0"
                    />
                    {errors.price && (
                      <p className="text-destructive text-xs mt-1">{errors.price.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="originalPrice" className="text-sm font-medium">Original Price</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      {...register('originalPrice', { valueAsNumber: true })}
                      className="mt-1"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-sm font-medium">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      {...register('weight', { valueAsNumber: true })}
                      className="mt-1"
                      placeholder="0.5"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Category *</Label>
                  <Select
                    value={watch('category')}
                    onValueChange={(value) => setValue('category', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abayas">Abayas</SelectItem>
                      <SelectItem value="kaftans">Kaftans</SelectItem>
                      <SelectItem value="printed">Printed</SelectItem>
                      <SelectItem value="sets">Sets</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-destructive text-xs mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    className="mt-1 min-h-[100px]"
                    placeholder="Detailed product description..."
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-destructive text-xs mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="material" className="text-sm font-medium">Material</Label>
                  <Input
                    id="material"
                    {...register('material')}
                    className="mt-1"
                    placeholder="e.g., Premium Nida, Silk blend"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isWholesale"
                      checked={watch('isWholesale')}
                      onCheckedChange={(checked) => setValue('isWholesale', checked)}
                    />
                    <Label htmlFor="isWholesale" className="text-sm font-medium">Available for Wholesale</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="inStock"
                      checked={watch('inStock')}
                      onCheckedChange={(checked) => setValue('inStock', checked)}
                    />
                    <Label htmlFor="inStock" className="text-sm font-medium">In Stock</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Product Images</Label>
                  <div className="mt-2 space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag & drop images or click to browse
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={isUploading}
                        className="mt-2"
                      >
                        {isUploading ? 'Uploading...' : 'Select Images'}
                      </Button>
                    </div>

                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeUploadedImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Available Sizes</Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                    {['50', '52', '54', '56', '58', '60'].map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`size-${size}`}
                          checked={watch('sizes')?.includes(size)}
                          onChange={(e) => {
                            const currentSizes = watch('sizes') || [];
                            if (e.target.checked) {
                              setValue('sizes', [...currentSizes, size]);
                            } else {
                              setValue('sizes', currentSizes.filter(s => s !== size));
                            }
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={`size-${size}`} className="text-sm">{size}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Colors</Label>
                  <Input
                    {...register('colors')}
                    className="mt-1"
                    placeholder="Black, Navy, Burgundy (comma separated)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter colors separated by commas
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Product Tags</Label>
                  <Input
                    {...register('tags')}
                    className="mt-1"
                    placeholder="new_drop, premium, limited_edition"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter tags separated by commas
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Product Variants</Label>
                  <div className="mt-2 space-y-2">
                    {productVariants.map((variant, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          placeholder="Size"
                          value={variant.size}
                          onChange={(e) => updateVariant(index, 'size', e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Color"
                          value={variant.color}
                          onChange={(e) => updateVariant(index, 'color', e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          placeholder="Stock"
                          value={variant.stock}
                          onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeVariant(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addProductVariant}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Variant
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div>
                  <Label htmlFor="careInstructions" className="text-sm font-medium">Care Instructions</Label>
                  <Textarea
                    id="careInstructions"
                    {...register('careInstructions')}
                    className="mt-1"
                    placeholder="Machine wash cold, gentle cycle. Do not bleach. Hang dry."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">SEO Title</Label>
                    <Input
                      className="mt-1"
                      placeholder="Premium Abaya - Modest Way"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">SEO Description</Label>
                    <Input
                      className="mt-1"
                      placeholder="Elegant premium abaya with modern design"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Meta Keywords</Label>
                  <Input
                    className="mt-1"
                    placeholder="abaya, modest fashion, islamic clothing, premium"
                  />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Product Preview</h4>
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Name:</strong> {watch('name') || 'Not set'}</p>
                    <p><strong>Price:</strong> AED {watch('price') || 0}</p>
                    <p><strong>Category:</strong> {watch('category') || 'Not set'}</p>
                    <p><strong>Sizes:</strong> {watch('sizes')?.join(', ') || 'Not set'}</p>
                  </div>
                </div>
              </TabsContent>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Order Details Modal */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="font-serif flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Order Details - {selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status */}
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Order Status</h3>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => {
                      updateOrderStatus(selectedOrder.id, value as 'pending' | 'confirmed' | 'shipped' | 'delivered');
                      setSelectedOrder({ ...selectedOrder, status: value as 'pending' | 'confirmed' | 'shipped' | 'delivered' });
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="confirmed">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Confirmed
                        </div>
                      </SelectItem>
                      <SelectItem value="shipped">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          Shipped
                        </div>
                      </SelectItem>
                      <SelectItem value="delivered">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Delivered
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  {selectedOrder.status === 'pending' && <Clock className="w-4 h-4 text-yellow-500" />}
                  {selectedOrder.status === 'confirmed' && <CheckCircle className="w-4 h-4 text-blue-500" />}
                  {selectedOrder.status === 'shipped' && <Truck className="w-4 h-4 text-purple-500" />}
                  {selectedOrder.status === 'delivered' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium capitalize",
                    selectedOrder.status === 'pending' && "bg-yellow-500/20 text-yellow-500",
                    selectedOrder.status === 'confirmed' && "bg-blue-500/20 text-blue-500",
                    selectedOrder.status === 'shipped' && "bg-purple-500/20 text-purple-500",
                    selectedOrder.status === 'delivered' && "bg-green-500/20 text-green-500"
                  )}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-card rounded-lg border border-border p-4">
                <h3 className="font-medium mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedOrder.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedOrder.customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Order Date</p>
                    <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-card rounded-lg border border-border p-4">
                <h3 className="font-medium mb-4">Order Items ({selectedOrder.items.length})</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Size {item.size} × {item.quantity}</p>
                        <p className="text-sm text-primary font-medium">
                          AED {(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-card rounded-lg border border-border p-4">
                <h3 className="font-medium mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>AED {selectedOrder.subtotal?.toLocaleString() || selectedOrder.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{selectedOrder.shipping === 0 ? 'Free' : `AED ${selectedOrder.shipping?.toLocaleString() || '50'}`}</span>
                  </div>
                  {selectedOrder.codFee && selectedOrder.codFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">COD Fee</span>
                      <span>AED {selectedOrder.codFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">AED {selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-lg border border-border p-4">
                <h3 className="font-medium mb-4">Payment Method</h3>
                <div className="flex items-center gap-3">
                  {selectedOrder.paymentMethod === 'cod' ? (
                    <>
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary text-xs font-bold">COD</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground">Pay on delivery</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Credit/Debit Card</p>
                        <p className="text-xs text-muted-foreground">Paid online</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
