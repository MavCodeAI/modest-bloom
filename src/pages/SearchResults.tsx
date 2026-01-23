import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useStore } from '@/hooks/useStore';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { products } = useStore();
  const query = searchParams.get('q') || '';

  const filteredProducts = useMemo(() => {
    if (!query) return [];

    const lowerQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [products, query]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <main className="pt-20 md:pt-24">
        <div className="luxury-container py-8 sm:py-12">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-center mb-2 sm:mb-4">
            Search Results
          </h1>
          <p className="text-muted-foreground text-center text-sm sm:text-base">
            {query ? (
              <>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found for "{query}"
              </>
            ) : (
              'No search query provided'
            )}
          </p>
        </div>

        <div className="luxury-container pb-16 sm:pb-24">
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} columns={3} />
          ) : query ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No products found matching "{query}"
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Try searching for product names, categories, or tags
              </p>
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;