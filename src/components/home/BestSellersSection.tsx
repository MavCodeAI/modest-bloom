import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { ProductGrid } from '@/components/product/ProductGrid';

export function BestSellersSection() {
  const { getProductsByTag } = useStore();
  const bestSellers = getProductsByTag('best_seller').slice(0, 4);

  return (
    <section className="section-padding bg-card">
      <div className="luxury-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-primary text-sm font-medium uppercase tracking-[0.2em] mb-3">
              Most Loved
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">Best Sellers</h2>
          </div>
          <Link 
            to="/shop?tag=best_seller" 
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mt-4 md:mt-0"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        <ProductGrid products={bestSellers} columns={4} />
      </div>
    </section>
  );
}
