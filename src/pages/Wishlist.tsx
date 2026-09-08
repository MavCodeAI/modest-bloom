import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/product/ProductCard';
import { ShoppingCart, Heart, LogIn } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist, useToggleWishlist } from '@/hooks/useWishlist';
import { useStore } from '@/hooks/useStore';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/hooks/useProducts';

// Convert database product to store product format
const convertToStoreProduct = (product: Product): import('@/lib/data').Product => ({
  id: product.id,
  name: product.name,
  description: product.description || '',
  price: product.sale_price || product.price,
  originalPrice: product.sale_price ? product.price : undefined,
  image: product.images?.[0] || '/placeholder.svg',
  images: product.images || [],
  sizes: product.sizes || ['S', 'M', 'L', 'XL'],
  colors: product.colors || [],
  category: '',
  tags: product.tags || [],
  inStock: product.in_stock ?? true,
  isWholesale: product.is_wholesale ?? false,
  createdAt: product.created_at,
});

export function Wishlist() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dispatch } = useStore();
  const { data: wishlistItems, isLoading } = useWishlist();
  const toggleWishlist = useToggleWishlist();

  const handleMoveToCart = (product: Product) => {
    const storeProduct = convertToStoreProduct(product);
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { 
        product: storeProduct, 
        size: product.sizes?.[0] || 'M', 
        quantity: 1 
      } 
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch({ type: 'TOGGLE_WISHLIST_ITEM', payload: productId });
    if (user) {
      toggleWishlist.mutate(productId);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Navbar />
        
        <main className="pt-16 md:pt-24">
          <div className="luxury-container py-6 sm:py-8">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl">My Wishlist</h1>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[4/5]" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const wishlistProducts = wishlistItems?.filter(item => item.product) || [];

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navbar />
      
      <main className="pt-16 md:pt-24">
        <div className="luxury-container py-6 sm:py-8">
          <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl">My Wishlist</h1>
            </div>
            {!user && wishlistProducts.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/auth')}
                className="gap-1.5 text-xs sm:text-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign in to Sync
              </Button>
            )}
          </div>

          {!user && wishlistProducts.length > 0 && (
            <div className="mb-6 p-4 rounded-lg bg-muted/60 border border-border flex items-center justify-between gap-4 text-xs sm:text-sm">
              <p className="text-muted-foreground">
                Items saved in your guest session. <button onClick={() => navigate('/auth')} className="text-primary underline font-medium">Sign in</button> to sync across your devices.
              </p>
            </div>
          )}
          
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full mb-4">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-md mx-auto">
                Explore our signature abayas and modest couture collections to save your favorite pieces.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button onClick={() => navigate('/shop')} className="btn-luxury-primary">
                  Explore Collection
                </Button>
                {!user && (
                  <Button variant="outline" onClick={() => navigate('/auth')}>
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 sm:mb-6">
                <p className="text-muted-foreground text-sm sm:text-base">
                  You have {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} in your wishlist
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {wishlistProducts.map(item => {
                  if (!item.product) return null;
                  const storeProduct = convertToStoreProduct(item.product);
                  
                  return (
                    <Card key={item.id} className="group overflow-hidden border-border">
                      <CardContent className="p-0">
                        <ProductCard product={storeProduct} />
                        <div className="p-4 border-t border-border space-y-3">
                          <Button 
                            onClick={() => handleMoveToCart(item.product!)} 
                            className="w-full btn-luxury-primary h-10 sm:h-11 text-sm sm:text-base"
                            size="sm"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Move to Cart
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleRemoveFromWishlist(item.product_id)}
                            className="w-full h-10 sm:h-11 text-sm sm:text-base"
                            size="sm"
                            disabled={toggleWishlist.isPending}
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
