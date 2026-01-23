import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Check, Truck, RotateCcw, Shield } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const sizes = ['50', '52', '54', '56', '58', '60'];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getProductById, dispatch } = useStore();
  
  const product = getProductById(id || '');
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center px-4">
          <h1 className="font-serif text-xl sm:text-2xl mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images || [product.image];
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

    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, size: selectedSize, quantity },
    });

    toast({
      title: 'Added to bag',
      description: `${product.name} (Size ${selectedSize}) has been added to your bag.`,
    });

    dispatch({ type: 'TOGGLE_CART', payload: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      
      <main className="pt-20 md:pt-24">
        <div className="luxury-container py-6 sm:py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            {/* Image Gallery */}
            <div className="space-y-3 sm:space-y-4">
              {/* Main Image */}
              <div className="aspect-editorial rounded-lg overflow-hidden bg-muted">
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
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

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-sm font-medium">Select Size</span>
                  <button className="text-xs text-primary hover:underline">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "h-10 sm:h-12 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all",
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-foreground/50"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
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

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                className="w-full btn-luxury-primary h-12 sm:h-14 text-sm sm:text-base"
              >
                Add to Bag — AED {(product.price * quantity).toLocaleString()}
              </Button>

              {/* Features */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4 sm:py-6 border-y border-border">
                <div className="text-center">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2 text-primary" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Free UAE Delivery</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2 text-primary" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">14-Day Returns</p>
                </div>
                <div className="text-center">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2 text-primary" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Authentic Product</p>
                </div>
              </div>

              {/* Accordions */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description">
                  <AccordionTrigger className="text-sm font-medium">
                    Description
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
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
                        <span>Same-day dispatch for orders placed before 2 PM</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-1 text-primary flex-shrink-0" />
                        <span>International shipping available to 50+ countries</span>
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
                        <span>14-day return window for unworn items with tags</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-1 text-primary flex-shrink-0" />
                        <span>Free returns for UAE customers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-1 text-primary flex-shrink-0" />
                        <span>Exchange for different size available</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
