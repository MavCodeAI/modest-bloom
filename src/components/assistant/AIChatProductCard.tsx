import React from 'react';
import { ShoppingBag, Eye, MessageCircle, Check } from 'lucide-react';
import { MockAssistantProduct, AssistantLanguage } from '@/types/assistant';
import { useStore } from '@/hooks/useStore';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface AIChatProductCardProps {
  product: MockAssistantProduct;
  language?: AssistantLanguage;
  onProductClick?: () => void;
}

export const AIChatProductCard: React.FC<AIChatProductCardProps> = ({
  product,
  language = 'en',
  onProductClick,
}) => {
  const { dispatch } = useStore();
  const { toast } = useToast();
  const [added, setAdded] = React.useState(false);

  // Pick localized title and description
  const displayName =
    language === 'ur' && product.nameUrdu
      ? product.nameUrdu
      : language === 'ar' && product.nameArabic
      ? product.nameArabic
      : product.name;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Convert to Store product format safely
    const storeProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      description: product.description,
      image: product.image,
      images: [product.image],
      sizes: product.sizes,
      colors: [product.color],
      tags: product.tags,
      isWholesale: false,
      inStock: product.inStock,
      sku: product.sku,
      createdAt: new Date().toISOString(),
    };

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product: storeProduct,
        size: product.sizes[0] || '54',
        quantity: 1,
        color: product.color,
      },
    });

    setAdded(true);
    toast({
      title: 'Added to Boutique Cart',
      description: `${product.name} (Size 54) added successfully.`,
    });

    setTimeout(() => setAdded(false), 2000);
  };

  const whatsappInquiryUrl = `https://wa.me/971556020293?text=${encodeURIComponent(
    `Hello Modest Way Fashion! I am inquiring about the ${product.name} (SKU: ${product.sku}, AED ${product.price}). Is it available in size 54?`
  )}`;

  return (
    <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between text-left">
      <div>
        {/* Thumbnail & Badges */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={displayName}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-background/90 text-foreground backdrop-blur-sm rounded-full shadow-xs">
              {product.category}
            </span>
          </div>
          {product.originalPrice && (
            <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-bold bg-amber-600 text-white rounded-md shadow-xs">
              SAVE AED {product.originalPrice - product.price}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-baseline justify-between gap-1 mb-1">
            <span className="text-xs font-mono text-muted-foreground">{product.sku}</span>
            <span className="text-[10px] text-emerald-600 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
              {product.inStock ? 'In Stock' : 'Pre-order'}
            </span>
          </div>

          <h4 className="font-serif font-medium text-xs sm:text-sm text-foreground line-clamp-1 leading-snug">
            {displayName}
          </h4>

          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-serif font-bold text-sm text-primary">
              AED {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                AED {product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 pt-0 grid grid-cols-2 gap-1.5">
        <Link
          to={`/shop?search=${encodeURIComponent(product.name)}`}
          onClick={onProductClick}
          className="inline-flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-medium border border-border rounded-lg bg-background hover:bg-muted text-foreground transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View</span>
        </Link>

        <button
          onClick={handleAddToCart}
          className="inline-flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors shadow-xs"
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <a
          href={whatsappInquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2 mt-1 inline-flex items-center justify-center gap-1.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-[#25D366] transition-colors"
        >
          <MessageCircle className="w-3 h-3 text-[#25D366]" />
          <span>Inquire on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
