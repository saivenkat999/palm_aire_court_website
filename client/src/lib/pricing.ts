import { differenceInDays, isWithinInterval, parseISO } from 'date-fns';
import type { Rate, PricingBreakdown } from '@/types';

export function calculatePricing(
  rate: Rate,
  checkIn: Date,
  checkOut: Date
): PricingBreakdown {
  const nights = differenceInDays(checkOut, checkIn);
  
  // Determine best rate tier
  let baseRate: number;
  let rateType: PricingBreakdown['rateType'];
  
  if (nights >= 120) { // ~4 months
    baseRate = rate.fourMonth / 120;
    rateType = 'fourMonth';
  } else if (nights >= 28) { // monthly
    baseRate = rate.monthly / 28;
    rateType = 'monthly';
  } else if (nights >= 7) { // weekly
    baseRate = rate.weekly / 7;
    rateType = 'weekly';
  } else {
    baseRate = rate.nightly;
    rateType = 'nightly';
  }
  
  const baseTotal = baseRate * nights;
  
  // Calculate seasonal discount
  const discountPercent = getSeasonalDiscount(checkIn, checkOut);
  const discountAmount = baseTotal * (discountPercent / 100);
  
  const subtotal = baseTotal - discountAmount;
  const total = subtotal + rate.cleaningFee;
  
  return {
    baseRate,
    nights,
    baseTotal,
    discountPercent,
    discountAmount,
    cleaningFee: rate.cleaningFee,
    total,
    rateType,
  };
}

export function getSeasonalDiscount(checkIn: Date, checkOut: Date): number {
  // Get the months involved in the stay
  const months = getMonthsInRange(checkIn, checkOut);
  
  // Apply highest discount available during the stay
  let maxDiscount = 0;
  
  for (const month of months) {
    if (month === 10 || month === 3) { // November (10) or April (3) - 10% discount
      maxDiscount = Math.max(maxDiscount, 10);
    } else if (month >= 4 && month <= 9) { // May-October (4-9) - 20% discount
      maxDiscount = Math.max(maxDiscount, 20);
    }
  }
  
  return maxDiscount;
}

function getMonthsInRange(checkIn: Date, checkOut: Date): number[] {
  const months = new Set<number>();
  const current = new Date(checkIn);
  
  while (current < checkOut) {
    months.add(current.getMonth());
    current.setMonth(current.getMonth() + 1);
    current.setDate(1); // Reset to first of month to avoid date overflow issues
  }
  
  return Array.from(months);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getRateDisplay(rate: Rate): string {
  return formatCurrency(rate.nightly);
}
