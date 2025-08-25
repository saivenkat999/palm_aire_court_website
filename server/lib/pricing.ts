import { Unit, RatePlan, Season, Fee, UnitType } from '@prisma/client';
import prisma from './prisma.js';
import { addDays, differenceInCalendarDays, isWithinInterval, format } from 'date-fns';


export interface PricingBreakdown {
  subtotal: number;
  seasonalDiscount: number;
  fees: Array<{ name: string; amount: number; }>;
  total: number;
  pricePerNight: number;
  totalNights: number;
  discountPercentage: number;
}

export interface AvailabilityResult {
  available: boolean;
  conflictingBookings?: string[];
  conflictingHolds?: string[];
}

export class PricingEngine {
  
  /**
   * Calculate pricing for a booking
   */
  static async calculatePricing(
    unitId: string,
    checkIn: Date,
    checkOut: Date,
    guests: number = 1
  ): Promise<PricingBreakdown> {
    // Get unit and its rate plan
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: {
        ratePlans: true
      }
    });

    if (!unit) {
      throw new Error('Unit not found');
    }

    // Find the appropriate rate plan (unit-specific or category-wide)
    let ratePlan = unit.ratePlans.find(rp => rp.unitId === unitId);
    if (!ratePlan) {
      const foundRatePlan = await prisma.ratePlan.findFirst({
        where: { 
          category: unit.type,
          unitId: null 
        }
      });
      ratePlan = foundRatePlan || undefined;
    }

    if (!ratePlan) {
      throw new Error('No rate plan found for this unit');
    }

    if (!ratePlan.nightly) {
      throw new Error('Rate plan missing nightly rate');
    }

    const totalNights = differenceInCalendarDays(checkOut, checkIn);
    
    if (totalNights <= 0) {
      throw new Error('Check-out date must be after check-in date');
    }

    // Determine the base rate based on length of stay
    let baseRate: number;
    if (totalNights >= 120) { // 4+ months
      baseRate = ratePlan.fourMonth || ratePlan.monthly || ratePlan.weekly || ratePlan.nightly;
    } else if (totalNights >= 30) { // 1+ month
      baseRate = ratePlan.monthly || ratePlan.weekly || ratePlan.nightly;
    } else if (totalNights >= 7) { // 1+ week
      baseRate = ratePlan.weekly || ratePlan.nightly;
    } else { // nightly
      baseRate = ratePlan.nightly;
    }

    // For longer stays, calculate proportional pricing
    let subtotal: number;
    let pricePerNight: number;

    if (totalNights >= 120 && ratePlan.fourMonth) {
      // 4-month rate
      const fourMonthPeriods = Math.floor(totalNights / 120);
      const remainingNights = totalNights % 120;
      subtotal = (fourMonthPeriods * ratePlan.fourMonth) + 
                (remainingNights * (ratePlan.monthly ? ratePlan.monthly / 30 : ratePlan.nightly));
      pricePerNight = subtotal / totalNights;
    } else if (totalNights >= 30 && ratePlan.monthly) {
      // Monthly rate
      const monthlyPeriods = Math.floor(totalNights / 30);
      const remainingNights = totalNights % 30;
      subtotal = (monthlyPeriods * ratePlan.monthly) + 
                (remainingNights * (ratePlan.weekly ? ratePlan.weekly / 7 : ratePlan.nightly));
      pricePerNight = subtotal / totalNights;
    } else if (totalNights >= 7 && ratePlan.weekly) {
      // Weekly rate
      const weeklyPeriods = Math.floor(totalNights / 7);
      const remainingNights = totalNights % 7;
      subtotal = (weeklyPeriods * ratePlan.weekly) + (remainingNights * ratePlan.nightly);
      pricePerNight = subtotal / totalNights;
    } else {
      // Nightly rate
      subtotal = totalNights * ratePlan.nightly;
      pricePerNight = ratePlan.nightly;
    }

    // Check for seasonal discounts
    const seasons = await prisma.season.findMany({
      where: {
        OR: [
          {
            AND: [
              { startDate: { lte: checkIn } },
              { endDate: { gte: checkIn } }
            ]
          },
          {
            AND: [
              { startDate: { lte: checkOut } },
              { endDate: { gte: checkOut } }
            ]
          },
          {
            AND: [
              { startDate: { gte: checkIn } },
              { endDate: { lte: checkOut } }
            ]
          }
        ]
      },
      orderBy: { discountPct: 'desc' }
    });

    // Apply the highest discount that applies
    const bestSeason = seasons[0];
    let seasonalDiscount = 0;
    let discountPercentage = 0;

    if (bestSeason) {
      discountPercentage = bestSeason.discountPct;
      seasonalDiscount = Math.round(subtotal * (discountPercentage / 100));
    }

    // Get applicable fees
    const fees = await prisma.fee.findMany();
    const applicableFees = fees.map(fee => ({
      name: fee.name,
      amount: fee.perStay ? fee.amount : fee.amount * totalNights
    }));

    const totalFees = applicableFees.reduce((sum, fee) => sum + fee.amount, 0);
    const total = subtotal - seasonalDiscount + totalFees;

    return {
      subtotal,
      seasonalDiscount,
      fees: applicableFees,
      total,
      pricePerNight,
      totalNights,
      discountPercentage
    };
  }

  /**
   * Check availability for a date range
   */
  static async checkAvailability(
    unitId: string,
    checkIn: Date,
    checkOut: Date
  ): Promise<AvailabilityResult> {
    // Check for conflicting bookings
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        unitId,
        status: 'CONFIRMED',
        OR: [
          {
            AND: [
              { checkIn: { lte: checkIn } },
              { checkOut: { gt: checkIn } }
            ]
          },
          {
            AND: [
              { checkIn: { lt: checkOut } },
              { checkOut: { gte: checkOut } }
            ]
          },
          {
            AND: [
              { checkIn: { gte: checkIn } },
              { checkOut: { lte: checkOut } }
            ]
          }
        ]
      },
      select: { id: true, checkIn: true, checkOut: true }
    });

    // Check for conflicting holds
    const conflictingHolds = await prisma.hold.findMany({
      where: {
        unitId,
        status: 'ACTIVE',
        expiresAt: { gt: new Date() }, // Only active holds
        OR: [
          {
            AND: [
              { checkIn: { lte: checkIn } },
              { checkOut: { gt: checkIn } }
            ]
          },
          {
            AND: [
              { checkIn: { lt: checkOut } },
              { checkOut: { gte: checkOut } }
            ]
          },
          {
            AND: [
              { checkIn: { gte: checkIn } },
              { checkOut: { lte: checkOut } }
            ]
          }
        ]
      },
      select: { id: true, checkIn: true, checkOut: true }
    });

    const available = conflictingBookings.length === 0 && conflictingHolds.length === 0;

    return {
      available,
      conflictingBookings: conflictingBookings.length > 0 ? 
        conflictingBookings.map(b => `${format(b.checkIn, 'MMM d')} - ${format(b.checkOut, 'MMM d')}`) : 
        undefined,
      conflictingHolds: conflictingHolds.length > 0 ? 
        conflictingHolds.map(h => `${format(h.checkIn, 'MMM d')} - ${format(h.checkOut, 'MMM d')}`) : 
        undefined
    };
  }

  /**
   * Create a temporary hold on dates
   */
  static async createHold(
    unitId: string,
    checkIn: Date,
    checkOut: Date,
    expirationMinutes: number = 15
  ): Promise<string> {
    // Check availability first
    const availability = await this.checkAvailability(unitId, checkIn, checkOut);
    
    if (!availability.available) {
      throw new Error('Dates are not available for booking');
    }

    const expiresAt = addDays(new Date(), expirationMinutes / (24 * 60));

    const hold = await prisma.hold.create({
      data: {
        unitId,
        checkIn,
        checkOut,
        expiresAt
      }
    });

    return hold.id;
  }

  /**
   * Get available date ranges for a unit
   */
  static async getAvailableDateRanges(
    unitId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Array<{ start: Date; end: Date }>> {
    // Get all bookings and holds in the date range
    const [bookings, holds] = await Promise.all([
      prisma.booking.findMany({
        where: {
          unitId,
          status: 'CONFIRMED',
          OR: [
            { checkIn: { lte: endDate } },
            { checkOut: { gte: startDate } }
          ]
        },
        select: { checkIn: true, checkOut: true },
        orderBy: { checkIn: 'asc' }
      }),
      prisma.hold.findMany({
        where: {
          unitId,
          status: 'ACTIVE',
          expiresAt: { gt: new Date() },
          OR: [
            { checkIn: { lte: endDate } },
            { checkOut: { gte: startDate } }
          ]
        },
        select: { checkIn: true, checkOut: true },
        orderBy: { checkIn: 'asc' }
      })
    ]);

    // Combine and sort all occupied periods
    const occupiedPeriods = [...bookings, ...holds]
      .map(period => ({ start: period.checkIn, end: period.checkOut }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    // Find available gaps
    const availableRanges: Array<{ start: Date; end: Date }> = [];
    let currentDate = startDate;

    for (const occupied of occupiedPeriods) {
      if (currentDate < occupied.start) {
        availableRanges.push({
          start: currentDate,
          end: occupied.start
        });
      }
      currentDate = new Date(Math.max(currentDate.getTime(), occupied.end.getTime()));
    }

    // Add final range if there's space
    if (currentDate < endDate) {
      availableRanges.push({
        start: currentDate,
        end: endDate
      });
    }

    return availableRanges;
  }
}