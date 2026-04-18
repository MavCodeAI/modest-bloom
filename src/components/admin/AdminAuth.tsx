import React, { useState, useRef, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/useAdminAuth';
import { Lock, Eye, EyeOff, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminAuth = () => {
  const { login } = useAdminAuth();
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePinChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/\D/g, '').slice(0, 6);

    if (numbers.length === 6) {
      const newPin = numbers.split('');
      setPin(newPin);
      setError('');
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async () => {
    const pinString = pin.join('');

    if (pinString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(pinString);
      if (!success) {
        setError('Invalid PIN. Please try again.');
        setPin(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearPin = () => {
    setPin(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative brand blobs */}
      <div className="pointer-events-none absolute top-1/4 -left-16 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -right-16 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-serif text-foreground mb-1">Admin Access</h1>
          <p className="text-muted-foreground text-sm tracking-wide">Modest Way Fashion</p>
        </div>

        <Card className="border-border bg-card shadow-card">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-serif text-foreground flex items-center justify-center gap-2 text-xl">
              <Lock className="h-5 w-5 text-primary" />
              Enter 6-Digit PIN
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your admin PIN to access the dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* PIN Input */}
            <div className="space-y-4">
              <div className="flex justify-center gap-1.5 sm:gap-2">
                {pin.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-10 h-12 sm:w-12 sm:h-12 text-center text-lg font-mono bg-background border-input text-foreground focus-visible:ring-primary"
                    maxLength={1}
                    disabled={isLoading}
                  />
                ))}
              </div>

              {/* Show PIN Toggle */}
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPin(!showPin)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showPin ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide PIN
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show PIN
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={isLoading || pin.join('').length !== 6}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Access Admin Panel
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={clearPin}
                disabled={isLoading}
                className="w-full"
              >
                Clear
              </Button>
            </div>

            {/* Security Notice */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                For security reasons, your session will automatically expire after 30 minutes of inactivity.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Store */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <a href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
