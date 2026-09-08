import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  Check, 
  Truck, 
  RotateCcw, 
  Shield, 
  Heart, 
  ZoomIn, 
  MessageCircle, 
  Ruler, 
  Sparkles, 
  Layers,
  Scissors
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { useStore } from '@/hooks/useStore';
import { useSEO } from '@/hooks/useSEO';
import { useProduct } from '@/hooks/useProducts';
import { useProductVariants } from '@/hooks/useProductVariants';
import { useToggleWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const fallbackSizes = ['50', '52', '54', '56', '58', '60'];

const parseColor = (raw: string) => {
  const [name, hex] = raw.split(':');
  return { name: name.trim(), hex: hex?.trim() || '#cccccc' };
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { wishlist, dispatch } = useStore();
  const { user } = useAuth();
  const toggleWishlistMutation = useToggleWishlist();
  
  // Fetch product from database
  const { data: dbProduct, isLoading, error } = useProduct(id || '');
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [userHeightCm, setUserHeightCm] = useState<string>('');

  // Fetch per-variant inventory
  const { data: variants } = useProductVariants(id);

  const isWishlisted = wishlist.includes(id || '');

  // Recommended size based on height
  const recommendedSize = useMemo(() => {
    const h = parseInt(userHeightCm, 10);
    if (isNaN(h) || h < 140) return null;
    if (h <= 152) return '50';
    if (h <= 158) return '52';
    if (h <= 164) return '54';
    if (h <= 169) return '56';
    if (h <= 174) return '58';
    return '60';
  }, [userHeightCm]);

  const handleToggleWishlist = () => {
    if (!id) return;
    dispatch({ type: 'TOGGLE_WISHLIST_ITEM', payload: id });
    if (user) {
      toggleWishlistMutation.mutate(id);
    } else {
      toast({
        title: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist ❤️',
        description: isWishlisted ? 'Item removed from your saved list.' : 'Item saved to your wishlist.',
      });
    }
  };


  // Transform database product to match local Product type
  const product = dbProduct ? {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description || '',
    price: dbProduct.sale_price || dbProduct.price,
    originalPrice: dbProduct.sale_price ? dbProduct.price : undefined,
    image: dbProduct.images?.[0] || '/placeholder.svg',
    images: dbProduct.images || [],
    category: 'Abayas',
    tags: dbProduct.tags || [],
    inStock: dbProduct.in_stock,
    sizes: dbProduct.sizes || fallbackSizes,
    colors: dbProduct.colors || [],
  } : null;

  // Stock for current size+color combo (if variants exist)
  const selectedVariantStock = useMemo(() => {
    if (!variants || variants.length === 0 || !selectedSize || !selectedColor) return null;
    const v = variants.find(v => v.size === selectedSize && v.color === selectedColor);
    return v ? v.stock : 0;
  }, [variants, selectedSize, selectedColor]);

  const isVariantOutOfStock = (size: string, color: string) => {
    if (!variants || variants.length === 0) return false;
    const v = variants.find(x => x.size === size && x.color === color);
    return !v || v.stock <= 0;
  };

  // SEO optimization - must be called before any early returns
  useSEO({
    title: product ? `${product.name} - Modest Way Fashion UAE` : 'Product Not Found - Modest Way Fashion',
    description: product?.description || 'Product not found. Browse our luxury abaya collection.',
    keywords: product ? `${product.name}, ${product.category}, modest fashion UAE, Dubai abaya, luxury abaya, ${product.tags.join(', ')}` : 'product not found, modest fashion, abaya',
    ogImage: product?.image,
    type: product ? 'product' : 'website',
    productData: product ? {
      name: product.name,
      price: product.price,
      availability: product.inStock ? 'InStock' : 'OutOfStock',
      image: product.image,
      description: product.description
    } : undefined
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Navbar />
        <main className="pt-16 md:pt-24">
          <div className="luxury-container py-6 sm:py-8">
            <Skeleton className="h-6 w-20 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <Skeleton className="aspect-editorial rounded-lg" />
              <div className="space-y-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-8 w-32" />
                <div className="grid grid-cols-6 gap-2">
                  {fallbackSizes.map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
                <Skeleton className="h-14 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Navbar />
        <div className="pt-32 text-center px-4">
          <h1 className="font-serif text-xl sm:text-2xl mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.image];
  const isOnSale = product.originalPrice && product.originalPrice > product.price;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: 'Please select a size',
        description: 'Choose your preferred size before adding to cart.',
        variant: 'destructive',
      });
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast({
        title: 'Please select a color',
        description: 'Choose your preferred color before adding to cart.',
        variant: 'destructive',
      });
      return;
    }

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          images: product.images,
          category: product.category,
          tags: product.tags,
          inStock: product.inStock,
          sizes: product.sizes,
          colors: product.colors,
          isWholesale: false,
          createdAt: new Date().toISOString(),
        },
        size: selectedSize,
        color: selectedColor || undefined,
        quantity,
      },
    });

    toast({
      title: 'Added to bag',
      description: `${product.name} (Size ${selectedSize}${selectedColor ? `, ${parseColor(selectedColor).name}` : ''}) has been added to your bag.`,
    });

    dispatch({ type: 'TOGGLE_CART', payload: true });
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navbar />
      <CartDrawer />
      
      <main className="pt-20 sm:pt-24 md:pt-28">
        <div className="luxury-container py-4 sm:py-6">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Shop', href: '/shop' },
              { label: product.category, href: '/shop' },
              { label: product.name },
            ]}
            className="mb-4"
          />

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 sm:mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            {/* Image Gallery */}
            <div className="space-y-3 sm:space-y-4">
              {/* Main Image */}
              <div 
                onClick={() => setIsLightboxOpen(true)}
                className="aspect-editorial rounded-lg overflow-hidden bg-muted relative group cursor-zoom-in"
              >
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={14} />
                  <span>Tap to inspect</span>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={cn(
                        "flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-colors",
                        activeImage === index
                          ? "border-primary"
                          : "border-transparent hover:border-border"
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="lg:sticky lg:top-32 lg:self-start space-y-6 sm:space-y-8">
              {/* Breadcrumb */}
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {product.category}
              </p>

              {/* Title & Price */}
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">{product.name}</h1>
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  <span className="font-serif text-xl sm:text-2xl text-primary">
                    AED {product.price.toLocaleString()}
                  </span>
                  {isOnSale && product.originalPrice && (
                    <span className="text-base sm:text-lg text-muted-foreground line-through">
                      AED {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Color Selector — large visual swatches */}
              {product.colors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-sm font-medium">
                      Color: <span className="text-muted-foreground font-normal">
                        {selectedColor ? parseColor(selectedColor).name : 'Select a color'}
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((c) => {
                      const { name, hex } = parseColor(c);
                      const isSelected = selectedColor === c;
                      return (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          aria-label={`Select color ${name}`}
                          title={name}
                          className={cn(
                            "group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all",
                            "ring-offset-2 ring-offset-background",
                            isSelected
                              ? "ring-2 ring-primary scale-110"
                              : "ring-1 ring-border hover:ring-foreground/40 hover:scale-105"
                          )}
                          style={{ backgroundColor: hex }}
                        >
                          {isSelected && (
                            <Check
                              size={20}
                              className={cn(
                                "absolute inset-0 m-auto",
                                // pick contrasting check color
                                hex.toLowerCase() === '#ffffff' || hex.toLowerCase() === '#f5f1ea'
                                  ? "text-foreground"
                                  : "text-white"
                              )}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-sm font-medium">Select Size</span>
                  <button 
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs text-primary hover:underline font-medium cursor-pointer"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => {
                    const outOfStock = selectedColor ? isVariantOutOfStock(size, selectedColor) : false;
                    return (
                      <button
                        key={size}
                        onClick={() => !outOfStock && setSelectedSize(size)}
                        disabled={outOfStock}
                        className={cn(
                          "h-10 sm:h-12 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all relative",
                          selectedSize === size
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-foreground/50",
                          outOfStock && "opacity-50 cursor-not-allowed line-through bg-muted/80 border-dashed border-border text-muted-foreground/70"
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                {selectedVariantStock !== null && selectedVariantStock > 0 && selectedVariantStock <= 5 && (
                  <p className="text-xs text-amber-600 font-medium mt-2">
                    Only {selectedVariantStock} left in stock!
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center hover:border-foreground transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center hover:border-foreground transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart, WhatsApp & Wishlist */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 btn-luxury-primary h-12 sm:h-14 text-sm sm:text-base shadow-sm"
                  >
                    Add to Bag — AED {(product.price * quantity).toLocaleString()}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleToggleWishlist}
                    className={cn(
                      "h-12 sm:h-14 px-4 sm:px-6 rounded-lg border-2 transition-all flex items-center justify-center gap-2",
                      isWishlisted
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-border hover:border-foreground/50 text-foreground"
                    )}
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={cn("w-5 h-5", isWishlisted && "fill-secondary text-secondary")} />
                    <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider">
                      {isWishlisted ? "Saved" : "Save"}
                    </span>
                  </Button>
                </div>

                <a
                  href={`https://wa.me/971556020293?text=${encodeURIComponent(
                    `Hi Modest Way Fashion Dubai, I'm inquiring about:\n\n*${product.name}*\n• Price: AED ${product.price}\n• Selected Size: ${selectedSize || 'Not selected yet'}\n• Quantity: ${quantity}\n\nCould you please confirm availability and express delivery in the UAE?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 h-11 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 font-medium text-xs sm:text-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Order or Inquire via WhatsApp (+971 55 602 0293)</span>
                </a>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4 sm:py-6 border-y border-border">
                <div className="text-center">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground font-medium">Free UAE Delivery</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground font-medium">14-Day Returns</p>
                </div>
                <div className="text-center">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground font-medium">Authentic Dubai Cut</p>
                </div>
              </div>

              {/* Accordions */}
              <Accordion type="single" collapsible defaultValue="fabric" className="w-full">
                <AccordionItem value="fabric">
                  <AccordionTrigger className="text-sm font-medium">
                    Fabric, Cut & Craftsmanship
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2.5">
                        <Layers size={16} className="mt-0.5 text-primary flex-shrink-0" />
                        <div>
                          <strong className="text-foreground font-medium">Material: </strong>
                          Grade-A Korean Nida & textured Japanese crepe blend. Breathable, fluid, and anti-static.
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Shield size={16} className="mt-0.5 text-primary flex-shrink-0" />
                        <div>
                          <strong className="text-foreground font-medium">Opacity: </strong>
                          100% full coverage with zero transparency under indoor and outdoor lighting.
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Scissors size={16} className="mt-0.5 text-primary flex-shrink-0" />
                        <div>
                          <strong className="text-foreground font-medium">Tailoring: </strong>
                          Artisan double-turned hems, reinforced french seams, and precision sleeve drape tailored in Dubai.
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <RotateCcw size={16} className="mt-0.5 text-primary flex-shrink-0" />
                        <div>
                          <strong className="text-foreground font-medium">Care: </strong>
                          Gentle machine wash 30°C or dry clean. Low-heat steam iron for a pristine finish.
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="description">
                  <AccordionTrigger className="text-sm font-medium">
                    Design Description
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                    {product.description}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                  <AccordionTrigger className="text-sm font-medium">
                    Shipping & Delivery
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-1 text-primary flex-shrink-0" />
                        <span>Free standard delivery on UAE orders over AED 500</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-1 text-primary flex-shrink-0" />
                        <span>Same-day Dubai courier dispatch for orders placed before 2 PM</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-1 text-primary flex-shrink-0" />
                        <span>International courier shipping to GCC, UK, US, and 50+ countries</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="returns">
                  <AccordionTrigger className="text-sm font-medium">
                    Returns & Exchanges
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-1 text-primary flex-shrink-0" />
                        <span>14-day hassle-free exchange window for unworn items with tags</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-1 text-primary flex-shrink-0" />
                        <span>Free size exchanges for UAE customers</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>

      {/* Size Guide & Height Calculator Dialog */}
      <Dialog open={isSizeGuideOpen} onOpenChange={setIsSizeGuideOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Abaya Size Guide & Height Calculator</DialogTitle>
            <DialogDescription>
              Abaya sizes represent length in inches from shoulder to hem. Calculate your size instantly below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            {/* Interactive Height Calculator */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Ruler className="w-4 h-4" />
                <span>Instant Height Recommender</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:w-1/2">
                  <label htmlFor="heightInput" className="text-xs text-muted-foreground block mb-1">
                    Enter your height in centimeters (e.g. 165)
                  </label>
                  <Input
                    id="heightInput"
                    type="number"
                    placeholder="e.g. 165"
                    value={userHeightCm}
                    onChange={(e) => setUserHeightCm(e.target.value)}
                    className="bg-background h-10"
                    min={140}
                    max={195}
                  />
                </div>
                <div className="w-full sm:w-1/2 flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-4">
                  {recommendedSize ? (
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-muted-foreground">Recommended:</p>
                      <p className="text-lg font-bold text-primary">Size {recommendedSize}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Enter height to see size</p>
                  )}
                  {recommendedSize && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedSize(recommendedSize);
                        setIsSizeGuideOpen(false);
                        toast({
                          title: `Size ${recommendedSize} Selected`,
                          description: `Applied recommended size based on your height (${userHeightCm} cm).`,
                        });
                      }}
                      className="btn-luxury-primary h-9 px-4 text-xs font-semibold"
                    >
                      Apply Size {recommendedSize}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Abaya Size</th>
                    <th className="p-3">Length (Inches)</th>
                    <th className="p-3">Recommended Height</th>
                    <th className="p-3">Bust (Inches)</th>
                    <th className="p-3">Sleeve Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className={cn(recommendedSize === '50' && "bg-primary/10 font-bold")}>
                    <td className="p-3 font-medium">50</td>
                    <td className="p-3">50" (127 cm)</td>
                    <td className="p-3">4'10" – 5'0" (147-152 cm)</td>
                    <td className="p-3">40" – 42"</td>
                    <td className="p-3">26"</td>
                  </tr>
                  <tr className={cn(recommendedSize === '52' && "bg-primary/10 font-bold")}>
                    <td className="p-3 font-medium">52</td>
                    <td className="p-3">52" (132 cm)</td>
                    <td className="p-3">5'1" – 5'2" (155-158 cm)</td>
                    <td className="p-3">42" – 44"</td>
                    <td className="p-3">27"</td>
                  </tr>
                  <tr className={cn(recommendedSize === '54' && "bg-primary/10 font-bold")}>
                    <td className="p-3 font-medium">54</td>
                    <td className="p-3">54" (137 cm)</td>
                    <td className="p-3">5'3" – 5'4" (160-163 cm)</td>
                    <td className="p-3">44" – 46"</td>
                    <td className="p-3">27.5"</td>
                  </tr>
                  <tr className={cn(recommendedSize === '56' && "bg-primary/10 font-bold")}>
                    <td className="p-3 font-medium">56</td>
                    <td className="p-3">56" (142 cm)</td>
                    <td className="p-3">5'5" – 5'6" (165-168 cm)</td>
                    <td className="p-3">46" – 48"</td>
                    <td className="p-3">28"</td>
                  </tr>
                  <tr className={cn(recommendedSize === '58' && "bg-primary/10 font-bold")}>
                    <td className="p-3 font-medium">58</td>
                    <td className="p-3">58" (147 cm)</td>
                    <td className="p-3">5'7" – 5'8" (170-173 cm)</td>
                    <td className="p-3">48" – 50"</td>
                    <td className="p-3">28.5"</td>
                  </tr>
                  <tr className={cn(recommendedSize === '60' && "bg-primary/10 font-bold")}>
                    <td className="p-3 font-medium">60</td>
                    <td className="p-3">60" (152 cm)</td>
                    <td className="p-3">5'9" – 6'0" (175-183 cm)</td>
                    <td className="p-3">50" – 52"</td>
                    <td className="p-3">29"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">💡 How to Measure:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Length:</strong> Measure from the highest point of the shoulder down to your ankle or desired hem length.</li>
                <li><strong>Heels:</strong> If you plan on wearing heels with this abaya, consider sizing up by one size (+2 inches).</li>
                <li><strong>Fit:</strong> Modest Way abayas are designed with a relaxed, elegant modest drape.</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setIsSizeGuideOpen(false)} className="btn-luxury-primary">
                Got it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl p-2 sm:p-4 bg-background/95 backdrop-blur-md">
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-lg">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-xl"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto p-1 max-w-full">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "w-14 h-18 rounded overflow-hidden border-2 flex-shrink-0 transition-all",
                      activeImage === idx ? "border-primary scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dedicated High-Conversion Mobile Sticky Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border p-3 shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-serif font-semibold text-foreground truncate">{product.name}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-primary">AED {(product.price * quantity).toLocaleString()}</span>
            {selectedSize ? (
              <span className="text-muted-foreground font-medium">· Size {selectedSize}</span>
            ) : (
              <span className="text-amber-600 font-medium">· Pick size</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={`https://wa.me/971556020293?text=${encodeURIComponent(
              `Hi Modest Way Fashion Dubai, I'm inquiring about:\n\n*${product.name}*\n• Price: AED ${product.price}\n• Size: ${selectedSize || 'Not selected'}\n\nIs this in stock for express delivery?`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#128C7E] transition-colors"
            title="Inquire via WhatsApp"
            aria-label="WhatsApp Inquiry"
          >
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
          </a>

          <Button
            onClick={handleAddToCart}
            className="btn-luxury-primary h-10 px-4 text-xs font-semibold"
          >
            {selectedSize ? 'Add to Bag' : 'Select Size'}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
