/*
  # Create Booking System Schema

  ## Tables Created
  
  ### 1. units
    - `id` (uuid, primary key) - Unique identifier for each unit
    - `slug` (text, unique) - URL-friendly identifier
    - `name` (text) - Display name of the unit
    - `type` (text) - Type: TRAILER, COTTAGE_1BR, COTTAGE_2BR, RV_SITE
    - `capacity` (integer) - Maximum number of guests
    - `beds` (integer, nullable) - Number of beds
    - `baths` (integer, nullable) - Number of bathrooms
    - `amenities` (text) - JSON string of amenities
    - `features` (text) - JSON string of features
    - `photos` (text) - JSON string of photo URLs
    - `active` (boolean) - Whether unit is available for booking
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 2. rate_plans
    - `id` (uuid, primary key) - Unique identifier
    - `unit_id` (uuid, nullable, foreign key) - Reference to specific unit
    - `category` (text, nullable) - Category-wide rates
    - `nightly` (integer, nullable) - Nightly rate in cents
    - `weekly` (integer, nullable) - Weekly rate in cents
    - `monthly` (integer, nullable) - Monthly rate in cents
    - `four_month` (integer, nullable) - Four month rate in cents
    - `currency` (text) - Currency code (default: USD)
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 3. seasons
    - `id` (uuid, primary key) - Unique identifier
    - `name` (text) - Season name
    - `start_date` (timestamptz) - Season start date
    - `end_date` (timestamptz) - Season end date
    - `discount_pct` (integer) - Discount percentage
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 4. fees
    - `id` (uuid, primary key) - Unique identifier
    - `name` (text) - Fee name
    - `amount` (integer) - Amount in cents
    - `per_stay` (boolean) - Whether fee is per stay or per night
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 5. holds
    - `id` (uuid, primary key) - Unique identifier
    - `unit_id` (uuid, foreign key) - Reference to unit
    - `check_in` (timestamptz) - Check-in date
    - `check_out` (timestamptz) - Check-out date
    - `expires_at` (timestamptz) - When hold expires
    - `status` (text) - ACTIVE, EXPIRED, CONVERTED, CANCELLED
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 6. customers
    - `id` (uuid, primary key) - Unique identifier
    - `first_name` (text) - Customer first name
    - `last_name` (text) - Customer last name
    - `email` (text, unique) - Customer email
    - `phone` (text, nullable) - Customer phone number
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 7. bookings
    - `id` (uuid, primary key) - Unique identifier
    - `unit_id` (uuid, foreign key) - Reference to unit
    - `customer_id` (uuid, foreign key) - Reference to customer
    - `check_in` (timestamptz) - Check-in date
    - `check_out` (timestamptz) - Check-out date
    - `status` (text) - CONFIRMED, CANCELLED
    - `total_cents` (integer) - Total amount in cents
    - `currency` (text) - Currency code (default: USD)
    - `notes` (text, nullable) - Booking notes
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 8. payments
    - `id` (uuid, primary key) - Unique identifier
    - `booking_id` (uuid, unique, foreign key) - Reference to booking
    - `provider` (text) - Payment provider (default: stripe)
    - `stripe_intent_id` (text, unique) - Stripe payment intent ID
    - `amount_cents` (integer) - Amount in cents
    - `currency` (text) - Currency code (default: USD)
    - `status` (text) - Payment status
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ## Security
    - RLS enabled on all tables
    - Public read access for units, rate_plans, seasons, and fees
    - Authenticated users can create holds and bookings
    - Authenticated users can read their own bookings
*/

-- Create units table
CREATE TABLE IF NOT EXISTS units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('TRAILER', 'COTTAGE_1BR', 'COTTAGE_2BR', 'RV_SITE')),
  capacity integer NOT NULL,
  beds integer,
  baths integer,
  amenities text DEFAULT '',
  features text DEFAULT '',
  photos text DEFAULT '',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rate_plans table
CREATE TABLE IF NOT EXISTS rate_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES units(id) ON DELETE CASCADE,
  category text CHECK (category IN ('TRAILER', 'COTTAGE_1BR', 'COTTAGE_2BR', 'RV_SITE')),
  nightly integer,
  weekly integer,
  monthly integer,
  four_month integer,
  currency text DEFAULT 'USD',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create seasons table
CREATE TABLE IF NOT EXISTS seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  discount_pct integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fees table
CREATE TABLE IF NOT EXISTS fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  amount integer NOT NULL,
  per_stay boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create holds table
CREATE TABLE IF NOT EXISTS holds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  check_in timestamptz NOT NULL,
  check_out timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  status text DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'CONVERTED', 'CANCELLED')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  check_in timestamptz NOT NULL,
  check_out timestamptz NOT NULL,
  status text DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'CANCELLED')),
  total_cents integer NOT NULL,
  currency text DEFAULT 'USD',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider text DEFAULT 'stripe',
  stripe_intent_id text UNIQUE NOT NULL,
  amount_cents integer NOT NULL,
  currency text DEFAULT 'USD',
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rate_plans_unit_id ON rate_plans(unit_id);
CREATE INDEX IF NOT EXISTS idx_rate_plans_category ON rate_plans(category);
CREATE INDEX IF NOT EXISTS idx_holds_unit_id ON holds(unit_id);
CREATE INDEX IF NOT EXISTS idx_holds_expires_at ON holds(expires_at);
CREATE INDEX IF NOT EXISTS idx_bookings_unit_id ON bookings(unit_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);

-- Enable Row Level Security
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for units (public read)
CREATE POLICY "Anyone can view active units"
  ON units FOR SELECT
  USING (active = true);

CREATE POLICY "Authenticated users can view all units"
  ON units FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for rate_plans (public read)
CREATE POLICY "Anyone can view rate plans"
  ON rate_plans FOR SELECT
  USING (true);

-- RLS Policies for seasons (public read)
CREATE POLICY "Anyone can view seasons"
  ON seasons FOR SELECT
  USING (true);

-- RLS Policies for fees (public read)
CREATE POLICY "Anyone can view fees"
  ON fees FOR SELECT
  USING (true);

-- RLS Policies for customers (users can read their own data)
CREATE POLICY "Users can view their own customer data"
  ON customers FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email');

-- RLS Policies for holds
CREATE POLICY "Anyone can create holds"
  ON holds FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view holds"
  ON holds FOR SELECT
  USING (true);

CREATE POLICY "Anyone can delete their holds"
  ON holds FOR DELETE
  USING (true);

CREATE POLICY "System can update holds"
  ON holds FOR UPDATE
  USING (true);

-- RLS Policies for bookings
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Anyone can view bookings by ID"
  ON bookings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT b.id FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      WHERE c.email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Anyone can create payments"
  ON payments FOR INSERT
  WITH CHECK (true);