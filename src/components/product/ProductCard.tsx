import { Link } from 'react-router-dom';
import { Product } from '@/lib/data';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface ProductCardProps {
  product: Product;
  showPrice?: boolean;
  className?: string;
}

export const ProductCard = memo(function ProductCard({ product, showPrice = true, className }: ProductCardProps) {
  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const isNew = product.tags.includes('new_drop');

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn("product-card group block", className)}
    >
      {/* Image Container */}
      <div className="relative aspect-editorial overflow-hidden rounded-lg bg-muted">
        <OptimizedImage
          src={product.image}
          alt={product.name}
          className="product-image w-full h-full object-cover transition-transform duration-700"
          placeholder="/placeholder.svg"
        />
        
        {/* Overlay on hover - hidden on mobile for better touch UX */}
        <div className="product-overlay absolute inset-0 bg-background/20 opacity-0 transition-opacity duration-300 hidden sm:flex items-center justify-center">
          <span className="bg-foreground text-background px-4 sm:px-6 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
            Quick View
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-2">
          {isNew && (
            <span className="badge-new rounded text-[10px] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1">New</span>
          )}
          {isOnSale && (
            <span className="badge-sale rounded text-[10px] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1">Sale</span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="mt-2 sm:mt-4 space-y-1 sm:space-y-2">
        <h3 className="font-medium text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 sm:line-clamp-1">
          {product.name}
        </h3>
        
        {showPrice && (
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <span className="price-tag text-xs sm:text-sm">
              AED {product.price.toLocaleString()}
            </span>
            {isOnSale && product.originalPrice && (
              <span className="price-original text-[10px] sm:text-sm">
                AED {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        )}

        {!showPrice && (
          <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
            Request Quote
          </span>
        )}
      </div>
    </Link>
  );
});
