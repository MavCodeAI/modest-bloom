import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Grid3x3,
  List,
  ArrowUpDown,
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  useProducts,
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useExportOrders,
  type Product,
  type Category
} from '@/hooks';

interface ProductFilters {
  category?: string;
  inStock?: boolean;
  search?: string;
  sortBy?: 'name' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

const ProductCard = ({ 
  product, 
  onEdit, 
  onDelete, 
  onView 
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
}) => {
  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-serif text-primary">AED {product.price}</span>
            {product.sale_price && (
              <span className="text-sm text-muted-foreground line-through">
                AED {product.sale_price}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={product.in_stock ? 'default' : 'secondary'}>
              {product.in_stock ? 'In Stock' : 'Out of Stock'}
            </Badge>
            {product.is_wholesale && (
              <Badge variant="outline">Wholesale</Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {product.sizes && product.sizes.length > 0 && (
              <span className="text-xs text-muted-foreground">
                Sizes: {product.sizes.slice(0, 3).join(', ')}
                {product.sizes.length > 3 && '...'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(product)}
              className="flex-1"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
              className="flex-1"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(product.id)}
              className="flex-1 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductTableRow = ({ 
  product, 
  onEdit, 
  onDelete, 
  onView,
  isSelected,
  onSelect
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(product.id)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                No Img
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{product.name}</p>
            <p className="text-xs text-muted-foreground">SKU: {product.id.slice(0, 8)}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <span className="font-medium">AED {product.price}</span>
          {product.sale_price && (
            <span className="text-sm text-muted-foreground line-through ml-2">
              AED {product.sale_price}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={product.in_stock ? 'default' : 'secondary'}>
          {product.in_stock ? 'In Stock' : 'Out of Stock'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {product.is_wholesale && (
            <Badge variant="outline" className="text-xs">Wholesale</Badge>
          )}
          {product.sizes && product.sizes.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {product.sizes.length} sizes
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(product)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(product.id)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

interface AdminProductsProps {
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onViewProduct: (product: Product) => void;
}

export const AdminProducts = ({ 
  onAddProduct, 
  onEditProduct, 
  onViewProduct 
}: AdminProductsProps) => {
  const [filters, setFilters] = useState<ProductFilters>({
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { toast } = useToast();
  
  const { data: products, isLoading, error } = useProducts(filters);
  const { data: categories } = useCategories();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const exportMutation = useExportOrders();

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products?.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products?.map(p => p.id) || []);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      selectedProducts.forEach(id => {
        deleteProductMutation.mutate(id);
      });
      setSelectedProducts([]);
    }
  };

  const handleExport = () => {
    // This would export products data
    toast({
      title: 'Export started',
      description: 'Products data is being exported...',
    });
  };

  const filteredProducts = products?.filter(product => {
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading products: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif">Products</h2>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <Button onClick={onAddProduct} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
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
                <SheetTitle>Filter Products</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Stock Status</label>
                  <Select
                    value={filters.inStock?.toString()}
                    onValueChange={(value) => setFilters(prev => ({ 
                      ...prev, 
                      inStock: value === 'true' ? true : value === 'false' ? false : undefined 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="true">In Stock</SelectItem>
                      <SelectItem value="false">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Sort By</label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="created_at">Created Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Sort Order</label>
                  <Select
                    value={filters.sortOrder}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, sortOrder: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            className="gap-2"
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
            {viewMode === 'grid' ? 'Table' : 'Grid'}
          </Button>

          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {selectedProducts.length} items selected
          </span>
          <Button variant="outline" size="sm" onClick={handleBulkDelete}>
            Delete Selected
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelectedProducts([])}>
            Clear Selection
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEditProduct}
              onDelete={handleDeleteProduct}
              onView={onViewProduct}
            />
          ))}
          {filteredProducts?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      )}

      {/* Products Table */}
      {!isLoading && viewMode === 'table' && (
        <Card>
          <CardHeader>
            <CardTitle>Products Table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.length === filteredProducts?.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Attributes</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts?.map((product) => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    onEdit={onEditProduct}
                    onDelete={handleDeleteProduct}
                    onView={onViewProduct}
                    isSelected={selectedProducts.includes(product.id)}
                    onSelect={handleSelectProduct}
                  />
                ))}
                {filteredProducts?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
