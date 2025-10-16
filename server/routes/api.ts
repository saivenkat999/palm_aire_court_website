import { Router } from 'express';
import supabase from '../lib/supabase.js';
import { PricingEngine } from '../lib/pricing.js';
import StripeService from '../lib/stripe.js';
import { PhotoService } from '../lib/photo-service.js';
import { GHLIntegration } from '../lib/ghl-integration.js';
import { z } from 'zod';
import { addDays } from 'date-fns';

const router = Router();

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

router.get('/units', async (req, res) => {
  try {
    const { data: units, error } = await supabase
      .from('units')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    const { data: categoryRatePlans } = await supabase
      .from('rate_plans')
      .select('*')
      .is('unit_id', null);

    const categoryRateMap = new Map();
    (categoryRatePlans || []).forEach(ratePlan => {
      if (!categoryRateMap.has(ratePlan.category)) {
        categoryRateMap.set(ratePlan.category, []);
      }
      categoryRateMap.get(ratePlan.category).push(ratePlan);
    });

    const unitsWithDetails = await Promise.all(
      (units || []).map(async (unit) => {
        const { data: unitRatePlans } = await supabase
          .from('rate_plans')
          .select('*')
          .eq('unit_id', unit.id);

        const { count: bookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('unit_id', unit.id)
          .eq('status', 'CONFIRMED');

        const ratePlans = (unitRatePlans && unitRatePlans.length > 0)
          ? unitRatePlans
          : (categoryRateMap.get(unit.type) || []);

        return {
          ...unit,
          ratePlans,
          amenities: unit.amenities ? JSON.parse(unit.amenities) : [],
          features: unit.features ? JSON.parse(unit.features) : [],
          photos: PhotoService.getPhotosForUnit(unit.slug, unit.type),
          _count: {
            bookings: bookingsCount || 0
          }
        };
      })
    );

    res.json(unitsWithDetails);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ error: 'Failed to fetch units' });
  }
});

router.get('/units/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const { data: unit, error } = await supabase
      .from('units')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }

    const { data: unitRatePlans } = await supabase
      .from('rate_plans')
      .select('*')
      .eq('unit_id', unit.id);

    let ratePlans = unitRatePlans || [];

    if (ratePlans.length === 0) {
      const { data: categoryRatePlans } = await supabase
        .from('rate_plans')
        .select('*')
        .eq('category', unit.type)
        .is('unit_id', null);

      ratePlans = categoryRatePlans || [];
    }

    const unitWithParsedFields = {
      ...unit,
      ratePlans,
      amenities: unit.amenities ? JSON.parse(unit.amenities) : [],
      features: unit.features ? JSON.parse(unit.features) : [],
      photos: PhotoService.getPhotosForUnit(unit.slug, unit.type)
    };

    res.json(unitWithParsedFields);
  } catch (error) {
    console.error('Error fetching unit:', error);
    res.status(500).json({ error: 'Failed to fetch unit' });
  }
});

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

router.get('/pricing/type', async (req, res) => {
  try {
    const { unitType, checkIn, checkOut, guests } = unitTypePricingSchema.parse(req.query);

    const { data: availableUnits } = await supabase
      .from('units')
      .select('*')
      .eq('type', unitType)
      .eq('active', true);

    if (!availableUnits || availableUnits.length === 0) {
      return res.status(404).json({ error: 'No units of this type are available' });
    }

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

router.delete('/holds/:holdId', async (req, res) => {
  try {
    const { holdId } = req.params;
    await supabase.from('holds').delete().eq('id', holdId);
    res.status(204).send();
  } catch (error) {
    console.error('Error releasing hold:', error);
    res.status(500).json({ error: 'Failed to release hold' });
  }
});

router.post('/bookings', async (req, res) => {
  try {
    const bookingData = bookingCreateSchema.parse(req.body);
    let finalUnitId: string;

    if (bookingData.unitType && !bookingData.unitId) {
      const { data: availableUnits } = await supabase
        .from('units')
        .select('*')
        .eq('type', bookingData.unitType)
        .eq('active', true);

      if (!availableUnits || availableUnits.length === 0) {
        return res.status(400).json({ error: 'No units of this type are available' });
      }

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

    if (bookingData.holdId) {
      const { data: hold } = await supabase
        .from('holds')
        .select('*')
        .eq('id', bookingData.holdId)
        .maybeSingle();

      if (!hold) {
        return res.status(400).json({ error: 'Invalid hold ID' });
      }

      if (new Date(hold.expires_at) < new Date()) {
        return res.status(400).json({ error: 'Hold has expired' });
      }

      if (hold.unit_id !== finalUnitId ||
          new Date(hold.check_in).getTime() !== bookingData.checkIn.getTime() ||
          new Date(hold.check_out).getTime() !== bookingData.checkOut.getTime()) {
        return res.status(400).json({ error: 'Hold does not match booking data' });
      }
    }

    const availability = await PricingEngine.checkAvailability(
      finalUnitId,
      bookingData.checkIn,
      bookingData.checkOut
    );

    if (!availability.available) {
      return res.status(400).json({ error: 'Dates are no longer available' });
    }

    const pricing = await PricingEngine.calculatePricing(
      finalUnitId,
      bookingData.checkIn,
      bookingData.checkOut,
      bookingData.guests
    );

    let customer;
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('*')
      .eq('email', bookingData.guestEmail)
      .maybeSingle();

    if (existingCustomer) {
      customer = existingCustomer;
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          first_name: bookingData.guestName.split(' ')[0] || bookingData.guestName,
          last_name: bookingData.guestName.split(' ').slice(1).join(' ') || '',
          email: bookingData.guestEmail,
          phone: bookingData.guestPhone
        })
        .select()
        .single();

      if (customerError || !newCustomer) {
        throw new Error('Failed to create customer');
      }
      customer = newCustomer;
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        unit_id: finalUnitId,
        customer_id: customer.id,
        check_in: bookingData.checkIn.toISOString(),
        check_out: bookingData.checkOut.toISOString(),
        total_cents: pricing.total,
        notes: bookingData.specialRequests || null
      })
      .select()
      .single();

    if (bookingError || !booking) {
      throw new Error('Failed to create booking');
    }

    const { data: unit } = await supabase
      .from('units')
      .select('*')
      .eq('id', finalUnitId)
      .single();

    const bookingWithDetails = {
      ...booking,
      unit,
      customer
    };

    if (bookingData.holdId) {
      supabase.from('holds').delete().eq('id', bookingData.holdId).then().catch(console.error);
    }

    if (process.env.GHL_API_KEY) {
      try {
        console.log('🔄 Creating GHL contact and calendar event for booking:', booking.id);

        const ghl = new GHLIntegration(process.env.GHL_API_KEY);

        const ghlResult = await ghl.createBookingInGHL({
          guestName: bookingData.guestName,
          guestEmail: bookingData.guestEmail,
          guestPhone: bookingData.guestPhone,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          unitId: unit!.id,
          unitName: `${unit!.name} (${unit!.type})`,
          totalAmount: pricing.total,
          specialRequests: bookingData.specialRequests,
          bookingId: booking.id
        });

        console.log('✅ GHL Integration successful:', {
          contactCreated: !!ghlResult.contact,
          calendarEventCreated: !!ghlResult.event,
          bookingId: booking.id
        });

        (bookingWithDetails as any).ghlContactId = ghlResult.contact?.id || ghlResult.contact?.contactId;
        (bookingWithDetails as any).ghlEventId = ghlResult.event?.id || ghlResult.event?.appointmentId;

      } catch (ghlError) {
        console.error('⚠️ GHL Integration failed for booking:', booking.id, ghlError);
        (bookingWithDetails as any).ghlIntegrationError = 'Failed to sync with CRM - contact admin';
      }
    } else {
      console.log('⚠️ GHL API key not configured - skipping CRM integration');
    }

    res.status(201).json(bookingWithDetails);
  } catch (error) {
    console.error('Error creating booking:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid booking data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.get('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const { data: unit } = await supabase
      .from('units')
      .select('*')
      .eq('id', booking.unit_id)
      .single();

    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('booking_id', booking.id)
      .maybeSingle();

    res.json({
      ...booking,
      unit,
      payment
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !booking) {
      throw new Error('Failed to update booking');
    }

    const { data: unit } = await supabase
      .from('units')
      .select('*')
      .eq('id', booking.unit_id)
      .single();

    res.json({
      ...booking,
      unit
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

router.get('/seasons', async (req, res) => {
  try {
    const { data: seasons, error } = await supabase
      .from('seasons')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;
    res.json(seasons || []);
  } catch (error) {
    console.error('Error fetching seasons:', error);
    res.status(500).json({ error: 'Failed to fetch seasons' });
  }
});

router.get('/fees', async (req, res) => {
  try {
    const { data: fees, error } = await supabase
      .from('fees')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json(fees || []);
  } catch (error) {
    console.error('Error fetching fees:', error);
    res.status(500).json({ error: 'Failed to fetch fees' });
  }
});

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

router.get('/stripe-config', (req, res) => {
  res.json({
    publishableKey: StripeService.getPublishableKey()
  });
});

const contactCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  preferredDates: z.string().optional().nullable(),
  unitId: z.string().optional().nullable(),
  checkIn: z.string().optional().nullable(),
  checkOut: z.string().optional().nullable(),
  guests: z.string().optional().nullable(),
  bookingDetails: z.object({
    checkIn: z.string(),
    checkOut: z.string(),
    guests: z.string(),
  }).optional().nullable(),
  timestamp: z.string().optional(),
});

router.post('/contacts/gohighlevel', async (req, res) => {
  try {
    console.log('Received contact data:', req.body);
    const data = contactCreateSchema.parse(req.body);
    console.log('Parsed contact data:', data);

    const API_KEY = process.env.GHL_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'GoHighLevel API key not configured' });
    }

    const endpoints = [
      'https://rest.gohighlevel.com/v1/contacts/',
      'https://services.leadconnectorhq.com/contacts/',
      'https://api.gohighlevel.com/v1/contacts/'
    ];

    const contactData = {
      firstName: data.name.split(' ')[0],
      lastName: data.name.split(' ').slice(1).join(' ') || '',
      email: data.email,
      phone: data.phone,
      source: 'Website Contact Form',
      customFields: {
        preferred_dates: data.preferredDates || '',
        message: data.message,
        unit_inquiry: data.unitId || '',
        check_in: data.checkIn || '',
        check_out: data.checkOut || '',
        guests: data.guests || '',
        website_source: 'Palm Aire Court Contact Form'
      },
      customField: [
        {
          key: 'preferred_dates',
          field_value: data.preferredDates || ''
        },
        {
          key: 'message',
          field_value: data.message
        },
        {
          key: 'unit_inquiry',
          field_value: data.unitId || ''
        },
        {
          key: 'source',
          field_value: 'Website Contact Form'
        }
      ],
      notes: `Contact Form Submission:
Message: ${data.message}
Preferred Dates: ${data.preferredDates || 'Not specified'}
Unit Interest: ${data.unitId || 'General inquiry'}
Source: Website Contact Form
Timestamp: ${data.timestamp}`
    };

    let lastError = null;
    let successResult = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactData),
        });

        if (response.ok) {
          successResult = await response.json();
          console.log(`Contact created successfully in GoHighLevel via ${endpoint}:`, successResult);
          break;
        } else {
          const errorText = await response.text();
          console.log(`Failed with endpoint ${endpoint}:`, response.status, errorText);
          lastError = { endpoint, status: response.status, error: errorText };
        }
      } catch (error) {
        console.log(`Error with endpoint ${endpoint}:`, error);
        lastError = {
          endpoint,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }

    if (successResult) {
      res.json({
        success: true,
        data: successResult,
        message: 'Contact created successfully in GoHighLevel'
      });
    } else {
      console.error('All GoHighLevel endpoints failed:', lastError);
      res.status(500).json({
        success: false,
        error: 'Failed to create contact in GoHighLevel',
        details: lastError
      });
    }

  } catch (error) {
    console.error('Error in GoHighLevel contact creation:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid contact data',
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to process contact creation'
    });
  }
});

export default router;
