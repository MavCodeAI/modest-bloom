import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';

export function AbayaOfTheWeekSection() {
  const { getProductsByTag } = useStore();
  const featuredProduct = getProductsByTag('abaya_of_week')[0] || getProductsByTag('best_seller')[0];

  if (!featuredProduct) return null;

  return (
    <section className="section-padding">
      <div className="luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
            <img
              src={featuredProduct.image}
              alt={featuredProduct.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded">
              <span className="text-xs font-semibold uppercase tracking-widest">Featured</span>
            </div>
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <p className="text-primary text-sm font-medium uppercase tracking-[0.2em] mb-4">
              Abaya of the Week
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
              {featuredProduct.name}
            </h2>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 star-gold fill-current" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(127 reviews)</span>
            </div>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {featuredProduct.description}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <span className="font-serif text-3xl text-primary">
                AED {featuredProduct.price.toLocaleString()}
              </span>
              {featuredProduct.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  AED {featuredProduct.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <Link to={`/product/${featuredProduct.id}`}>
              <Button className="btn-luxury-primary group">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
