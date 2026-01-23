import React, { useState, useRef, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/useAdminAuth';
import { Lock, Eye, EyeOff, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const AdminAuth = () => {
  const { login } = useAdminAuth();
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePinChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto-focus next input
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

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-serif text-white mb-2">Admin Access</h1>
          <p className="text-white/70 text-sm">Modest Way Fashion</p>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-white flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Enter 6-Digit PIN
            </CardTitle>
            <CardDescription className="text-white/60">
              Enter your admin PIN to access the dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* PIN Input */}
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {pin.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type={showPin ? 'text' : 'password'}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-mono bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-primary focus:ring-primary/20"
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
                  className="text-white/60 hover:text-white hover:bg-white/10"
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
              <Alert className="border-red-500/20 bg-red-500/10 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={isLoading || pin.join('').length !== 6}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
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
                className="w-full border-white/20 text-white/60 hover:bg-white/10 hover:text-white"
              >
                Clear
              </Button>
            </div>

            {/* Security Notice */}
            <div className="text-center">
              <p className="text-xs text-white/40">
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
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <a href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </a>
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default AdminAuth;
