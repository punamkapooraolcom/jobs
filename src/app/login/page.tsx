
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Phone, KeyRound } from 'lucide-react';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    authService.setupRecaptcha('recaptcha-container');
  }, []);

  useEffect(() => {
    if (step === 'otp') {
      otpInputRef.current?.focus();
    }
  }, [step]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith('+91')) {
      setPhoneNumber(value);
    } else if (value === '+' || value === '') {
      setPhoneNumber('+91');
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length > 3) {
      setIsLoading(true);
      const confirmationResult = await authService.sendOtp(phoneNumber);
      setIsLoading(false);
      if (confirmationResult) {
        setStep('otp');
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to send code',
          description: 'Please check the phone number and try again.',
        });
      }
    }
  };

  const verifyAndProceed = async (code: string) => {
    setIsLoading(true);
    const token = await authService.verifyOtp(code);
    setIsLoading(false);
    if (token) {
      // On successful login, redirect to the root page.
      // The root page will handle redirecting to either onboarding or matches.
      router.push('/');
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Code',
        description: 'The code you entered is incorrect. Please try again.',
      });
      // Clear the input on failure
      setOtp('');
    }
  };

  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      await verifyAndProceed(otp);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOtp = e.target.value;
    setOtp(newOtp);
    if (newOtp.length === 6) {
      verifyAndProceed(newOtp);
    }
  };
  
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div id="recaptcha-container"></div>
      <Card className="w-full max-w-sm">
        {step === 'phone' ? (
          <form onSubmit={handleSendCode}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="Mobile Number" 
                    required 
                    className="pl-10"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Code'}
              </Button>
            </CardFooter>
          </form>
        ) : (
           <form onSubmit={handleVerifyCodeSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                 <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    ref={otpInputRef}
                    id="otp" 
                    type="text" 
                    inputMode="numeric" 
                    placeholder="Verification Code" 
                    required 
                    className="pl-10"
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={isLoading}
                    maxLength={6}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="link" size="sm" onClick={() => { setStep('phone'); setPhoneNumber('+91'); }} disabled={isLoading}>
                Use a different number
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
