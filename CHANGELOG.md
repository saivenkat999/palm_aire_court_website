# Changelog

All notable changes to the Palm Aire Court Booking System will be documented in this file.

## [2.0.0] - 2025-10-19

### Major Changes
- **Complete Database Migration**: Moved to fresh Supabase project with proper PostgreSQL conventions
- **Unit Count Update**: Reduced from 22 units to 17 units as per business requirements
  - 2× Two-Bedroom Cottages
  - 4× One-Bedroom Cottages
  - 11× Standard Units
- **Terminology Update**: Replaced "Trailers" with "Units" throughout the application

### Added
- `FRESH-DATABASE-SETUP.sql`: Complete database schema for fresh installations
- `nixpacks.toml`: Deployment configuration
- `CHANGELOG.md`: This file for tracking changes
- Row Level Security (RLS) policies on all database tables
- Auto-update triggers for `updated_at` columns

### Changed
- **Database Schema**: All columns now use snake_case naming convention
  - `createdAt` → `created_at`
  - `updatedAt` → `updated_at`
  - `unitId` → `unit_id`
  - `customerId` → `customer_id`
  - `firstName` → `first_name`
  - `lastName` → `last_name`
  - `checkIn` → `check_in`
  - `checkOut` → `check_out`
  - `totalCents` → `total_cents`
  - `amountCents` → `amount_cents`
  - `stripeIntentId` → `stripe_intent_id`
  - `bookingId` → `booking_id`
  - `expiresAt` → `expires_at`
  - `fourMonth` → `four_month`
  - `startDate` → `start_date`
  - `endDate` → `end_date`
  - `discountPct` → `discount_pct`
  - `perStay` → `per_stay`
- **Frontend Labels**:
  - "Trailers" → "Units" in filter dropdowns
  - "Any Available Trailer" → "Any Available Unit" in booking flow
  - "5th Wheel Trailer" → "Standard Unit" in featured stays
- **Documentation**: Updated README.md and PROJECT-DOCUMENTATION.md
- **Supabase Project**: Migrated to new project (kdzwussjbkaaoyrcfwrm)

### Removed
- `database-setup.sql` (replaced by FRESH-DATABASE-SETUP.sql)
- `SUPABASE-SQL-SETUP.sql` (replaced by FRESH-DATABASE-SETUP.sql)
- `SCHEMA-FIX-MIGRATION.sql` (no longer needed)
- `CLIENT-FEEDBACK-IMPLEMENTATION.md` (implementation complete)
- `.vscode/mcp.json` (development configuration, not for version control)
- 5 units removed from database (unit-12 through unit-14, one-bedroom-cottage-5, one-bedroom-cottage-6)

### Fixed
- Database column naming consistency (now all snake_case)
- TypeScript type definitions match actual database schema
- Unit terminology consistency across all pages

### Technical Details
- All monetary values stored in cents (INTEGER)
- Text-based IDs using slugs (not auto-incrementing)
- ENUM types: UnitType, HoldStatus, BookingStatus
- Timestamps without timezone (as per Supabase best practices)
- Foreign key constraints with proper CASCADE/RESTRICT policies

---

## [1.0.0] - 2025-10-17

### Initial Release
- Full-stack booking system with 22 units
- Stripe payment integration
- GoHighLevel CRM integration
- Real-time availability checking with hold system
- Responsive design with shadcn/ui components
- Admin dashboard for booking management
