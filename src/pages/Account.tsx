import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, LogOut, Package, User as UserIcon, ShoppingBag, ChevronRight, Eye, MapPin, CreditCard, Phone, Mail } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders, type Order } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSEO } from '@/hooks/useSEO';
import { cn } from '@/lib/utils';
import { OrderTimeline } from '@/components/order/OrderTimeline';

const statusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'default';
    case 'cancelled':
      return 'destructive';
    case 'pending':
      return 'secondary';
    default:
      return 'outline';
  }
};

const Account = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useSEO({
    title: 'My Account - Modest Way Fashion',
    description: 'View your orders, manage your profile, and account settings.',
  });

  // Redirect guests to /auth
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/account', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      setProfileLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, email')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
        setEmail(data.email || user.email || '');
      } else {
        setEmail(user.email || '');
      }
      setProfileLoading(false);
    };
    loadProfile();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
      })
      .eq('user_id', user.id);

    setSavingProfile(false);

    if (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Profile updated',
      description: 'Your details have been saved.',
    });
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
    toast({ title: 'Signed out', description: 'See you again soon.' });
    navigate('/');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Navbar />
        <div className="pt-16 md:pt-24 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const initials = (fullName || user.email || 'U')
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navbar />
      <CartDrawer />

      <main className="pt-16 md:pt-24">
        <div className="luxury-container py-6 sm:py-10">
          <Breadcrumbs items={[{ label: 'My Account' }]} className="mb-4" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif text-xl">
                {initials}
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-foreground">
                  {fullName || 'Welcome back'}
                </h1>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleSignOut}
              disabled={signingOut}
              className="self-start sm:self-auto"
            >
              {signingOut ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 mr-2" />
              )}
              Sign out
            </Button>
          </div>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
              <TabsTrigger value="orders" className="gap-2">
                <Package className="w-4 h-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <UserIcon className="w-4 h-4" />
                Profile
              </TabsTrigger>
            </TabsList>

            {/* ORDERS TAB */}
            <TabsContent value="orders" className="space-y-4">
              {ordersLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : !orders || orders.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-serif text-xl mb-2">No orders yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Your order history will appear here once you make your first purchase.
                    </p>
                    <Button asChild>
                      <Link to="/shop">Start shopping</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <CardTitle className="text-base font-medium">
                            #{order.order_number}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {new Date(order.created_at).toLocaleDateString('en-AE', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                            {' • '}
                            {order.items?.length || 0} item
                            {(order.items?.length || 0) !== 1 ? 's' : ''}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={statusVariant(order.status)} className="capitalize">
                            {order.status}
                          </Badge>
                          <span className="font-semibold text-foreground">
                            AED {Number(order.total).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Separator className="mb-3" />
                      <OrderTimeline status={order.status} compact className="mb-4" />
                      <div className="space-y-2">
                        {order.items?.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 text-sm"
                          >
                            {item.product_image && (
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="w-12 h-14 object-cover rounded-md bg-muted flex-shrink-0"
                                loading="lazy"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium">{item.product_name}</p>
                              <p className="text-xs text-muted-foreground">
                                Size {item.size} • Qty {item.quantity}
                              </p>
                            </div>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              AED {Number(item.price).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {(order.items?.length || 0) > 3 && (
                          <p className="text-xs text-muted-foreground pl-1">
                            +{(order.items?.length || 0) - 3} more item(s)
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-xs text-muted-foreground gap-3">
                        <span className="truncate">
                          Payment: <span className="capitalize text-foreground">{order.payment_method}</span>
                          <span className="hidden sm:inline"> • Ship to {order.emirate}</span>
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="h-8 px-2 gap-1 text-xs hover:text-primary -mr-2"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* PROFILE TAB */}
            <TabsContent value="profile">
              <Card className="max-w-2xl">
                <CardHeader>
                  <CardTitle className="font-serif">Profile details</CardTitle>
                  <CardDescription>
                    Update your personal information. Email cannot be changed.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        disabled={profileLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+971 XX XXX XXXX"
                        disabled={profileLoading}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="submit" disabled={savingProfile || profileLoading}>
                        {savingProfile && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Save changes
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate('/wishlist')}
                      >
                        View wishlist
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl w-[calc(100vw-1rem)] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-xl flex items-center justify-between gap-3 pr-8">
                  <span>Order #{selectedOrder.order_number}</span>
                  <Badge variant={statusVariant(selectedOrder.status)} className="capitalize text-xs">
                    {selectedOrder.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Placed on{' '}
                  {new Date(selectedOrder.created_at).toLocaleDateString('en-AE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {/* Status timeline */}
                <OrderTimeline status={selectedOrder.status} showHeader={false} />

                {/* Shipping + Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      <MapPin className="w-3.5 h-3.5" />
                      Shipping
                    </div>
                    <p className="text-sm font-medium">{selectedOrder.customer_name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedOrder.shipping_address}
                      <br />
                      {selectedOrder.city}, {selectedOrder.emirate}
                      {selectedOrder.postal_code && ` ${selectedOrder.postal_code}`}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      <UserIcon className="w-3.5 h-3.5" />
                      Contact
                    </div>
                    <p className="text-sm flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{selectedOrder.customer_email}</span>
                    </p>
                    <p className="text-sm flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      {selectedOrder.customer_phone}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Items ({selectedOrder.items?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-md bg-muted/40"
                      >
                        {item.product_image && (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-14 h-16 object-cover rounded bg-background flex-shrink-0"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Size {item.size} • Qty {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium whitespace-nowrap">
                          AED {Number(item.price).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="rounded-lg border border-border p-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>AED {Number(selectedOrder.subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>
                      {(selectedOrder.shipping_cost || 0) === 0
                        ? 'Free'
                        : `AED ${Number(selectedOrder.shipping_cost).toLocaleString()}`}
                    </span>
                  </div>
                  {(selectedOrder.cod_fee || 0) > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>COD Fee</span>
                      <span>AED {Number(selectedOrder.cod_fee).toLocaleString()}</span>
                    </div>
                  )}
                  <Separator className="my-1.5" />
                  <div className="flex justify-between font-serif text-base">
                    <span>Total</span>
                    <span className="text-primary">
                      AED {Number(selectedOrder.total).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Payment method */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  Payment:{' '}
                  <span className="capitalize text-foreground font-medium">
                    {selectedOrder.payment_method === 'cod'
                      ? 'Cash on Delivery'
                      : selectedOrder.payment_method}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Account;
