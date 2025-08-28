# Palm Aire Court - Complete Project Documentation

*Last Updated: August 28, 2025*

## Project Overview
Palm Aire Court is a full-stack vacation rental booking platform for a senior community in Phoenix, Arizona. It provides online booking for 22 units, integrated payment processing, customer management, and admin tools.

## Architecture
- **Frontend**: React 18 + TypeScript, Vite
- **Backend**: Express.js + TypeScript  
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **UI**: TailwindCSS + shadcn/ui
- **Routing**: Wouter
- **State**: TanStack Query
- **Payments**: Stripe (direct integration, no webhooks)
- **CRM**: GoHighLevel
- **Validation**: Zod

## Database Schema
- **Units**: 22 accommodations with photos, pricing, amenities
- **RatePlans**: Seasonal pricing for each unit
- **Bookings**: Customer reservations with payment tracking
- **Customers**: Guest information and contact details
- **Payments**: Stripe payment records
- **Holds**: Temporary reservations to prevent double booking
- **Seasons**: Pricing periods (High, Low, Peak seasons)
- **Fees**: Additional charges (cleaning, taxes, etc.)

## Key Features
- ✅ 22 units (12 cottages, 10 trailers) with real property photos
- ✅ Complete booking system with date selection and dynamic pricing
- ✅ Stripe payment processing (direct, no webhook dependencies)
- ✅ Customer management and GoHighLevel CRM integration
- ✅ Real-time availability checking with hold system
- ✅ Dynamic pricing with seasonal rates and additional fees
- ✅ Responsive design working on all devices
- ✅ Interactive Google Maps on homepage, contact, and all unit pages
- ✅ Professional UI with real images (no placeholders)
- ✅ Updated cancellation policies across all pages
- ✅ Live database integration (no static JSON dependencies)

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
DATABASE_URL="postgresql://..." # Already configured
STRIPE_SECRET_KEY="sk_live_..." # Update to live key
STRIPE_PUBLISHABLE_KEY="pk_live_..." # Update to live key
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
│   └── routes/           # API endpoints
├── prisma/               # Database schema
├── shared/              # Shared types
└── assets/              # Property images
```

## Setup Instructions
1. `npm install`
2. Configure `.env` with database and API keys
3. `npx prisma generate && npx prisma db push && npx prisma db seed`
4. `npm run dev`

## Production Deployment
The application is production-ready with minimal configuration:
- **Frontend**: Deploy to Vercel, Netlify, or CloudFront
- **Backend**: Deploy to Railway, Render, or DigitalOcean
- **Database**: Already hosted on Supabase (production-ready)

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
