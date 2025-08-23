import { isWithinInterval, parseISO, isSameDay, isAfter, isBefore } from 'date-fns';
import type { AvailabilityEntry } from '@/types';

export function isDateRangeAvailable(
  unitId: string,
  checkIn: Date,
  checkOut: Date,
  availability: AvailabilityEntry[]
): boolean {
  const unitAvailability = availability.find(entry => entry.unitId === unitId);
  if (!unitAvailability) return true;
  
  // Check if the requested range overlaps with any booked range
  for (const bookedRange of unitAvailability.bookedRanges) {
    const bookedStart = parseISO(bookedRange.start);
    const bookedEnd = parseISO(bookedRange.end);
    
    // Check for any overlap
    const hasOverlap = 
      (isWithinInterval(checkIn, { start: bookedStart, end: bookedEnd }) ||
       isWithinInterval(checkOut, { start: bookedStart, end: bookedEnd }) ||
       (isBefore(checkIn, bookedStart) && isAfter(checkOut, bookedEnd)));
    
    if (hasOverlap) {
      return false;
    }
  }
  
  return true;
}

export function getUnavailableDates(availability: AvailabilityEntry[], unitId?: string): Date[] {
  const dates: Date[] = [];
  
  const entries = unitId 
    ? availability.filter(entry => entry.unitId === unitId)
    : availability;
  
  for (const entry of entries) {
    for (const range of entry.bookedRanges) {
      const start = parseISO(range.start);
      const end = parseISO(range.end);
      
      const current = new Date(start);
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    }
  }
  
  return dates;
}

export function formatDateRange(checkIn: Date | undefined, checkOut: Date | undefined): string {
  if (!checkIn || !checkOut) return '';
  
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: checkIn.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  };
  
  return `${checkIn.toLocaleDateString('en-US', options)} - ${checkOut.toLocaleDateString('en-US', options)}`;
}

export function isValidDateRange(checkIn: Date | undefined, checkOut: Date | undefined): boolean {
  if (!checkIn || !checkOut) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return isAfter(checkIn, today) && isAfter(checkOut, checkIn);
}
