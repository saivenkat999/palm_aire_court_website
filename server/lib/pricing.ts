import supabase, { Unit, RatePlan, Season, Fee, UnitType } from './supabase.js';
import { addDays, differenceInCalendarDays, format } from 'date-fns';

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

  static async calculatePricing(
    unitId: string,
    checkIn: Date,
    checkOut: Date,
    guests: number = 1
  ): Promise<PricingBreakdown> {
    const { data: unit, error: unitError } = await supabase
      .from('units')
      .select('*')
      .eq('id', unitId)
      .maybeSingle();

    if (unitError || !unit) {
      throw new Error('Unit not found');
    }

    const { data: unitRatePlans } = await supabase
      .from('rate_plans')
      .select('*')
      .eq('unit_id', unitId);

    let ratePlan = unitRatePlans?.[0];

    if (!ratePlan) {
      const { data: categoryRatePlan } = await supabase
        .from('rate_plans')
        .select('*')
        .eq('category', unit.type)
        .is('unit_id', null)
        .maybeSingle();

      ratePlan = categoryRatePlan || undefined;
    }

    if (!ratePlan || !ratePlan.nightly) {
      throw new Error('No rate plan found for this unit');
    }

    const totalNights = differenceInCalendarDays(checkOut, checkIn);

    if (totalNights <= 0) {
      throw new Error('Check-out date must be after check-in date');
    }

    let baseRate: number;
    if (totalNights >= 120) {
      baseRate = ratePlan.four_month || ratePlan.monthly || ratePlan.weekly || ratePlan.nightly;
    } else if (totalNights >= 30) {
      baseRate = ratePlan.monthly || ratePlan.weekly || ratePlan.nightly;
    } else if (totalNights >= 7) {
      baseRate = ratePlan.weekly || ratePlan.nightly;
    } else {
      baseRate = ratePlan.nightly;
    }

    let subtotal: number;
    let pricePerNight: number;

    if (totalNights >= 120 && ratePlan.four_month) {
      const fourMonthPeriods = Math.floor(totalNights / 120);
      const remainingNights = totalNights % 120;
      subtotal = (fourMonthPeriods * ratePlan.four_month) +
                (remainingNights * (ratePlan.monthly ? ratePlan.monthly / 30 : ratePlan.nightly));
      pricePerNight = subtotal / totalNights;
    } else if (totalNights >= 30 && ratePlan.monthly) {
      const monthlyPeriods = Math.floor(totalNights / 30);
      const remainingNights = totalNights % 30;
      subtotal = (monthlyPeriods * ratePlan.monthly) +
                (remainingNights * (ratePlan.weekly ? ratePlan.weekly / 7 : ratePlan.nightly));
      pricePerNight = subtotal / totalNights;
    } else if (totalNights >= 7 && ratePlan.weekly) {
      const weeklyPeriods = Math.floor(totalNights / 7);
      const remainingNights = totalNights % 7;
      subtotal = (weeklyPeriods * ratePlan.weekly) + (remainingNights * ratePlan.nightly);
      pricePerNight = subtotal / totalNights;
    } else {
      subtotal = totalNights * ratePlan.nightly;
      pricePerNight = ratePlan.nightly;
    }

    const { data: seasons } = await supabase
      .from('seasons')
      .select('*')
      .or(`and(start_date.lte.${checkIn.toISOString()},end_date.gte.${checkIn.toISOString()}),and(start_date.lte.${checkOut.toISOString()},end_date.gte.${checkOut.toISOString()}),and(start_date.gte.${checkIn.toISOString()},end_date.lte.${checkOut.toISOString()})`)
      .order('discount_pct', { ascending: false });

    const bestSeason = seasons?.[0];
    let seasonalDiscount = 0;
    let discountPercentage = 0;

    if (bestSeason) {
      discountPercentage = bestSeason.discount_pct;
      seasonalDiscount = Math.round(subtotal * (discountPercentage / 100));
    }

    const { data: fees } = await supabase
      .from('fees')
      .select('*');

    const applicableFees = (fees || []).map(fee => ({
      name: fee.name,
      amount: fee.per_stay ? fee.amount : fee.amount * totalNights
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

  static async checkAvailability(
    unitId: string,
    checkIn: Date,
    checkOut: Date
  ): Promise<AvailabilityResult> {
    const checkInISO = checkIn.toISOString();
    const checkOutISO = checkOut.toISOString();

    const { data: conflictingBookings } = await supabase
      .from('bookings')
      .select('id, check_in, check_out')
      .eq('unit_id', unitId)
      .eq('status', 'CONFIRMED')
      .or(`and(check_in.lte.${checkInISO},check_out.gt.${checkInISO}),and(check_in.lt.${checkOutISO},check_out.gte.${checkOutISO}),and(check_in.gte.${checkInISO},check_out.lte.${checkOutISO})`);

    const { data: conflictingHolds } = await supabase
      .from('holds')
      .select('id, check_in, check_out')
      .eq('unit_id', unitId)
      .eq('status', 'ACTIVE')
      .gt('expires_at', new Date().toISOString())
      .or(`and(check_in.lte.${checkInISO},check_out.gt.${checkInISO}),and(check_in.lt.${checkOutISO},check_out.gte.${checkOutISO}),and(check_in.gte.${checkInISO},check_out.lte.${checkOutISO})`);

    const available = (!conflictingBookings || conflictingBookings.length === 0) &&
                      (!conflictingHolds || conflictingHolds.length === 0);

    return {
      available,
      conflictingBookings: conflictingBookings && conflictingBookings.length > 0 ?
        conflictingBookings.map(b => `${format(new Date(b.check_in), 'MMM d')} - ${format(new Date(b.check_out), 'MMM d')}`) :
        undefined,
      conflictingHolds: conflictingHolds && conflictingHolds.length > 0 ?
        conflictingHolds.map(h => `${format(new Date(h.check_in), 'MMM d')} - ${format(new Date(h.check_out), 'MMM d')}`) :
        undefined
    };
  }

  static async createHold(
    unitId: string,
    checkIn: Date,
    checkOut: Date,
    expirationMinutes: number = 15
  ): Promise<string> {
    const availability = await this.checkAvailability(unitId, checkIn, checkOut);

    if (!availability.available) {
      throw new Error('Dates are not available for booking');
    }

    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    const { data: hold, error } = await supabase
      .from('holds')
      .insert({
        unit_id: unitId,
        check_in: checkIn.toISOString(),
        check_out: checkOut.toISOString(),
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (error || !hold) {
      throw new Error('Failed to create hold');
    }

    return hold.id;
  }

  static async getAvailableDateRanges(
    unitId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Array<{ start: Date; end: Date }>> {
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();

    const [bookingsResult, holdsResult] = await Promise.all([
      supabase
        .from('bookings')
        .select('check_in, check_out')
        .eq('unit_id', unitId)
        .eq('status', 'CONFIRMED')
        .or(`check_in.lte.${endISO},check_out.gte.${startISO}`)
        .order('check_in', { ascending: true }),
      supabase
        .from('holds')
        .select('check_in, check_out')
        .eq('unit_id', unitId)
        .eq('status', 'ACTIVE')
        .gt('expires_at', new Date().toISOString())
        .or(`check_in.lte.${endISO},check_out.gte.${startISO}`)
        .order('check_in', { ascending: true })
    ]);

    const bookings = bookingsResult.data || [];
    const holds = holdsResult.data || [];

    const occupiedPeriods = [...bookings, ...holds]
      .map(period => ({ start: new Date(period.check_in), end: new Date(period.check_out) }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

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

    if (currentDate < endDate) {
      availableRanges.push({
        start: currentDate,
        end: endDate
      });
    }

    return availableRanges;
  }
}
