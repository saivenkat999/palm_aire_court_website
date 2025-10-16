import Stripe from 'stripe';
import supabase from './supabase.js';

// Initialize Stripe with the secret key (use library default API version)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  typescript: true,
});

export interface CreatePaymentIntentData {
  amount: number; // Amount in cents
  currency?: string;
  bookingId?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export interface UpdatePaymentIntentData {
  paymentIntentId: string;
  amount?: number;
  metadata?: Record<string, string>;
}

export class StripeService {
  /**
   * Create a payment intent for a booking
   */
  static async createPaymentIntent({
    amount,
    currency = 'usd',
    bookingId,
    customerEmail,
    metadata = {}
  }: CreatePaymentIntentData): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          ...metadata,
          bookingId: bookingId || '',
          customerEmail: customerEmail || '',
        },
        receipt_email: customerEmail,
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Update an existing payment intent
   */
  static async updatePaymentIntent({
    paymentIntentId,
    amount,
    metadata
  }: UpdatePaymentIntentData): Promise<Stripe.PaymentIntent> {
    try {
      const updates: Stripe.PaymentIntentUpdateParams = {};
      
      if (amount !== undefined) {
        updates.amount = amount;
      }
      
      if (metadata) {
        updates.metadata = metadata;
      }

      const paymentIntent = await stripe.paymentIntents.update(
        paymentIntentId,
        updates
      );

      return paymentIntent;
    } catch (error) {
      console.error('Error updating payment intent:', error);
      throw new Error('Failed to update payment intent');
    }
  }

  /**
   * Retrieve a payment intent
   */
  static async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      throw new Error('Failed to retrieve payment intent');
    }
  }

  /**
   * Confirm a payment intent (for server-side confirmation)
   */
  static async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId?: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      const confirmParams: Stripe.PaymentIntentConfirmParams = {};
      
      if (paymentMethodId) {
        confirmParams.payment_method = paymentMethodId;
      }

      const paymentIntent = await stripe.paymentIntents.confirm(
        paymentIntentId,
        confirmParams
      );

      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment intent:', error);
      throw new Error('Failed to confirm payment intent');
    }
  }
  /**
   * Cancel a payment intent
   */
  static async cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Error canceling payment intent:', error);
      throw new Error('Failed to cancel payment intent');
    }
  }

  /**
   * Create or update payment record in database
   */
  static async createPaymentRecord(
    bookingId: string,
    paymentIntentId: string,
    amount: number,
    status: string
  ) {
    try {
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('*')
        .eq('stripe_intent_id', paymentIntentId)
        .maybeSingle();

      if (existingPayment) {
        const { data: payment, error } = await supabase
          .from('payments')
          .update({
            status,
            amount_cents: amount,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_intent_id', paymentIntentId)
          .select()
          .single();

        if (error) throw error;
        return payment;
      } else {
        const { data: payment, error } = await supabase
          .from('payments')
          .insert({
            booking_id: bookingId,
            stripe_intent_id: paymentIntentId,
            amount_cents: amount,
            status,
            provider: 'stripe',
            currency: 'USD'
          })
          .select()
          .single();

        if (error) throw error;
        return payment;
      }
    } catch (error) {
      console.error('Error creating payment record:', error);
      throw new Error('Failed to create payment record');
    }
  }

  /**
   * Get Stripe publishable key for frontend
   */
  static getPublishableKey(): string {
    return process.env.STRIPE_PUBLISHABLE_KEY || '';
  }
}

export default StripeService;