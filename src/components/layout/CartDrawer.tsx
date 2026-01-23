import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function CartDrawer() {
  const { cart, cartTotal, isCartOpen, dispatch } = useStore();

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_CART', payload: false });
  };

  const updateQuantity = (productId: string, size: string, delta: number) => {
    const item = cart.find(i => i.product.id === productId && i.size === size);
    if (item) {
      dispatch({
        type: 'UPDATE_CART_ITEM',
        payload: { productId, size, quantity: item.quantity + delta },
      });
    }
  };

  const removeItem = (productId: string, size: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId, size } });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300",
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 transform transition-transform duration-300 ease-out",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-serif text-xl">Shopping Bag</h2>
            <button
              onClick={handleClose}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag size={48} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-6">Your bag is empty</p>
                <Button onClick={handleClose} variant="outline">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-4 pb-6 border-b border-border last:border-0"
                  >
                    {/* Image */}
                    <div className="w-24 h-30 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">Size: {item.size}</p>
                      <p className="text-primary font-medium mt-2">
                        AED {item.product.price.toLocaleString()}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, -1)}
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, 1)}
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id, item.size)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-border space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-serif text-xl">AED {cartTotal.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
              <Link to="/checkout" onClick={handleClose}>
                <Button className="w-full btn-luxury-primary">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
