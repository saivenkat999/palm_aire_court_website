# 🚀 Supabase Setup Guide for Palm Aire Court

This guide will walk you through setting up Supabase for your Palm Aire Court booking system.

---

## 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in with GitHub or create an account
3. Click **"New Project"**
4. Fill in the details:
   - **Name**: `palm-aire-court` (or your preferred name)
   - **Database Password**: Generate a strong password (save it securely!)
   - **Region**: Choose closest to your users (e.g., `us-east-1` for East Coast USA)
   - **Pricing Plan**: Start with **Free** (500MB database, 2GB bandwidth)
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to provision

---

## 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, click **Settings** (gear icon) in the left sidebar
2. Navigate to **API** section
3. Copy the following values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`

4. Add these to your `.env` file:
   ```env
   SUPABASE_URL="https://xxxxx.supabase.co"
   SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

5. For Railway deployment, add these same values to Railway's environment variables:
   - Go to your Railway project
   - Click on your service
   - Go to **Variables** tab
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`

---

## 3. Set Up Database Schema

### Option A: Using Supabase SQL Editor (Recommended for beginners)

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Copy and paste the schema below
4. Click **Run** (or press `Ctrl+Enter`)

### Option B: Using Migration Files

1. Create a migration file in your local project
2. Run it through the Supabase CLI or copy-paste into SQL Editor

---

## 4. Database Schema SQL

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE unit_type AS ENUM ('TRAILER', 'COTTAGE_1BR', 'COTTAGE_2BR', 'RV_SITE');
CREATE TYPE hold_status AS ENUM ('ACTIVE', 'EXPIRED', 'CONVERTED', 'CANCELLED');
CREATE TYPE booking_status AS ENUM ('CONFIRMED', 'CANCELLED');

-- Units table
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type unit_type NOT NULL,
  capacity INTEGER NOT NULL,
  beds INTEGER,
  baths INTEGER,
  amenities TEXT DEFAULT '',
  features TEXT DEFAULT '',
  photos TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate plans table
CREATE TABLE rate_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  category unit_type,
  nightly INTEGER, -- in cents
  weekly INTEGER,
  monthly INTEGER,
  four_month INTEGER,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seasons table
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  multiplier DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE RESTRICT NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  total_amount INTEGER NOT NULL, -- in cents
  status booking_status DEFAULT 'CONFIRMED',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Holds table (temporary reservations)
CREATE TABLE holds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status hold_status DEFAULT 'ACTIVE',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL, -- in cents
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fees table
CREATE TABLE fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  amount INTEGER NOT NULL, -- in cents
  type TEXT NOT NULL, -- 'PERCENTAGE' or 'FLAT'
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_bookings_unit_id ON bookings(unit_id);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_holds_unit_id ON holds(unit_id);
CREATE INDEX idx_holds_dates ON holds(check_in, check_out);
CREATE INDEX idx_holds_status ON holds(status);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rate_plans_updated_at BEFORE UPDATE ON rate_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 5. Set Up Row Level Security (RLS)

For production security, enable RLS policies:

```sql
-- Enable RLS on all tables
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;

-- Public read access for units and rate plans (for browsing)
CREATE POLICY "Public can read active units" ON units
  FOR SELECT USING (active = true);

CREATE POLICY "Public can read rate plans" ON rate_plans
  FOR SELECT USING (true);

CREATE POLICY "Public can read seasons" ON seasons
  FOR SELECT USING (true);

CREATE POLICY "Public can read fees" ON fees
  FOR SELECT USING (active = true);

-- Note: For backend operations, you'll use the service_role key
-- which bypasses RLS. The anon key respects these policies.
```

---

## 6. Seed Sample Data (Optional)

You can add sample units through the SQL Editor or Table Editor:

```sql
-- Insert sample units
INSERT INTO units (slug, name, type, capacity, beds, baths, amenities, features, active) VALUES
  ('cottage-1br-sunrise', 'Sunrise Cottage', 'COTTAGE_1BR', 2, 1, 1, 'WiFi,AC,Kitchen', 'Pet Friendly,Lake View', true),
  ('cottage-2br-sunset', 'Sunset Villa', 'COTTAGE_2BR', 4, 2, 2, 'WiFi,AC,Kitchen,Pool', 'Pet Friendly,Garden', true),
  ('trailer-classic', 'Classic Trailer', 'TRAILER', 2, 1, 1, 'WiFi,AC', 'Compact,Budget Friendly', true);

-- Insert sample rate plans
INSERT INTO rate_plans (unit_id, nightly, weekly, monthly, four_month) 
SELECT id, 8000, 45000, 150000, 500000 FROM units WHERE type = 'COTTAGE_1BR';

INSERT INTO rate_plans (unit_id, nightly, weekly, monthly, four_month) 
SELECT id, 12000, 70000, 250000, 850000 FROM units WHERE type = 'COTTAGE_2BR';

-- Insert sample seasons
INSERT INTO seasons (name, start_date, end_date, multiplier) VALUES
  ('Peak Season', '2025-12-01', '2026-03-31', 1.5),
  ('Regular Season', '2026-04-01', '2026-11-30', 1.0);
```

---

## 7. Verify Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see all your tables: `units`, `rate_plans`, `bookings`, etc.
3. Click on any table to verify the structure

---

## 8. Connect Your Application

Your application is already configured to use Supabase! Just make sure:

1. ✅ `.env` file has `SUPABASE_URL` and `SUPABASE_ANON_KEY`
2. ✅ Railway environment variables are set
3. ✅ Database schema is created (step 4 above)

Test the connection:
```bash
npm run dev
# Visit http://localhost:5000/api/units
# Should return an empty array or your seeded units
```

---

## 9. Monitoring & Maintenance

- **View Logs**: Supabase Dashboard → Logs
- **Monitor Usage**: Dashboard → Settings → Billing
- **Backups**: Automatic on Pro plan ($25/mo), manual exports on Free plan
- **Upgrade Plan**: When you exceed free tier limits (500MB DB, 2GB bandwidth)

---

## 10. Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

---

## Troubleshooting

**Problem**: `Missing Supabase environment variables`
- **Solution**: Check `.env` file or Railway variables for `SUPABASE_URL` and `SUPABASE_ANON_KEY`

**Problem**: `relation "units" does not exist`
- **Solution**: Run the schema SQL from Step 4

**Problem**: `permission denied for table units`
- **Solution**: Check RLS policies or use service_role key for backend operations

---

Need help? Check the [Supabase Discord](https://discord.supabase.com) or [GitHub Discussions](https://github.com/orgs/supabase/discussions)
