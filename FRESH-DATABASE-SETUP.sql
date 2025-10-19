-- ============================================
-- PALM AIRE COURT - FRESH DATABASE SETUP
-- Complete schema setup for new Supabase project
-- Run this in your Supabase SQL Editor
-- ============================================

BEGIN;

-- ============================================
-- STEP 1: CREATE ENUM TYPES
-- ============================================

CREATE TYPE "UnitType" AS ENUM ('TRAILER', 'COTTAGE_1BR', 'COTTAGE_2BR', 'RV_SITE');
CREATE TYPE "HoldStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CONVERTED', 'CANCELLED');
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'CANCELLED');

-- ============================================
-- STEP 2: CREATE TABLES WITH snake_case COLUMNS
-- ============================================

-- 1. UNITS TABLE
CREATE TABLE units (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type "UnitType" NOT NULL,
  capacity INTEGER NOT NULL,
  beds INTEGER,
  baths INTEGER,
  amenities TEXT NOT NULL DEFAULT '',
  features TEXT NOT NULL DEFAULT '',
  photos TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. RATE PLANS TABLE
CREATE TABLE rate_plans (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  unit_id TEXT REFERENCES units(id) ON DELETE CASCADE,
  category "UnitType",
  nightly INTEGER,
  weekly INTEGER,
  monthly INTEGER,
  four_month INTEGER,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. SEASONS TABLE
CREATE TABLE seasons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  start_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  end_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  discount_pct INTEGER NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. FEES TABLE
CREATE TABLE fees (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  per_stay BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. CUSTOMERS TABLE
CREATE TABLE customers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. HOLDS TABLE
CREATE TABLE holds (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  unit_id TEXT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  check_in TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  check_out TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  status "HoldStatus" NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. BOOKINGS TABLE
CREATE TABLE bookings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  unit_id TEXT NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  check_in TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  check_out TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  status "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
  total_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  notes TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. PAYMENTS TABLE
CREATE TABLE payments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  booking_id TEXT UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'stripe',
  stripe_intent_id TEXT UNIQUE NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STEP 3: CREATE INDEXES
-- ============================================

CREATE INDEX idx_rate_plans_unit_id ON rate_plans(unit_id);
CREATE INDEX idx_rate_plans_category ON rate_plans(category);
CREATE INDEX idx_holds_unit_id ON holds(unit_id);
CREATE INDEX idx_holds_expires_at ON holds(expires_at);
CREATE INDEX idx_holds_status ON holds(status);
CREATE INDEX idx_bookings_unit_id ON bookings(unit_id);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);

-- ============================================
-- STEP 4: CREATE UPDATE TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rate_plans_updated_at BEFORE UPDATE ON rate_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seasons_updated_at BEFORE UPDATE ON seasons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fees_updated_at BEFORE UPDATE ON fees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holds_updated_at BEFORE UPDATE ON holds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 5: INSERT 17 UNITS
-- ============================================

INSERT INTO units (id, slug, name, type, capacity, beds, baths, amenities, features, photos, active) VALUES
  -- Two-Bedroom Cottages (2 units)
  ('two-bedroom-cottage-1', 'two-bedroom-cottage-1', 'Two-Bedroom Cottage', 'COTTAGE_2BR', 4, 2, 2, 
   '["WiFi", "AC/Heat", "Parking", "Full Kitchen", "RO Water", "Laundry", "Patio"]',
   '["Spacious", "Modern", "Two Bathrooms"]',
   '[]', true),
   
  ('two-bedroom-cottage-2', 'two-bedroom-cottage-2', 'Two-Bedroom Cottage', 'COTTAGE_2BR', 4, 2, 1,
   '["WiFi", "AC/Heat", "Parking", "Full Kitchen", "RO Water", "Laundry", "Patio"]',
   '["Comfortable", "Full Kitchen"]',
   '[]', true),
   
  -- One-Bedroom Cottages (4 units)
  ('one-bedroom-cottage-1', 'one-bedroom-cottage-1', 'One-Bedroom Cottage', 'COTTAGE_1BR', 2, 1, 1,
   '["WiFi", "AC/Heat", "Parking", "Full Kitchen", "RO Water", "Laundry", "Patio"]',
   '["Cozy", "Perfect for Couples"]',
   '[]', true),
   
  ('one-bedroom-cottage-2', 'one-bedroom-cottage-2', 'One-Bedroom Cottage', 'COTTAGE_1BR', 2, 1, 1,
   '["WiFi", "AC/Heat", "Parking", "Full Kitchen", "RO Water", "Laundry", "Patio"]',
   '["Cozy", "Perfect for Couples"]',
   '[]', true),
   
  ('one-bedroom-cottage-3', 'one-bedroom-cottage-3', 'One-Bedroom Cottage', 'COTTAGE_1BR', 2, 1, 1,
   '["WiFi", "AC/Heat", "Parking", "Full Kitchen", "RO Water", "Laundry", "Patio"]',
   '["Cozy", "Perfect for Couples"]',
   '[]', true),
   
  ('one-bedroom-cottage-4', 'one-bedroom-cottage-4', 'One-Bedroom Cottage', 'COTTAGE_1BR', 2, 1, 1,
   '["WiFi", "AC/Heat", "Parking", "Full Kitchen", "RO Water", "Laundry", "Patio"]',
   '["Cozy", "Perfect for Couples"]',
   '[]', true),
   
  -- Units (11 units)
  ('unit-1', 'unit-1', 'Unit 1', 'TRAILER', 2, 1, 1,
   '["WiFi", "AC/Heat", "Parking", "Kitchenette", "RO Water", "Laundry"]',
   '["Comfortable", "Essential Amenities"]',
   '[]', true),
   
  ('unit-2', 'unit-2', 'Unit 2', 'TRAILER', 2, 1, 1,
   '["WiFi", "AC/Heat", "Parking", "Kitchenette", "RO Water", "Laundry"]',
   '["Comfortable", "Essential Amenities"]',
   '[]', true),
   
  ('unit-3', 'unit-3', 'Unit 3', 'TRAILER', 2, 1, 1,
   '["WiFi", "AC/Heat", "Parking", "Kitchenette", "RO Water", "Laundry"]',
   '["Comfortable", "Essential Amenities"]',
   '[]', true),
   
  ('unit-4', 'unit-4', 'Unit 4', 'TRAILER', 2, 1, 1,
   '["WiFi", "AC/Heat", "Parking", "Kitchenette", "RO Water", "Laundry"]',
   '["Comfortable", "Essential Amenities"]',
   '[]', true),
   
  ('unit-5', 'unit-5', 'Unit 5', 'TRAILER', 2, 1, 1,
   '["WiFi", "AC/Heat", "Parking", "Kitchenette", "RO Water", "Laundry"]',
   '["Comfortable", "Essential Amenities"]',
   '[]', true),
   
  ('unit-6', 'unit-6', 'Unit 6', 'TRAILER', 2, 1, 1,
   '["WiFi", "AC/Heat", "Parking", "Kitchenette", "RO Water", "Laundry"]',
   '["Comfortable", "Essential Amenities"]',
   '[]', true),
   
  ('unit-7', 'unit-7', 'Unit 7', 'TRAILER', 2, 1, 1,
   '["WiFi", "AC/Heat", "Parking", "Kitchenette", "RO Water", "Laundry"]',
   '["Comfortable", "Essential Amenities"]',
   '[]', true),
   
  ('unit-8', 'unit-8', 'Unit 8', 'TRAILER', 2, 1, 1,
   '["WiFi", "AC/Heat", "Parking", "Kitchenette", "RO Water", "Laundry"]',
   '["Comfortable", "Essential Amenities"]',
   '[]', true),
   
  ('unit-9', 'unit-9', 'Unit 9', 'TRAILER', 2, 1, 1,
   '["WiFi", "AC/Heat", "Parking", "Kitchenette", "RO Water", "Laundry"]',
   '["Comfortable", "Essential Amenities"]',
   '[]', true),
   
  ('unit-10', 'unit-10', 'Unit 10', 'TRAILER', 2, 1, 1,
   '["WiFi", "AC/Heat", "Parking", "Kitchenette", "RO Water", "Laundry"]',
   '["Comfortable", "Essential Amenities"]',
   '[]', true),
   
  ('unit-11', 'unit-11', 'Unit 11', 'TRAILER', 2, 1, 1,
   '["WiFi", "AC/Heat", "Parking", "Kitchenette", "RO Water", "Laundry"]',
   '["Comfortable", "Essential Amenities"]',
   '[]', true);

-- ============================================
-- STEP 6: INSERT RATE PLANS
-- ============================================

-- One-Bedroom Cottages: $80/night, $450/week, $1,500/month, $5,000/4-months
INSERT INTO rate_plans (unit_id, category, nightly, weekly, monthly, four_month, currency)
SELECT id, type, 8000, 45000, 150000, 500000, 'USD'
FROM units 
WHERE type = 'COTTAGE_1BR';

-- Two-Bedroom Cottages: $120/night, $700/week, $2,500/month, $8,500/4-months  
INSERT INTO rate_plans (unit_id, category, nightly, weekly, monthly, four_month, currency)
SELECT id, type, 12000, 70000, 250000, 850000, 'USD'
FROM units 
WHERE type = 'COTTAGE_2BR';

-- Units (TRAILER type): $50/night, $280/week, $950/month, $3,200/4-months
INSERT INTO rate_plans (unit_id, category, nightly, weekly, monthly, four_month, currency)
SELECT id, type, 5000, 28000, 95000, 320000, 'USD'
FROM units 
WHERE type = 'TRAILER';

-- ============================================
-- STEP 7: INSERT SAMPLE SEASONS
-- ============================================

INSERT INTO seasons (name, start_date, end_date, discount_pct) VALUES
  ('Peak Season', '2025-12-01', '2026-03-31', 0),
  ('Off Season', '2026-04-01', '2026-11-30', 10);

-- ============================================
-- STEP 8: ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 9: CREATE RLS POLICIES
-- ============================================

-- Public read access for browsing
CREATE POLICY "Anyone can view active units" ON units
  FOR SELECT USING (active = true);

CREATE POLICY "Anyone can view rate plans" ON rate_plans
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view seasons" ON seasons
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view fees" ON fees
  FOR SELECT USING (true);

-- Holds policies (for reservation system)
CREATE POLICY "Anyone can create holds" ON holds
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view holds" ON holds
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update holds" ON holds
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete holds" ON holds
  FOR DELETE USING (true);

-- Bookings policies
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view bookings" ON bookings
  FOR SELECT USING (true);

CREATE POLICY "Service role can update bookings" ON bookings
  FOR UPDATE USING (true);

-- Customers policies
CREATE POLICY "Anyone can create customers" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view customers" ON customers
  FOR SELECT USING (true);

-- Payments policies
CREATE POLICY "Anyone can create payments" ON payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view payments" ON payments
  FOR SELECT USING (true);

-- ============================================
-- STEP 10: VERIFY RESULTS
-- ============================================

SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as total_units FROM units;
SELECT type, COUNT(*) as count FROM units GROUP BY type ORDER BY type;

SELECT id, slug, name, type, capacity, beds, baths, active 
FROM units 
ORDER BY 
  CASE type 
    WHEN 'COTTAGE_2BR' THEN 1
    WHEN 'COTTAGE_1BR' THEN 2
    WHEN 'TRAILER' THEN 3
  END, 
  name;

COMMIT;

-- ============================================
-- SETUP COMPLETE - YOUR DATABASE IS READY!
-- ============================================
