# Palm Aire Court - Complete Project Documentation

*Last Updated: October 19, 2025*

## Project Overview
Palm Aire Court is a full-stack vacation rental booking platform for a senior community in Phoenix, Arizona. It provides online booking for **17 units** (2 two-bedroom cottages, 4 one-bedroom cottages, and 11 standard units), integrated payment processing, customer management, and admin tools.

## Architecture
- **Frontend**: React 18 + TypeScript, Vite
- **Backend**: Express.js + TypeScript  
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **UI**: TailwindCSS + shadcn/ui components
- **Routing**: Wouter (lightweight React router)
- **State**: TanStack Query (React Query v5)
- **Payments**: Stripe (direct integration)
- **CRM**: GoHighLevel integration
- **Validation**: Zod schemas

## Database Schema
All tables use **snake_case** column naming for PostgreSQL best practices.

- **units**: 17 rental properties (TEXT id, slug, name, type, capacity, beds, baths, amenities, features, photos, active, created_at, updated_at)
- **rate_plans**: Pricing tiers (unit_id FK, category, nightly, weekly, monthly, four_month in cents, currency)
- **bookings**: Reservations (unit_id FK, customer_id FK, check_in, check_out, status, total_cents, currency, notes)
- **customers**: Guest info (first_name, last_name, email, phone)
- **payments**: Stripe records (booking_id FK, provider, stripe_intent_id, amount_cents, currency, status)
- **holds**: Temporary reservations (unit_id FK, check_in, check_out, expires_at, status - prevents double-booking)
- **seasons**: Pricing periods (name, start_date, end_date, discount_pct)
- **fees**: Additional charges (name, amount, per_stay boolean)

**ENUM Types:**
- `UnitType`: TRAILER, COTTAGE_1BR, COTTAGE_2BR, RV_SITE
- `HoldStatus`: ACTIVE, EXPIRED, CONVERTED, CANCELLED
- `BookingStatus`: CONFIRMED, CANCELLED

## Key Features
- ✅ 17 units with real property photos
- ✅ Complete booking system with date selection and dynamic pricing
- ✅ Stripe payment processing (Payment Intents API, no webhooks)
- ✅ Customer management and GoHighLevel CRM integration
- ✅ Real-time availability checking with 10-minute hold system
- ✅ Dynamic pricing with seasonal rates and additional fees
- ✅ Responsive design working on all devices
- ✅ Interactive Google Maps integration
- ✅ Professional UI with shadcn/ui components
- ✅ Updated terminology: "Units" instead of "Trailers"
- ✅ Live Supabase database (no static JSON dependencies)

## API Endpoints
- `/api/units` - Unit management and listing
- `/api/units/:slug` - Individual unit details
- `/api/bookings` - Reservation creation and management
- `/api/customers` - Customer data handling
- `/api/payments/create-intent` - Stripe payment processing
- `/api/payments/config` - Get Stripe publishable key
- `/api/availability` - Real-time availability checking
- `/api/holds` - Temporary reservation management
- `/api/contacts/gohighlevel` - CRM integration
- `/api/admin/*` - Administrative functions

## Configuration for Production

### Required Updates
1. **Stripe Keys**: Replace test keys with live production keys
2. **Domain Setup**: Configure production domain and SSL
3. **CORS**: Restrict to production domain only
4. **Security**: Add rate limiting and security headers
5. **Performance**: Configure CDN for static assets
6. **Monitoring**: Set up error tracking and analytics

### Environment Variables
```env
# Supabase Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_live_..." # Update to live key
STRIPE_PUBLISHABLE_KEY="pk_live_..." # Update to live key

# Optional Integrations
GHL_API_KEY="..." # GoHighLevel integration
NODE_ENV="production"
```

## File Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Route pages
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
├── server/                # Express backend
│   ├── lib/              # Server utilities
│   │   ├── supabase.ts   # Supabase client config
│   │   ├── static.ts     # Static file serving
│   │   └── vite-dev.ts   # Vite dev server
│   └── routes/           # API endpoints
└── assets/              # Property images
```

## Setup Instructions
1. `npm install`
2. Configure `.env` with Supabase credentials and API keys (see SUPABASE-SETUP.md)
3. Set up Supabase database schema (see SUPABASE-SETUP.md)
4. `npm run dev`

## Production Deployment
The application is production-ready with minimal configuration:
- **Frontend + Backend**: Single Railway service builds the Vite frontend and serves it via Express
- **Database**: Supabase (fully managed PostgreSQL with auto-scaling)

## Simplified Architecture
- **Payments**: Direct Stripe integration without webhook complexity
- **No Email Dependencies**: Streamlined booking flow
- **Real-time Updates**: Payment status tracked through direct API calls
- **Booking Confirmation**: Immediate confirmation after successful payment

## Contact Information
- **Address**: 9616 N 12th St, Phoenix, AZ 85020
- **Phone**: 480-993-8431  
- **Email**: palmairecourt@outlook.com

---
*This documentation reflects the current simplified codebase as of August 28, 2025. All email service and webhook dependencies have been removed for easier deployment.*
