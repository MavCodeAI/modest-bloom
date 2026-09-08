import { Link } from 'react-router-dom';
import { Product } from '@/lib/data';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';
import { memo } from 'react';
import { Heart } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { useToggleWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  showPrice?: boolean;
  className?: string;
}

const parseColor = (raw: string) => {
  const [name, hex] = raw.split(':');
  return { name: name.trim(), hex: hex?.trim() || '#cccccc' };
};

export const ProductCard = memo(function ProductCard({ product, showPrice = true, className }: ProductCardProps) {
  const { wishlist, dispatch } = useStore();
  const { user } = useAuth();
  const toggleWishlistMutation = useToggleWishlist();
  const { toast } = useToast();

  const isWishlisted = wishlist.includes(product.id);
  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const isNew = product.tags.includes('new_drop');
  const colors = product.colors || [];
  const visibleColors = colors.slice(0, 4);
  const extraColors = colors.length - visibleColors.length;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Toggle in local store
    dispatch({ type: 'TOGGLE_WISHLIST_ITEM', payload: product.id });

    if (user) {
      toggleWishlistMutation.mutate(product.id);
    } else {
      toast({
        title: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist ❤️',
        description: isWishlisted
          ? 'Item removed from your saved list.'
          : 'Item saved to your wishlist.',
      });
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn("product-card group block relative", className)}
    >
      {/* Image Container */}
      <div className="relative aspect-editorial overflow-hidden rounded-lg bg-muted">
        <OptimizedImage
          src={product.image}
          alt={product.name}
          className="product-image w-full h-full object-cover transition-transform duration-700"
          placeholder="/placeholder.svg"
        />
        
        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={cn(
            "absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm",
            isWishlisted
              ? "bg-secondary text-secondary-foreground"
              : "bg-background/80 hover:bg-background text-foreground/70 hover:text-foreground backdrop-blur-sm"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-transform active:scale-125",
              isWishlisted && "fill-current"
            )}
          />
        </button>

        {/* Overlay on hover - hidden on mobile for better touch UX */}
        <div className="product-overlay absolute inset-0 bg-background/20 opacity-0 transition-opacity duration-300 hidden sm:flex items-center justify-center pointer-events-none">
          <span className="bg-foreground text-background px-4 sm:px-6 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
            Quick View
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-2 pointer-events-none">
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

        {/* Color swatches */}
        {visibleColors.length > 0 && (
          <div className="flex items-center gap-1" aria-label={`Available in ${colors.length} color${colors.length > 1 ? 's' : ''}`}>
            {visibleColors.map((c) => {
              const { name, hex } = parseColor(c);
              return (
                <span
                  key={c}
                  title={name}
                  className="inline-block w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ring-1 ring-border"
                  style={{ backgroundColor: hex }}
                />
              );
            })}
            {extraColors > 0 && (
              <span className="text-[10px] sm:text-xs text-muted-foreground ml-0.5">
                +{extraColors}
              </span>
            )}
          </div>
        )}

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
