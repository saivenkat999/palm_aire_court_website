# Palm Aire Court Booking System

A modern, full-stack booking system for Palm Aire Court vacation rentals in Phoenix, Arizona. Built with TypeScript, React, Express, and Supabase.

## 🌟 Features

- **17 Units**: 2 Two-Bedroom Cottages, 4 One-Bedroom Cottages, 11 Standard Units
- **Modern React Frontend**: Built with TypeScript, Vite, Tailwind CSS, and shadcn/ui
- **Robust Backend**: Express.js API with TypeScript and Supabase PostgreSQL
- **Secure Payments**: Stripe integration for payment processing
- **CRM Integration**: GoHighLevel integration for customer management
- **Real-time Availability**: Dynamic booking calendar with hold system to prevent double-booking
- **Responsive Design**: Mobile-first design that works on all devices

## 🏗️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS + shadcn/ui components
- Wouter for routing
- TanStack Query for data fetching
- React Hook Form + Zod for validation
- Stripe Elements for payment UI

### Backend
- Node.js with Express and TypeScript
- Supabase (PostgreSQL) for database
- Stripe for payment processing
- GoHighLevel API for CRM integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Stripe account (for payments)
- GoHighLevel account (optional, for CRM)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saivenkat999/palm_aire_court_website.git
   cd palm_aire_court_website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your actual API keys in the `.env` file.

4. **Set up Supabase database**
   - Create a new project at [https://app.supabase.com](https://app.supabase.com)
   - Copy your project URL and anon key to `.env`
   - Run the SQL setup script `FRESH-DATABASE-SETUP.sql` in Supabase SQL Editor
   - See [SUPABASE-SETUP.md](./SUPABASE-SETUP.md) for detailed instructions

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 📊 Database Schema

The system includes the following main entities:
- **units**: 17 vacation rental properties (2 2BR cottages, 4 1BR cottages, 11 units)
- **customers**: Guest information with first_name, last_name, email, phone
- **bookings**: Reservation records with check_in, check_out, total_cents
- **rate_plans**: Pricing (nightly, weekly, monthly, four_month)
- **seasons**: Seasonal pricing adjustments (discount_pct)
- **fees**: Additional charges (per_stay flag)
- **holds**: Temporary reservations to prevent double-booking
- **payments**: Stripe payment tracking (stripe_intent_id, amount_cents)

All tables use **snake_case** column naming (e.g., `created_at`, `unit_id`, `first_name`).

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Port for the web server (default: 5000) | ⚠️ Optional |
| `NODE_ENV` | Runtime environment (`development` / `production`) | ✅ |
| `SUPABASE_URL` | Supabase project URL | ✅ |
| `SUPABASE_ANON_KEY` | Supabase anonymous/public key | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key (test or live) | ✅ |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (test or live) | ✅ |
| `SESSION_SECRET` | Random string for session signing | ✅ |
| `GHL_API_KEY` | GoHighLevel API key | ⚠️ Optional |

See `.env.example` for a complete template.

## 🚀 Deployment

Railway is the recommended deployment platform.

### Deploy to Railway

1. **Create a Railway account** at [https://railway.app](https://railway.app)

2. **Install Railway CLI and authenticate**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

3. **Link your project**
   ```bash
   railway link
   ```

4. **Set environment variables** in Railway dashboard
   - Navigate to your service → Variables tab
   - Add all variables from your `.env` file

5. **Deploy**
   ```bash
   railway up
   ```

Railway will automatically use `railway.toml` for build and deploy configuration.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components + shadcn/ui
│   │   ├── pages/         # Page components (Home, Stays, Booking, etc.)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── data/          # Static data (amenities, faqs)
│   │   └── types/         # TypeScript type definitions
│   └── index.html
├── server/                 # Express backend
│   ├── routes/            # API route handlers (api.ts, admin.ts)
│   ├── lib/               # Backend utilities (supabase, stripe, ghl)
│   ├── index.ts           # Server entry point
│   └── routes.ts          # Route registration
├── assets/                # Static assets (unit photos)
├── supabase/              # Supabase migrations
├── FRESH-DATABASE-SETUP.sql  # Complete database schema setup
└── SUPABASE-SETUP.md      # Supabase setup guide
```

## 📝 API Documentation

The API provides the following main endpoints:

- `GET /api/units` - Get all active units
- `GET /api/units/:slug` - Get specific unit details
- `GET /api/rate-plans` - Get all rate plans
- `GET /api/seasons` - Get seasonal pricing
- `GET /api/fees` - Get additional fees
- `POST /api/availability/check` - Check unit availability for date range
- `POST /api/pricing/calculate` - Calculate pricing for a stay
- `POST /api/holds` - Create temporary hold (10 min expiration)
- `DELETE /api/holds/:id` - Release a hold
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get booking details
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `GET /api/payments/config` - Get Stripe publishable key

## 🔒 Security

- Environment variables for all sensitive data
- Row Level Security (RLS) enabled on all Supabase tables
- Input validation using Zod schemas
- Secure payment processing with Stripe
- CORS configuration for production
- No service role key exposed to client

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, create an issue on GitHub.

## 🔄 Recent Updates

### Latest (October 2025)
- ✅ Migrated to fresh Supabase project with proper snake_case schema
- ✅ 17 units total (2 2BR cottages, 4 1BR cottages, 11 standard units)
- ✅ Removed "Trailer" terminology, replaced with "Units"
- ✅ Complete booking system with Stripe payments
- ✅ Real-time availability with hold system
- ✅ GoHighLevel CRM integration
- ✅ Responsive design with real property photos

