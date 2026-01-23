import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Package, Truck, DollarSign, CreditCard } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

interface OrderData {
  order: {
    id: string;
    items: OrderItem[];
    customer: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      country: string;
    };
    total: number;
    subtotal: number;
    shipping: number;
    codFee: number;
    paymentMethod: 'cod' | 'card';
    status: string;
  };
}

interface OrderItem {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
  size: string;
  quantity: number;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = (location.state as OrderData) || { order: null };

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center luxury-container px-4">
          <h1 className="font-serif text-xl sm:text-2xl mb-4">Order not found</h1>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 md:pt-24">
        <div className="luxury-container py-6 sm:py-8">
          {/* Success Message */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Thank you for your purchase. Your order has been received.
            </p>
            <p className="text-primary font-medium mt-2">Order #{order.id}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Shipping Information */}
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
                <h2 className="font-serif text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Information
                </h2>
                <div className="space-y-3 text-sm sm:text-base">
                  <div>
                    <span className="font-medium">{order.customer.name}</span>
                  </div>
                  <div className="text-muted-foreground">
                    {order.customer.address}<br />
                    {order.customer.city}, {order.customer.country}
                  </div>
                  <div className="text-muted-foreground">
                    {order.customer.email}<br />
                    {order.customer.phone}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
                <h2 className="font-serif text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {order.items.map((item: OrderItem, index: number) => (
                    <div
                      key={`${item.product.id}-${item.size}-${index}`}
                      className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-border last:border-0"
                    >
                      <div className="w-14 h-[70px] sm:w-16 sm:h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Size {item.size} × {item.quantity}
                        </p>
                        <p className="text-xs sm:text-sm text-primary mt-1">
                          AED {(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
                <h2 className="font-serif text-lg sm:text-xl mb-4 sm:mb-6">Payment Method</h2>
                <div className="flex items-center gap-3">
                  {order.paymentMethod === 'cod' ? (
                    <>
                      <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      <div>
                        <p className="font-medium text-sm sm:text-base">Cash on Delivery</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Pay AED {order.total.toLocaleString()} when you receive your order
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      <div>
                        <p className="font-medium text-sm sm:text-base">Credit/Debit Card</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Paid online - AED {order.total.toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
                <h2 className="font-serif text-lg sm:text-xl mb-4 sm:mb-6">Order Summary</h2>

                {/* Totals */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>AED {order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{order.shipping === 0 ? 'Free' : `AED ${order.shipping}`}</span>
                  </div>
                  {order.codFee > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">COD Fee</span>
                      <span>AED {order.codFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-serif text-base sm:text-lg pt-2 sm:pt-3 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">AED {order.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="bg-primary/5 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <p className="font-medium text-sm sm:text-base">Estimated Delivery</p>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {estimatedDelivery.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    3-5 business days
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/shop')}
                    className="w-full btn-luxury-primary h-11 sm:h-12 text-sm sm:text-base"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="w-full h-11 sm:h-12 text-sm sm:text-base"
                  >
                    Return to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
