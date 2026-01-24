import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Loader2, Mail, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const signInSchema = z.object({
  email: z.string().email('براہ کرم درست ای میل درج کریں'),
  password: z.string().min(6, 'پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے'),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, 'نام کم از کم 2 حروف کا ہونا چاہیے'),
  email: z.string().email('براہ کرم درست ای میل درج کریں'),
  password: z.string().min(6, 'پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'پاس ورڈ میچ نہیں کر رہے',
  path: ['confirmPassword'],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const handleSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);

    const { error } = await signIn(data.email, data.password);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('ای میل یا پاس ورڈ غلط ہے');
      } else {
        setError(error.message);
      }
    }
    setIsLoading(false);
  };

  const handleSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { error } = await signUp(data.email, data.password, data.fullName);

    if (error) {
      if (error.message.includes('already registered')) {
        setError('یہ ای میل پہلے سے رجسٹرڈ ہے');
      } else {
        setError(error.message);
      }
    } else {
      setSuccessMessage('اکاؤنٹ بن گیا! آپ اب لاگ ان کر سکتے ہیں۔');
      signUpForm.reset();
    }
    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="luxury-container section-padding">
        <div className="max-w-md mx-auto">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            واپس ہوم پیج پر
          </Link>

          <Card className="border-border/50 shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="font-serif text-2xl">Modest Way Fashion</CardTitle>
              <CardDescription>اپنے اکاؤنٹ میں لاگ ان کریں</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">لاگ ان</TabsTrigger>
                  <TabsTrigger value="signup">نیا اکاؤنٹ</TabsTrigger>
                </TabsList>

                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {successMessage && (
                  <Alert className="mb-4 border-green-500 bg-green-50 text-green-700">
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}

                <TabsContent value="signin">
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">ای میل</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10"
                          {...signInForm.register('email')}
                        />
                      </div>
                      {signInForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{signInForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password">پاس ورڈ</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          {...signInForm.register('password')}
                        />
                      </div>
                      {signInForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{signInForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full btn-luxury-primary" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      لاگ ان کریں
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">پورا نام</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="آپ کا نام"
                          className="pl-10"
                          {...signUpForm.register('fullName')}
                        />
                      </div>
                      {signUpForm.formState.errors.fullName && (
                        <p className="text-sm text-destructive">{signUpForm.formState.errors.fullName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">ای میل</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10"
                          {...signUpForm.register('email')}
                        />
                      </div>
                      {signUpForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">پاس ورڈ</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="کم از کم 6 حروف"
                          className="pl-10"
                          {...signUpForm.register('password')}
                        />
                      </div>
                      {signUpForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">پاس ورڈ دوبارہ</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-confirm"
                          type="password"
                          placeholder="پاس ورڈ دوبارہ لکھیں"
                          className="pl-10"
                          {...signUpForm.register('confirmPassword')}
                        />
                      </div>
                      {signUpForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive">{signUpForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full btn-luxury-primary" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      اکاؤنٹ بنائیں
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
