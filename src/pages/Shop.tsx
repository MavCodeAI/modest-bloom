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
  { value: 'created_at-desc', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('created_at-desc');
  
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
      setSelectedSizes(sizes.split(','));
    }
    
    const colors = searchParams.get('colors');
    if (colors) {
      filters.colors = colors.split(',');
      setSelectedColors(colors.split(','));
    }
    
    const tags = searchParams.get('tags');
    if (tags) {
      filters.tags = tags.split(',');
      setSelectedTags(tags.split(','));
    }

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? Number(minPrice) : 0,
        maxPrice ? Number(maxPrice) : 5000
      ]);
    }
    
    return filters;
  }, [searchParams]);

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  
  // Fetch data using new hooks
  const { data: searchResults, isLoading, error } = useAdvancedSearch(filters);
  const { data: categories } = useCategories();
  const { data: suggestions } = useSearchSuggestions(searchQuery, 5);

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
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedTags([]);
    setPriceRange([0, 5000]);
    setFilters({
      query: searchQuery || undefined,
      sortBy: 'created_at',
      sortOrder: 'desc',
      page: 1,
      limit: 20
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const [sortBy, sortOrder] = value.split('-') as ['created_at' | 'price' | 'name', 'asc' | 'desc'];
    handleFilterChange({ sortBy, sortOrder });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(newSizes);
    handleFilterChange({ sizes: newSizes });
  };

  const handleColorToggle = (color: string) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    setSelectedColors(newColors);
    handleFilterChange({ colors: newColors });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    handleFilterChange({ tags: newTags });
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    handleFilterChange({ minPrice: value[0], maxPrice: value[1] });
  };

  const activeFilterCount = 
    (filters.category ? 1 : 0) +
    (selectedSizes.length > 0 ? 1 : 0) +
    (selectedColors.length > 0 ? 1 : 0) +
    (selectedTags.length > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const availableColors = ['Black', 'White', 'Navy', 'Beige', 'Gray', 'Brown', 'Green', 'Red'];
  const availableTags = ['new', 'sale', 'trending', 'exclusive', 'limited'];

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg">Filters</h2>
        {activeFilterCount > 0 && (
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
            onClick={() => handleFilterChange({ category: undefined })}
            className={cn(
              "block w-full text-left py-2 text-sm transition-colors",
              !filters.category
                ? "text-primary font-medium"
                : "text-foreground/70 hover:text-foreground"
            )}
          >
            All Products
          </button>
          {categories?.map(category => (
            <button
              key={category.id}
              onClick={() => handleFilterChange({ category: category.id })}
              className={cn(
                "block w-full text-left py-2 text-sm transition-colors",
                filters.category === category.id
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
            onValueChange={handlePriceRangeChange}
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

      {/* Sizes */}
      <div>
        <h3 className="font-medium text-sm mb-4 uppercase tracking-wide text-muted-foreground">
          Sizes
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {availableSizes.map(size => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={cn(
                "px-3 py-2 text-sm border rounded-md transition-colors",
                selectedSizes.includes(size)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-medium text-sm mb-4 uppercase tracking-wide text-muted-foreground">
          Colors
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {availableColors.map(color => (
            <button
              key={color}
              onClick={() => handleColorToggle(color)}
              className={cn(
                "px-3 py-2 text-sm border rounded-md transition-colors",
                selectedColors.includes(color)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary"
              )}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="font-medium text-sm mb-4 uppercase tracking-wide text-muted-foreground">
          Tags
        </h3>
        <div className="space-y-2">
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={cn(
                "block w-full text-left py-2 text-sm transition-colors",
                selectedTags.includes(tag)
                  ? "text-primary font-medium"
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 md:pt-24">
          <div className="luxury-container py-16 text-center">
            <p className="text-red-500">Error loading products: {error.message}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      
      <main className="pt-20 md:pt-24">
        {/* Header */}
        <div className="luxury-container py-8 sm:py-12">
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery);
                  }
                }}
                className="pl-12 pr-4 h-12 text-lg"
              />
            </div>
            
            {/* Search Suggestions */}
            {showSuggestions && suggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-center mb-2 sm:mb-4 mt-8">
            {filters.category 
              ? categories?.find(c => c.id === filters.category)?.name || 'Shop'
              : searchQuery
                ? `Search Results for "${searchQuery}"`
                : 'All Products'
            }
          </h1>
          <p className="text-muted-foreground text-center text-sm sm:text-base">
            {searchResults?.totalCount || 0} {searchResults?.totalCount === 1 ? 'product' : 'products'} found
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
                    {activeFilterCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="font-serif">Filters</SheetTitle>
                  </SheetHeader>
                  <ScrollArea>
                    <FilterContent />
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <div className="relative flex-1 sm:flex-none">
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  {filters.category && (
                    <span className="inline-flex items-center gap-1 bg-card px-3 py-1 rounded-full text-xs sm:text-sm">
                      {categories?.find(c => c.id === filters.category)?.name}
                      <button onClick={() => handleFilterChange({ category: undefined })}>
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {selectedSizes.map(size => (
                    <span key={size} className="inline-flex items-center gap-1 bg-card px-3 py-1 rounded-full text-xs sm:text-sm">
                      Size: {size}
                      <button onClick={() => handleSizeToggle(size)}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {selectedColors.map(color => (
                    <span key={color} className="inline-flex items-center gap-1 bg-card px-3 py-1 rounded-full text-xs sm:text-sm">
                      {color}
                      <button onClick={() => handleColorToggle(color)}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {selectedTags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-card px-3 py-1 rounded-full text-xs sm:text-sm">
                      {tag}
                      <button onClick={() => handleTagToggle(tag)}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                    <span className="inline-flex items-center gap-1 bg-card px-3 py-1 rounded-full text-xs sm:text-sm">
                      AED {priceRange[0]} - AED {priceRange[1]}
                      <button onClick={() => {
                        setPriceRange([0, 5000]);
                        handleFilterChange({ minPrice: 0, maxPrice: 5000 });
                      }}>
                        <X size={14} />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Products */}
              {!isLoading && searchResults && (
                <>
                  <ProductGrid 
                    products={searchResults.results.map(result => ({
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
                    }))} 
                    columns={3} 
                  />
                  
                  {/* Pagination */}
                  {searchResults.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <Button
                        variant="outline"
                        onClick={() => handleFilterChange({ page: Math.max(1, (filters.page || 1) - 1) })}
                        disabled={(filters.page || 1) === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {filters.page || 1} of {searchResults.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => handleFilterChange({ page: Math.min(searchResults.totalPages, (filters.page || 1) + 1) })}
                        disabled={(filters.page || 1) === searchResults.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* No Results */}
              {!isLoading && searchResults && searchResults.results.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg mb-4">No products found</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
