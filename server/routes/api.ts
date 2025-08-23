import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PricingEngine } from '../lib/pricing.js';
import { z } from 'zod';
import { addDays } from 'date-fns';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const dateSchema = z.string().transform((str) => new Date(str));
const pricingQuerySchema = z.object({
  unitId: z.string().min(1),
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
  unitId: z.string().min(1),
  checkIn: dateSchema,
  checkOut: dateSchema,
  guests: z.number().min(1),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(10),
  specialRequests: z.string().optional(),
  stripePaymentIntentId: z.string().optional()
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

    res.json(units);
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
      if (hold.unitId !== bookingData.unitId || 
          hold.checkIn.getTime() !== bookingData.checkIn.getTime() ||
          hold.checkOut.getTime() !== bookingData.checkOut.getTime()) {
        return res.status(400).json({ error: 'Hold does not match booking data' });
      }
    }

    // Double-check availability
    const availability = await PricingEngine.checkAvailability(
      bookingData.unitId, 
      bookingData.checkIn, 
      bookingData.checkOut
    );

    if (!availability.available) {
      return res.status(400).json({ error: 'Dates are no longer available' });
    }

    // Calculate final pricing
    const pricing = await PricingEngine.calculatePricing(
      bookingData.unitId,
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
        unitId: bookingData.unitId,
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

export default router;