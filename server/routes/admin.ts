import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// Get all bookings for admin
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        unit: {
          select: { name: true }
        },
        customer: {
          select: { firstName: true, lastName: true, email: true, phone: true }
        }
      },
      orderBy: {
        checkIn: 'asc'
      }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get bookings by date range for calendar view
router.get('/bookings/calendar', async (req, res) => {
  try {
    const { start, end } = req.query;
    
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          {
            checkIn: {
              gte: new Date(start as string),
              lte: new Date(end as string)
            }
          },
          {
            checkOut: {
              gte: new Date(start as string),
              lte: new Date(end as string)
            }
          }
        ]
      },
      include: {
        unit: {
          select: { id: true, name: true }
        },
        customer: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching calendar bookings:', error);
    res.status(500).json({ error: 'Failed to fetch calendar bookings' });
  }
});

// Update booking status
router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        unit: {
          select: { name: true }
        },
        customer: {
          select: { firstName: true, lastName: true, email: true, phone: true }
        }
      }
    });

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

export default router;
