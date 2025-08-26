import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface RatePlan {
  id: string;
  unitId?: string;
  category?: string;
  nightly?: number;
  weekly?: number;
  monthly?: number;
  fourMonth?: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  slug: string;
  name: string;
  type: string;
  capacity: number;
  beds: number;
  baths: number;
  amenities: string[];
  features: string[];
  photos: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  ratePlans: RatePlan[];
}

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

export interface BookingData {
  unitId?: string;
  unitType?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
}

// Units API
export function useUnits() {
  return useQuery<Unit[]>({
    queryKey: ['/api/units']
  });
}

export function useUnit(slug: string) {
  return useQuery<Unit>({
    queryKey: ['/api/units', slug],
    enabled: !!slug
  });
}

// Pricing API
export function usePricing(unitId: string, checkIn: string, checkOut: string, guests: number) {
  return useQuery<PricingBreakdown>({
    queryKey: ['/api/pricing', unitId, checkIn, checkOut, guests],
    queryFn: () => {
      const params = new URLSearchParams({
        unitId,
        checkIn,
        checkOut,
        guests: guests.toString()
      });
      return fetch(`/api/pricing?${params}`).then(res => res.json());
    },
    enabled: !!(unitId && checkIn && checkOut && guests)
  });
}

// Availability API
export function useAvailability(unitId: string, checkIn: string, checkOut: string) {
  return useQuery<AvailabilityResult>({
    queryKey: ['/api/availability', unitId, checkIn, checkOut],
    queryFn: () => {
      const params = new URLSearchParams({
        unitId,
        checkIn,
        checkOut
      });
      return fetch(`/api/availability?${params}`).then(res => res.json());
    },
    enabled: !!(unitId && checkIn && checkOut)
  });
}

// Hold API
export function useCreateHold() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      unitId: string;
      checkIn: string;
      checkOut: string;
      expirationMinutes?: number;
    }) => {
      const response = await apiRequest('POST', '/api/holds', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/availability'] });
    }
  });
}

// Booking API
export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: BookingData) => {
      const response = await apiRequest('POST', '/api/bookings', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/availability'] });
      queryClient.invalidateQueries({ queryKey: ['/api/units'] });
    }
  });
}