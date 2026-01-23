import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useStore } from '@/hooks/useStore';

const WholesaleCatalog = () => {
  const { products } = useStore();
  
  // Filter only wholesale-eligible products
  const wholesaleProducts = products.filter(p => p.isWholesale);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      
      <main className="pt-20 md:pt-24">
        {/* Header */}
        <div className="luxury-container py-12">
          <p className="text-primary text-sm font-medium uppercase tracking-[0.2em] mb-3 text-center">
            B2B Collection
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-center mb-4">
            Wholesale Catalog
          </h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-4">
            Browse our wholesale-eligible products. Prices are available upon quote request.
          </p>
          <p className="text-center">
            <span className="text-sm text-muted-foreground">
              {wholesaleProducts.length} products available for wholesale
            </span>
          </p>
        </div>

        <div className="luxury-container pb-24">
          <ProductGrid products={wholesaleProducts} showPrice={false} columns={4} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WholesaleCatalog;
