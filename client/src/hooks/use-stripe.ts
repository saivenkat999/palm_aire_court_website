import { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useMutation, useQuery } from '@tanstack/react-query';

// Initialize Stripe promise outside component to avoid re-creation
let stripePromise: Promise<Stripe | null> | null = null;

// Fetch Stripe configuration from API
const fetchStripeConfig = async () => {
  const response = await fetch('/api/stripe-config');
  if (!response.ok) {
    throw new Error('Failed to fetch Stripe config');
  }
  return response.json();
};

// Create payment intent
const createPaymentIntent = async (data: {
  amount: number;
  bookingId?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}) => {
  const response = await fetch('/api/payment-intents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }

  return response.json();
};
// Update payment intent
const updatePaymentIntent = async (data: {
  paymentIntentId: string;
  amount?: number;
  metadata?: Record<string, string>;
}) => {
  const response = await fetch(`/api/payment-intents/${data.paymentIntentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: data.amount,
      metadata: data.metadata,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update payment intent');
  }

  return response.json();
};

// Get payment intent status
const getPaymentIntent = async (paymentIntentId: string) => {
  const response = await fetch(`/api/payment-intents/${paymentIntentId}`);
  
  if (!response.ok) {
    throw new Error('Failed to get payment intent');
  }

  return response.json();
};

// Main hook for Stripe operations
export function useStripe() {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Stripe config and initialize
  const { data: config } = useQuery({
    queryKey: ['stripe-config'],
    queryFn: fetchStripeConfig,
    staleTime: Infinity, // Config doesn't change
  });

  useEffect(() => {
    if (config?.publishableKey && !stripePromise) {
      stripePromise = loadStripe(config.publishableKey);
    }

    if (stripePromise) {
      stripePromise
        .then((stripeInstance) => {
          setStripe(stripeInstance);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [config]);

  // Mutation for creating payment intent
  const createPaymentIntentMutation = useMutation({
    mutationFn: createPaymentIntent,
  });

  // Mutation for updating payment intent
  const updatePaymentIntentMutation = useMutation({
    mutationFn: updatePaymentIntent,
  });

  return {
    stripe,
    isLoading,
    error,
    createPaymentIntent: createPaymentIntentMutation.mutateAsync,
    updatePaymentIntent: updatePaymentIntentMutation.mutateAsync,
    getPaymentIntent,
    isCreatingPayment: createPaymentIntentMutation.isPending,
    isUpdatingPayment: updatePaymentIntentMutation.isPending,
  };
}

// Hook for payment element
export function usePaymentElement(clientSecret: string | null) {
  const { stripe } = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const confirmPayment = async (options?: { return_url?: string }) => {
    if (!stripe || !clientSecret) {
      setPaymentError('Stripe not initialized or missing client secret');
      return { success: false, error: 'Not ready' };
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const result = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: options?.return_url || window.location.origin + '/booking/confirmation',
        },
      });

      if ('error' in result && result.error) {
        setPaymentError(result.error.message || 'Payment failed');
        return { success: false, error: result.error };
      }

      // result is never in this overload, but keep return type consistent
      return { success: true } as any;
    } catch (error: any) {
      setPaymentError(error.message || 'Payment processing failed');
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    confirmPayment,
    isProcessing,
    paymentError,
  };
}