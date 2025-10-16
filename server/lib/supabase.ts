import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

export type UnitType = 'TRAILER' | 'COTTAGE_1BR' | 'COTTAGE_2BR' | 'RV_SITE';
export type HoldStatus = 'ACTIVE' | 'EXPIRED' | 'CONVERTED' | 'CANCELLED';
export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

export interface Unit {
  id: string;
  slug: string;
  name: string;
  type: UnitType;
  capacity: number;
  beds: number | null;
  baths: number | null;
  amenities: string;
  features: string;
  photos: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RatePlan {
  id: string;
  unit_id: string | null;
  category: UnitType | null;
  nightly: number | null;
  weekly: number | null;
  monthly: number | null;
  four_month: number | null;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Season {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  discount_pct: number;
  created_at: string;
  updated_at: string;
}

export interface Fee {
  id: string;
  name: string;
  amount: number;
  per_stay: boolean;
  created_at: string;
  updated_at: string;
}

export interface Hold {
  id: string;
  unit_id: string;
  check_in: string;
  check_out: string;
  expires_at: string;
  status: HoldStatus;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  unit_id: string;
  customer_id: string;
  check_in: string;
  check_out: string;
  status: BookingStatus;
  total_cents: number;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  provider: string;
  stripe_intent_id: string;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}
