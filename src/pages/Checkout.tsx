import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, Truck, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const checkoutSchema = z.object({
  email: z.string().email('Valid email required'),
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  phone: z.string().min(8, 'Valid phone number required'),
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
  country: z.string().min(2, 'Country required'),
  postalCode: z.string().optional(),
  paymentMethod: z.enum(['cod', 'card'], {
    required_error: 'Please select a payment method',
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, cartTotal, dispatch } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cod' | 'card'>('cod');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center luxury-container px-4">
          <h1 className="font-serif text-xl sm:text-2xl mb-4">Your bag is empty</h1>
          <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order
    const order = {
      id: `ORD-${Date.now()}`,
      items: cart,
      customer: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
      },
      total: cartTotal + shipping + codFee,
      subtotal: cartTotal,
      shipping,
      codFee,
      paymentMethod: data.paymentMethod,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_ORDER', payload: order });
    dispatch({ type: 'CLEAR_CART' });

    toast({
      title: 'Order Confirmed!',
      description: `Your order ${order.id} has been placed successfully.`,
    });

    navigate('/order-confirmation', { state: { order } });
    setIsProcessing(false);
  };

  const shipping = cartTotal >= 500 ? 0 : 50;
  const codFee = selectedPaymentMethod === 'cod' ? 20 : 0;
  const total = cartTotal + shipping + codFee;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 md:pt-24">
        <div className="luxury-container py-6 sm:py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </button>

          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-8 sm:mb-12">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                {/* Contact */}
                <div className="space-y-4">
                  <h2 className="font-serif text-lg sm:text-xl">Contact Information</h2>
                  <div>
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="mt-1 h-11 sm:h-12"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-destructive text-xs sm:text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="mt-1 h-11 sm:h-12"
                      placeholder="+971 XX XXX XXXX"
                    />
                    {errors.phone && (
                      <p className="text-destructive text-xs sm:text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Shipping */}
                <div className="space-y-4">
                  <h2 className="font-serif text-lg sm:text-xl">Shipping Address</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm">First Name</Label>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        className="mt-1 h-11 sm:h-12"
                      />
                      {errors.firstName && (
                        <p className="text-destructive text-xs sm:text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        className="mt-1 h-11 sm:h-12"
                      />
                      {errors.lastName && (
                        <p className="text-destructive text-xs sm:text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-sm">Address</Label>
                    <Input
                      id="address"
                      {...register('address')}
                      className="mt-1 h-11 sm:h-12"
                      placeholder="Street address"
                    />
                    {errors.address && (
                      <p className="text-destructive text-xs sm:text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm">City</Label>
                      <Input
                        id="city"
                        {...register('city')}
                        className="mt-1 h-11 sm:h-12"
                      />
                      {errors.city && (
                        <p className="text-destructive text-xs sm:text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="text-sm">Postal Code</Label>
                      <Input
                        id="postalCode"
                        {...register('postalCode')}
                        className="mt-1 h-11 sm:h-12"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-sm">Country</Label>
                    <Input
                      id="country"
                      {...register('country')}
                      className="mt-1 h-11 sm:h-12"
                      placeholder="United Arab Emirates"
                    />
                    {errors.country && (
                      <p className="text-destructive text-xs sm:text-sm mt-1">{errors.country.message}</p>
                    )}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                  <h2 className="font-serif text-lg sm:text-xl">Payment Method</h2>
                  <div className="space-y-3">
                    {/* COD Option */}
                    <div className="relative">
                      <input
                        type="radio"
                        id="cod"
                        value="cod"
                        {...register('paymentMethod')}
                        checked={selectedPaymentMethod === 'cod'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value as 'cod' | 'card')}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor="cod"
                        className="flex items-center gap-3 p-4 sm:p-6 bg-card rounded-lg border-2 border-border cursor-pointer transition-all hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5"
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-border peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white hidden peer-checked:block"></div>
                        </div>
                        <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm sm:text-base">Cash on Delivery</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Pay when you receive your order</p>
                          <p className="text-xs sm:text-sm text-primary font-medium mt-1">+ AED 20 COD fee</p>
                        </div>
                      </label>
                    </div>

                    {/* Card Option */}
                    <div className="relative">
                      <input
                        type="radio"
                        id="card"
                        value="card"
                        {...register('paymentMethod')}
                        checked={selectedPaymentMethod === 'card'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value as 'cod' | 'card')}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor="card"
                        className="flex items-center gap-3 p-4 sm:p-6 bg-card rounded-lg border-2 border-border cursor-pointer transition-all hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5"
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-border peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white hidden peer-checked:block"></div>
                        </div>
                        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm sm:text-base">Credit/Debit Card</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Secure online payment</p>
                          <p className="text-xs sm:text-sm text-green-600 font-medium mt-1">No additional fees</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-destructive text-xs sm:text-sm mt-1">{errors.paymentMethod.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full btn-luxury-primary h-12 sm:h-14 text-sm sm:text-base"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Place Order — AED {total.toLocaleString()}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="order-1 lg:order-2">
              <div className="bg-card rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
                <h2 className="font-serif text-lg sm:text-xl mb-4 sm:mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-[40vh] lg:max-h-none overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="flex gap-3 sm:gap-4"
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

                {/* Totals */}
                <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-t border-border">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>AED {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `AED ${shipping}`}</span>
                  </div>
                  {codFee > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">COD Fee</span>
                      <span>AED {codFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-serif text-base sm:text-lg pt-2 sm:pt-3 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">AED {total.toLocaleString()}</span>
                  </div>
                </div>

                {shipping === 0 && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-3 sm:mt-4 text-center">
                    ✓ You qualify for free shipping
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
