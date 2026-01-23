import { Product } from '@/lib/data';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  showPrice?: boolean;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ProductGrid({ 
  products, 
  showPrice = true, 
  columns = 4,
  className 
}: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (products.length === 0) {
    return (
      <div className="py-16 sm:py-24 text-center">
        <p className="text-muted-foreground text-sm sm:text-base">No products found</p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-3 sm:gap-4 md:gap-6 lg:gap-8", gridCols[columns], className)}>
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fade-in"
          style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
        >
          <ProductCard product={product} showPrice={showPrice} />
        </div>
      ))}
    </div>
  );
}
