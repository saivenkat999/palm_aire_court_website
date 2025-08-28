# Palm Aire Court - Complete Project Documentation

*Last Updated: August 28, 2025*

## Project Overview
Palm Aire Court is a full-stack vacation rental booking platform for a senior community in Phoenix, Arizona. It provides online booking for 22 units, integrated payment, customer management, and admin tools.

## Architecture
- **Frontend**: React 18 + TypeScript, Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **UI**: TailwindCSS + shadcn/ui
- **Routing**: Wouter
- **State**: TanStack Query
- **Payments**: Stripe
- **CRM**: GoHighLevel
- **Validation**: Zod

## Database Schema
- Units, RatePlans, Bookings, Customers, Payments, Holds, Seasons, Fees

## Features
- 22 units with real photos
- Booking system with date selection, pricing, and Stripe payments
- Customer management and CRM integration
- Real-time availability and hold system
- Dynamic pricing with seasonal rates
- Responsive design and interactive Google Maps
- All placeholder images replaced
- All cancellation policies updated

## API Endpoints
- `/api/units` - Unit management
- `/api/bookings` - Reservations
- `/api/customers` - Customer data
- `/api/payments` - Stripe payments
- `/api/availability` - Real-time checks
- `/api/holds` - Temporary reservations
- `/api/contacts` - CRM integration
- `/api/admin` - Admin functions

## Configuration for Production
- Update Stripe, GoHighLevel, and email service keys
- Set up SMTP for real email delivery
- Configure domain, SSL, and DNS
- Enable Vite production optimizations
- Set up CDN for assets
- Enable CORS, rate limiting, and security headers
- Set up error tracking and analytics
- Configure database backups

## File Structure
- `client/` - React frontend
- `server/` - Express backend
- `prisma/` - Database schema and migrations
- `shared/` - Shared types
- `assets/` - Property images

## Setup
1. `npm install`
2. Configure `.env`
3. `npx prisma generate && npx prisma db push && npx prisma db seed`
4. `npm run dev`

## Production Deployment
- Update environment variables
- Use Vercel/Netlify for frontend, Railway/Render for backend
- Database is production-ready on Supabase

## Contact
- Address: 9616 N 12th St, Phoenix, AZ 85020
- Phone: 480-993-8431
- Email: palmairecourt@outlook.com

---
*This doc reflects the current codebase as of August 28, 2025.*
