import { Router, raw } from 'express';
import prisma from '../lib/prisma.js';
import { PricingEngine } from '../lib/pricing.js';
import StripeService from '../lib/stripe.js';
import { z } from 'zod';
import { addDays } from 'date-fns';

const router = Router();

// Validation schemas
const dateSchema = z.string().transform((str) => new Date(str));
const pricingQuerySchema = z.object({
  unitId: z.string().min(1),
  checkIn: dateSchema,
  checkOut: dateSchema,
  guests: z.coerce.number().min(1).optional().default(1)
});

const unitTypePricingSchema = z.object({
  unitType: z.enum(['TRAILER', 'COTTAGE_1BR', 'COTTAGE_2BR', 'RV_SITE']),
  checkIn: dateSchema,
  checkOut: dateSchema,
  guests: z.coerce.number().min(1).optional().default(1)
});

const availabilityQuerySchema = z.object({
  unitId: z.string().min(1),
  checkIn: dateSchema,
  checkOut: dateSchema
});

const holdCreateSchema = z.object({
  unitId: z.string().min(1),
  checkIn: dateSchema,
  checkOut: dateSchema,
  expirationMinutes: z.number().min(5).max(60).optional().default(15)
});

const bookingCreateSchema = z.object({
  holdId: z.string().min(1).optional(),
  unitId: z.string().min(1).optional(),
  unitType: z.enum(['TRAILER', 'COTTAGE_1BR', 'COTTAGE_2BR', 'RV_SITE']).optional(),
  checkIn: dateSchema,
  checkOut: dateSchema,
  guests: z.number().min(1),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(10),
  specialRequests: z.string().optional(),
  stripePaymentIntentId: z.string().optional()
}).refine(data => data.unitId || data.unitType, {
  message: "Either unitId or unitType must be provided"
});

// GET /api/units - Get all units
router.get('/units', async (req, res) => {
  try {
    const units = await prisma.unit.findMany({
      include: {
        ratePlans: true,
        _count: {
          select: {
            bookings: {
              where: {
                status: 'CONFIRMED'
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // For units without specific rate plans, add category-wide rate plans
    const unitsWithRates = await Promise.all(units.map(async (unit) => {
      if (unit.ratePlans.length === 0) {
        // Look for category-wide rate plans
        const categoryRatePlans = await prisma.ratePlan.findMany({
          where: {
            category: unit.type,
            unitId: null
          }
        });
        return {
          ...unit,
          ratePlans: categoryRatePlans
        };
      }
      return unit;
    }));

    res.json(unitsWithRates);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ error: 'Failed to fetch units' });
  }
});

// GET /api/units/:slug - Get unit by slug
router.get('/units/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const unit = await prisma.unit.findUnique({
      where: { slug },
      include: {
        ratePlans: true
      }
    });

    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }

    // If no specific rate plans, add category-wide rate plans
    if (unit.ratePlans.length === 0) {
      const categoryRatePlans = await prisma.ratePlan.findMany({
        where: {
          category: unit.type,
          unitId: null
        }
      });
      unit.ratePlans = categoryRatePlans;
    }

    res.json(unit);
  } catch (error) {
    console.error('Error fetching unit:', error);
    res.status(500).json({ error: 'Failed to fetch unit' });
  }
});

// GET /api/pricing - Calculate pricing for a booking
router.get('/pricing', async (req, res) => {
  try {
    const { unitId, checkIn, checkOut, guests } = pricingQuerySchema.parse(req.query);

    const pricing = await PricingEngine.calculatePricing(unitId, checkIn, checkOut, guests);
    
    res.json(pricing);
  } catch (error) {
    console.error('Error calculating pricing:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
    }
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to calculate pricing' });
  }
});

// GET /api/pricing/type - Calculate pricing for any available unit of a specific type
router.get('/pricing/type', async (req, res) => {
  try {
    const { unitType, checkIn, checkOut, guests } = unitTypePricingSchema.parse(req.query);

    // Find any available unit of the requested type
    const availableUnits = await prisma.unit.findMany({
      where: {
        type: unitType,
        active: true
      }
    });

    if (availableUnits.length === 0) {
      return res.status(404).json({ error: 'No units of this type are available' });
    }

    // Check availability and get pricing for the first available unit
    let pricing = null;
    for (const unit of availableUnits) {
      const availability = await PricingEngine.checkAvailability(unit.id, checkIn, checkOut);
      
      if (availability.available) {
        pricing = await PricingEngine.calculatePricing(unit.id, checkIn, checkOut, guests);
        break;
      }
    }

    if (!pricing) {
      return res.status(400).json({ error: 'No units of this type are available for the selected dates' });
    }

    res.json(pricing);
  } catch (error) {
    console.error('Error calculating pricing for unit type:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
    }
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to calculate pricing' });
  }
});

// GET /api/availability - Check availability for a date range
router.get('/availability', async (req, res) => {
  try {
    const { unitId, checkIn, checkOut } = availabilityQuerySchema.parse(req.query);

    const availability = await PricingEngine.checkAvailability(unitId, checkIn, checkOut);
    
    res.json(availability);
  } catch (error) {
    console.error('Error checking availability:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// GET /api/units/:unitId/availability-calendar - Get available date ranges for calendar
router.get('/units/:unitId/availability-calendar', async (req, res) => {
  try {
    const { unitId } = req.params;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date();
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : addDays(new Date(), 365);

    const availableRanges = await PricingEngine.getAvailableDateRanges(unitId, startDate, endDate);
    
    res.json({ availableRanges });
  } catch (error) {
    console.error('Error fetching availability calendar:', error);
    res.status(500).json({ error: 'Failed to fetch availability calendar' });
  }
});

// POST /api/holds - Create a temporary booking hold
router.post('/holds', async (req, res) => {
  try {
    const { unitId, checkIn, checkOut, expirationMinutes } = holdCreateSchema.parse(req.body);

    const holdId = await PricingEngine.createHold(unitId, checkIn, checkOut, expirationMinutes);
    
    res.status(201).json({ holdId, expiresIn: expirationMinutes });
  } catch (error) {
    console.error('Error creating hold:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create hold' });
  }
});

// DELETE /api/holds/:holdId - Release a booking hold
router.delete('/holds/:holdId', async (req, res) => {
  try {
    const { holdId } = req.params;

    await prisma.hold.delete({
      where: { id: holdId }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error releasing hold:', error);
    res.status(500).json({ error: 'Failed to release hold' });
  }
});

// POST /api/bookings - Create a new booking
router.post('/bookings', async (req, res) => {
  try {
    const bookingData = bookingCreateSchema.parse(req.body);
    let finalUnitId: string;

    // If unitType is provided instead of unitId, find an available unit of that type
    if (bookingData.unitType && !bookingData.unitId) {
      const availableUnits = await prisma.unit.findMany({
        where: {
          type: bookingData.unitType,
          active: true
        }
      });

      if (availableUnits.length === 0) {
        return res.status(400).json({ error: 'No units of this type are available' });
      }

      // Check availability for each unit of the requested type
      let foundAvailableUnit = null;
      for (const unit of availableUnits) {
        const availability = await PricingEngine.checkAvailability(
          unit.id,
          bookingData.checkIn,
          bookingData.checkOut
        );

        if (availability.available) {
          foundAvailableUnit = unit;
          break;
        }
      }

      if (!foundAvailableUnit) {
        return res.status(400).json({ error: 'No units of this type are available for the selected dates' });
      }

      finalUnitId = foundAvailableUnit.id;
    } else if (bookingData.unitId) {
      finalUnitId = bookingData.unitId;
    } else {
      return res.status(400).json({ error: 'Either unitId or unitType must be provided' });
    }

    // If holdId is provided, verify it exists and release it
    if (bookingData.holdId) {
      const hold = await prisma.hold.findUnique({
        where: { id: bookingData.holdId }
      });

      if (!hold) {
        return res.status(400).json({ error: 'Invalid hold ID' });
      }

      if (hold.expiresAt < new Date()) {
        return res.status(400).json({ error: 'Hold has expired' });
      }

      // Verify hold matches booking data
      if (hold.unitId !== finalUnitId || 
          hold.checkIn.getTime() !== bookingData.checkIn.getTime() ||
          hold.checkOut.getTime() !== bookingData.checkOut.getTime()) {
        return res.status(400).json({ error: 'Hold does not match booking data' });
      }
    }

    // Double-check availability for the final unit
    const availability = await PricingEngine.checkAvailability(
      finalUnitId, 
      bookingData.checkIn, 
      bookingData.checkOut
    );

    if (!availability.available) {
      return res.status(400).json({ error: 'Dates are no longer available' });
    }

    // Calculate final pricing
    const pricing = await PricingEngine.calculatePricing(
      finalUnitId,
      bookingData.checkIn,
      bookingData.checkOut,
      bookingData.guests
    );

    // Create or find the customer
    let customer = await prisma.customer.findUnique({
      where: { email: bookingData.guestEmail }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          firstName: bookingData.guestName.split(' ')[0] || bookingData.guestName,
          lastName: bookingData.guestName.split(' ').slice(1).join(' ') || '',
          email: bookingData.guestEmail,
          phone: bookingData.guestPhone
        }
      });
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        unitId: finalUnitId,
        customerId: customer.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        totalCents: pricing.total,
        notes: bookingData.specialRequests
      },
      include: {
        unit: true,
        customer: true
      }
    });

    // Release the hold if it was used
    if (bookingData.holdId) {
      await prisma.hold.delete({
        where: { id: bookingData.holdId }
      }).catch(console.error); // Don't fail booking if hold deletion fails
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid booking data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// GET /api/bookings/:id - Get booking by ID
router.get('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        unit: true,
        payment: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// PATCH /api/bookings/:id/status - Update booking status
router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date()
      },
      include: {
        unit: true
      }
    });

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// GET /api/seasons - Get all seasons/discounts
router.get('/seasons', async (req, res) => {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: { startDate: 'asc' }
    });

    res.json(seasons);
  } catch (error) {
    console.error('Error fetching seasons:', error);
    res.status(500).json({ error: 'Failed to fetch seasons' });
  }
});

// GET /api/fees - Get all fees
router.get('/fees', async (req, res) => {
  try {
    const fees = await prisma.fee.findMany({
      orderBy: { name: 'asc' }
    });

    res.json(fees);
  } catch (error) {
    console.error('Error fetching fees:', error);
    res.status(500).json({ error: 'Failed to fetch fees' });
  }
});

// ============= STRIPE PAYMENT ENDPOINTS =============

// POST /api/payment-intents - Create a payment intent
router.post('/payment-intents', async (req, res) => {
  try {
    const { amount, bookingId, customerEmail, metadata } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await StripeService.createPaymentIntent({
      amount,
      currency: 'usd',
      bookingId,
      customerEmail,
      metadata
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});
// PUT /api/payment-intents/:id - Update a payment intent
router.put('/payment-intents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, metadata } = req.body;

    const paymentIntent = await StripeService.updatePaymentIntent({
      paymentIntentId: id,
      amount,
      metadata
    });

    res.json({
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status
    });
  } catch (error) {
    console.error('Error updating payment intent:', error);
    res.status(500).json({ error: 'Failed to update payment intent' });
  }
});

// GET /api/payment-intents/:id - Get payment intent status
router.get('/payment-intents/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const paymentIntent = await StripeService.getPaymentIntent(id);

    res.json({
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata
    });
  } catch (error) {
    console.error('Error fetching payment intent:', error);
    res.status(500).json({ error: 'Failed to fetch payment intent' });
  }
});

// POST /api/payment-intents/:id/cancel - Cancel a payment intent
router.post('/payment-intents/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;

    const paymentIntent = await StripeService.cancelPaymentIntent(id);

    res.json({
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status
    });
  } catch (error) {
    console.error('Error canceling payment intent:', error);
    res.status(500).json({ error: 'Failed to cancel payment intent' });
  }
});

// GET /api/stripe-config - Get Stripe publishable key
router.get('/stripe-config', (req, res) => {
  res.json({
    publishableKey: StripeService.getPublishableKey()
  });
});

// POST /api/stripe-webhook - Handle Stripe webhooks
router.post('/stripe-webhook', raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    
    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe signature' });
    }

    const result = await StripeService.handleWebhook(req.body, signature);
    
    res.json(result);
  } catch (error: any) {
    console.error('Webhook error:', error);
    
    // Return 200 to acknowledge receipt even if processing failed
    // to prevent Stripe from retrying
    res.status(200).json({ 
      success: false, 
      error: error.message || 'Webhook processing failed' 
    });
  }
});

export default router;