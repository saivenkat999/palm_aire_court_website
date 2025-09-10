/**
 * Alternative Database Setup using Supabase REST API
 * This creates the tables using Supabase's REST API if direct connection fails
 */

const SUPABASE_URL = 'https://fpnwnhwga1izxcnjazhd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwbndud2dnYTFpenhjbmphemhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MzgyNzUsImV4cCI6MjA1MTUxNDI3NX0';

// SQL to create the schema
const createTablesSQL = `
-- Create enum types
CREATE TYPE "UnitType" AS ENUM ('TRAILER', 'COTTAGE_1BR', 'COTTAGE_2BR', 'RV_SITE');
CREATE TYPE "HoldStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CONVERTED', 'CANCELLED');
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'CANCELLED');

-- Create tables
CREATE TABLE "Unit" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type "UnitType" NOT NULL,
  capacity INTEGER NOT NULL,
  beds INTEGER,
  baths INTEGER,
  amenities TEXT DEFAULT '',
  features TEXT DEFAULT '',
  photos TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "RatePlan" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "unitId" TEXT REFERENCES "Unit"(id),
  category "UnitType",
  nightly INTEGER,
  weekly INTEGER,
  monthly INTEGER,
  "fourMonth" INTEGER,
  currency TEXT DEFAULT 'USD',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Season" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  "discountPct" INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Fee" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  "perStay" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Customer" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Hold" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "unitId" TEXT NOT NULL REFERENCES "Unit"(id),
  "checkIn" TIMESTAMP NOT NULL,
  "checkOut" TIMESTAMP NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  status "HoldStatus" DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Booking" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "unitId" TEXT NOT NULL REFERENCES "Unit"(id),
  "customerId" TEXT NOT NULL REFERENCES "Customer"(id),
  "checkIn" TIMESTAMP NOT NULL,
  "checkOut" TIMESTAMP NOT NULL,
  status "BookingStatus" DEFAULT 'CONFIRMED',
  "totalCents" INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  notes TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Payment" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "bookingId" TEXT UNIQUE NOT NULL REFERENCES "Booking"(id),
  provider TEXT DEFAULT 'stripe',
  "stripeIntentId" TEXT UNIQUE NOT NULL,
  "amountCents" INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
`;

async function createSchemaViaAPI() {
  console.log('🔧 Creating database schema via Supabase API...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        sql: createTablesSQL
      })
    });

    if (response.ok) {
      console.log('✅ Database schema created successfully!');
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Failed to create schema:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error creating schema:', error.message);
    return false;
  }
}

// Export for use in setup script
export { createSchemaViaAPI };
