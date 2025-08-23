export interface Unit {
  id: string;
  slug: string;
  name: string;
  type: 'trailer' | 'cottage-1br' | 'cottage-2br' | 'rv-site';
  capacity: number;
  beds: number;
  baths: number;
  description: string;
  images: string[];
  amenities: string[];
  policies: string[];
  rateCategory: string;
}

export interface Rate {
  category: string;
  nightly: number;
  weekly: number;
  monthly: number;
  fourMonth: number;
  cleaningFee: number;
}

export interface AvailabilityEntry {
  unitId: string;
  bookedRanges: {
    start: string;
    end: string;
  }[];
}

export interface Amenity {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'unit' | 'community';
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface PricingBreakdown {
  baseRate: number;
  nights: number;
  baseTotal: number;
  discountPercent: number;
  discountAmount: number;
  cleaningFee: number;
  total: number;
  rateType: 'nightly' | 'weekly' | 'monthly' | 'fourMonth';
}

export interface BookingFormData {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredDates: string;
  unitId?: string;
}
