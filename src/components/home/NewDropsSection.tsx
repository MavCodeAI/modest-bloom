import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { ProductGrid } from '@/components/product/ProductGrid';

export function NewDropsSection() {
  const { getProductsByTag } = useStore();
  const newProducts = getProductsByTag('new_drop').slice(0, 4);

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
        <ProductGrid products={newProducts} columns={4} />
      </div>
    </section>
  );
}
