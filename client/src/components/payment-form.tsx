import React, { useState, useEffect } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

// Payment form component that must be wrapped in Elements provider
function PaymentFormInner({ clientSecret, amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmation`,
        },
        redirect: 'if_required',
      });

      if (result.error) {
        setErrorMessage(result.error.message || 'Payment failed');
        onError(result.error.message || 'Payment failed');
      } else {
        // Payment succeeded
        onSuccess(result.paymentIntent);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred');
      onError(error.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-primary">
                {formatAmount(amount)}
              </span>
            </div>
          </div>

          <PaymentElement 
            options={{
              layout: 'tabs',
              defaultValues: {
                billingDetails: {
                  address: {
                    country: 'US',
                  },
                },
              },
            }}
          />

          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <Button
            type="submit"
            disabled={!stripe || !elements || isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay {formatAmount(amount)}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

// Main payment form component with Elements provider
interface PaymentFormWrapperProps {
  clientSecret: string;
  amount: number;
  publishableKey: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

export default function PaymentForm({ 
  clientSecret, 
  amount, 
  publishableKey,
  onSuccess, 
  onError 
}: PaymentFormWrapperProps) {
  const [stripePromise] = useState(() => loadStripe(publishableKey));

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#E07A5F',
      colorBackground: '#ffffff',
      colorText: '#1F2937',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormInner 
        clientSecret={clientSecret}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}