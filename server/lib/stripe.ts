import Stripe from 'stripe';
import prisma from './prisma.js';

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
      const payment = await prisma.payment.upsert({
        where: { stripeIntentId: paymentIntentId },
        update: {
          status,
          amountCents: amount,
          updatedAt: new Date()
        },
        create: {
          bookingId,
          stripeIntentId: paymentIntentId,
          amountCents: amount,
          status,
          provider: 'stripe',
          currency: 'USD'
        }
      });

      return payment;
    } catch (error) {
      console.error('Error creating payment record:', error);
      throw new Error('Failed to create payment record');
    }
  }

  /**
   * Handle webhook events from Stripe
   */
  static async handleWebhook(
    rawBody: string | Buffer,
    signature: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
      
      // Verify the webhook signature
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );

      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          const succeededIntent = event.data.object as Stripe.PaymentIntent;
          await this.handlePaymentSuccess(succeededIntent);
          break;

        case 'payment_intent.payment_failed':
          const failedIntent = event.data.object as Stripe.PaymentIntent;
          await this.handlePaymentFailure(failedIntent);
          break;

        case 'payment_intent.canceled':
          const canceledIntent = event.data.object as Stripe.PaymentIntent;
          await this.handlePaymentCancellation(canceledIntent);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { success: true, message: `Handled ${event.type}` };
    } catch (error) {
      console.error('Webhook error:', error);
      throw error;
    }
  }

  /**
   * Handle successful payment
   */
  private static async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId;
    
    if (!bookingId) {
      console.error('No booking ID in payment intent metadata');
      return;
    }

    // Update payment record
    await this.createPaymentRecord(
      bookingId,
      paymentIntent.id,
      paymentIntent.amount,
      'succeeded'
    );

    // Update booking status to confirmed
    await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: 'CONFIRMED',
        updatedAt: new Date()
      }
    });

    console.log(`Payment succeeded for booking ${bookingId}`);
  }

  /**
   * Handle failed payment
   */
  private static async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId;
    
    if (!bookingId) {
      console.error('No booking ID in payment intent metadata');
      return;
    }

    // Update payment record
    await this.createPaymentRecord(
      bookingId,
      paymentIntent.id,
      paymentIntent.amount,
      'failed'
    );

    console.log(`Payment failed for booking ${bookingId}`);
  }

  /**
   * Handle payment cancellation
   */
  private static async handlePaymentCancellation(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId;
    
    if (!bookingId) {
      console.error('No booking ID in payment intent metadata');
      return;
    }

    // Update payment record
    await this.createPaymentRecord(
      bookingId,
      paymentIntent.id,
      paymentIntent.amount,
      'canceled'
    );

    console.log(`Payment canceled for booking ${bookingId}`);
  }

  /**
   * Get Stripe publishable key for frontend
   */
  static getPublishableKey(): string {
    return process.env.STRIPE_PUBLISHABLE_KEY || '';
  }
}

export default StripeService;