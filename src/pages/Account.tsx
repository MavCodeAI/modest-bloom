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

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
                        <span>
                          Payment: <span className="capitalize text-foreground">{order.payment_method}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          Ship to {order.emirate}
                          <ChevronRight className="w-3 h-3" />
                        </span>
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

      <Footer />
    </div>
  );
};

export default Account;
