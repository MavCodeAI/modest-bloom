import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Skeleton } from '@/components/ui/skeleton';

// Adapter to transform database product to UI product format
function adaptProduct(dbProduct: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  images: string[] | null;
  sizes: string[] | null;
  colors: string[] | null;
  tags: string[] | null;
  in_stock: boolean | null;
  is_wholesale: boolean | null;
}) {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    price: dbProduct.price,
    originalPrice: dbProduct.sale_price || undefined,
    category: 'abayas', // Will be enriched later
    description: dbProduct.description || '',
    image: dbProduct.images?.[0] || '/placeholder.svg',
    images: dbProduct.images || [],
    sizes: dbProduct.sizes || ['50', '52', '54', '56', '58', '60'],
    colors: dbProduct.colors || [],
    tags: dbProduct.tags || [],
    isWholesale: dbProduct.is_wholesale || false,
    inStock: dbProduct.in_stock ?? true,
    createdAt: new Date().toISOString(),
  };
}

export function NewDropsSection() {
  const { data: products, isLoading } = useProducts({ tag: 'new_drop' });
  const newProducts = (products || []).slice(0, 4).map(adaptProduct);

  return (
    <section className="section-padding">
      <div className="luxury-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-primary text-sm font-medium uppercase tracking-[0.2em] mb-3">
              Just Arrived
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">New Drops</h2>
          </div>
          <Link 
            to="/shop?tag=new_drop" 
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mt-4 md:mt-0"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/5] rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid products={newProducts} columns={4} />
        )}
      </div>
    </section>
  );
}
