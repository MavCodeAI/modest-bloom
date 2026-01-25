import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  useAdvancedSearch,
  useSearchSuggestions,
  useCategories,
  type SearchFilters
} from '@/hooks';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category') || null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('newest');
  
  // Parse URL params to filters
  const initialFilters: SearchFilters = useMemo(() => {
    const filters: SearchFilters = {
      query: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sortBy: 'created_at',
      sortOrder: 'desc',
      page: 1,
      limit: 20
    };
    
    // Parse sizes, colors, tags from URL
    const sizes = searchParams.get('sizes');
    if (sizes) {
      filters.sizes = sizes.split(',');
    }
    
    const colors = searchParams.get('colors');
    if (colors) {
      filters.colors = colors.split(',');
    }
    
    const tags = searchParams.get('tags');
    if (tags) {
      filters.tags = tags.split(',');
    }
    
    return filters;
  }, [searchParams]);

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  
  // Fetch data using new hooks
  const { data: searchResults, isLoading, error } = useAdvancedSearch(filters);
  const { data: categories } = useCategories();
  const { data: suggestions } = useSearchSuggestions(searchQuery, 5);

  // Transform search results to Product type for ProductGrid
  const filteredProducts = useMemo(() => {
    if (!searchResults?.results) return [];
    
    return searchResults.results.map(result => ({
      id: result.id,
      name: result.name,
      price: result.price,
      originalPrice: result.sale_price || undefined,
      category: result.category?.name || '',
      description: result.description || '',
      image: result.images?.[0] || '',
      images: result.images || undefined,
      sizes: result.sizes || [],
      colors: result.colors || [],
      tags: result.tags || [],
      isWholesale: result.is_wholesale || false,
      inStock: result.in_stock !== false,
      createdAt: result.created_at
    }));
  }, [searchResults]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.query) params.set('search', filters.query);
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.sizes?.length) params.set('sizes', filters.sizes.join(','));
    if (filters.colors?.length) params.set('colors', filters.colors.join(','));
    if (filters.tags?.length) params.set('tags', filters.tags.join(','));
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, query: query || undefined, page: 1 }));
    setShowSuggestions(false);
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    setPriceRange([0, 5000]);
    setFilters({
      query: searchQuery || undefined,
      sortBy: 'created_at',
      sortOrder: 'desc',
      page: 1,
      limit: 20
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => 
    v !== undefined && v !== null && v !== '' && 
    (!Array.isArray(v) || v.length > 0)
  ).length - 3; // Exclude sortBy, sortOrder, page, limit


  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setSelectedTag(null);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const activeFiltersCount = 
    (selectedCategory ? 1 : 0) + 
    (selectedTag ? 1 : 0) + 
    (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg">Filters</h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-medium text-sm mb-4 uppercase tracking-wide text-muted-foreground">
          Categories
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryChange(null)}
            className={cn(
              "block w-full text-left py-2 text-sm transition-colors",
              !selectedCategory
                ? "text-primary font-medium"
                : "text-foreground/70 hover:text-foreground"
            )}
          >
            All Products
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={cn(
                "block w-full text-left py-2 text-sm transition-colors",
                selectedCategory === category.id
                  ? "text-primary font-medium"
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium text-sm mb-4 uppercase tracking-wide text-muted-foreground">
          Price Range
        </h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={5000}
            step={100}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>AED {priceRange[0]}</span>
            <span>AED {priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Sort - Only in sidebar */}
      <div className="hidden lg:block">
        <h3 className="font-medium text-sm mb-4 uppercase tracking-wide text-muted-foreground">
          Sort By
        </h3>
        <div className="space-y-2">
          {sortOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={cn(
                "block w-full text-left py-2 text-sm transition-colors",
                sortBy === option.value
                  ? "text-primary font-medium"
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      
      <main className="pt-20 md:pt-24">
        {/* Header */}
        <div className="luxury-container py-8 sm:py-12">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-center mb-2 sm:mb-4">
            {selectedCategory 
              ? categories.find(c => c.id === selectedCategory)?.name || 'Shop'
              : selectedTag 
                ? selectedTag.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                : 'All Products'
            }
          </h1>
          <p className="text-muted-foreground text-center text-sm sm:text-base">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        <div className="luxury-container pb-16 sm:pb-24">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Mobile Filter & Sort Bar */}
            <div className="lg:hidden flex items-center justify-between gap-3 mb-4">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 flex-1 sm:flex-none"
                  >
                    <SlidersHorizontal size={16} />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="font-serif">Filters</SheetTitle>
                  </SheetHeader>
                  <FilterContent />
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-card border border-border rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>

            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterContent />
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 bg-card px-3 py-1 rounded-full text-xs sm:text-sm">
                      {categories.find(c => c.id === selectedCategory)?.name}
                      <button onClick={() => handleCategoryChange(null)}>
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {selectedTag && (
                    <span className="inline-flex items-center gap-1 bg-card px-3 py-1 rounded-full text-xs sm:text-sm">
                      {selectedTag.replace('_', ' ')}
                      <button onClick={() => {
                        setSelectedTag(null);
                        setSearchParams({});
                      }}>
                        <X size={14} />
                      </button>
                    </span>
                  )}
                </div>
              )}

              <ProductGrid products={filteredProducts} columns={3} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
