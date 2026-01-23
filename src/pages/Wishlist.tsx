import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/product/ProductCard';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/lib/data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useNavigate } from 'react-router-dom';

export function Wishlist() {
  const { wishlist, getProductById, dispatch } = useStore();
  const wishlistProducts = wishlist.map(id => getProductById(id)).filter(Boolean) as Product[];
  const navigate = useNavigate();

  const handleMoveToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, size: product.sizes[0], quantity: 1 } });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch({ type: 'TOGGLE_WISHLIST_ITEM', payload: productId });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 md:pt-24">
        <div className="luxury-container py-6 sm:py-8">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl">My Wishlist</h1>
          </div>
          
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full mb-4">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-6">
                Add items to your wishlist to see them here.
              </p>
              <Button onClick={() => navigate('/shop')} className="btn-luxury-primary">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 sm:mb-6">
                <p className="text-muted-foreground text-sm sm:text-base">
                  You have {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} in your wishlist
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {wishlistProducts.map(product => (
                  <Card key={product.id} className="group overflow-hidden border-border">
                    <CardContent className="p-0">
                      <ProductCard product={product} />
                      <div className="p-4 border-t border-border space-y-3">
                        <Button 
                          onClick={() => handleMoveToCart(product)} 
                          className="w-full btn-luxury-primary h-10 sm:h-11 text-sm sm:text-base"
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Move to Cart
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleRemoveFromWishlist(product.id)}
                          className="w-full h-10 sm:h-11 text-sm sm:text-base"
                          size="sm"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}