# Palm Aire Court Booking System

A modern, full-stack booking system for Palm Aire Court vacation rentals, built with TypeScript, React, and Supabase.

## 🌟 Features

- **Modern React Frontend**: Built with TypeScript, Vite, and Tailwind CSS
- **Robust Backend**: Express.js API with TypeScript and Supabase
- **Secure Payments**: Stripe integration for payment processing
- **CRM Integration**: GoHighLevel integration for customer management
- **Real-time Availability**: Dynamic booking calendar with conflict detection
- **Responsive Design**: Mobile-first design that works on all devices
- **Database**: Supabase (PostgreSQL with auto-generated APIs)

## 🏗️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form for form handling
- Stripe Elements for payment UI

### Backend
- Node.js with Express and TypeScript
- Prisma ORM for database management
- PostgreSQL database
- Stripe for payment processing
- GoHighLevel API for CRM integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Railway account (or any managed PostgreSQL service)
- Stripe account (for payments)
- GoHighLevel account (optional, for CRM)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/palm-aire-court.git
   cd palm-aire-court
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your actual API keys and database URL in the `.env` file.

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 📊 Database Schema

The system includes the following main entities:
- **Units**: Vacation rental properties
- **Customers**: Guest information
- **Bookings**: Reservation records
- **Rate Plans**: Pricing configurations
- **Seasons**: Seasonal pricing adjustments
- **Fees**: Additional charges
- **Holds**: Temporary reservations

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Port for the web server (Railway injects automatically) | ⚠️ Optional |
| `NODE_ENV` | Runtime environment (`development` / `production`) | ✅ |
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key (test or live) | ✅ |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (test or live) | ✅ |
| `SESSION_SECRET` | 64+ character random string for signing | ✅ |
| `GHL_API_KEY` | GoHighLevel API key | ⚠️ Optional |
| `VITE_API_URL` | Public API origin (leave empty for same-origin) | ⚠️ Optional |

### Database Setup

1. Provision a PostgreSQL instance (Railway add-on or another managed service)
2. Copy the connection string into `.env`
3. Apply schema with `npm run prisma:migrate`

### Stripe Setup

1. Create a Stripe account
2. Get your test API keys from the Stripe Dashboard
3. For production, replace with live keys

### GoHighLevel Integration (Optional)

1. Create a GoHighLevel app
2. Generate an API key
3. The system will automatically create contacts and attempt calendar events

## 🚀 Deployment

Railway is the target production platform.

```bash
# 1. Authenticate and link project
railway login
railway link

# 2. Provision Postgres (Railway dashboard → Add New → Database → Postgres)

# 3. Deploy from the CLI
railway up

# Railway uses railway.toml
# build:  npm ci && npm run build
# deploy: npm start
```

To preview the production build locally without Railway:

```bash
npm run build
NODE_ENV=production npm start
```

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── types/         # TypeScript type definitions
│   └── index.html
├── server/                 # Express backend
│   ├── routes/            # API route handlers
│   ├── lib/               # Backend utilities
│   ├── index.ts           # Server entry point
│   └── vite.ts            # Vite development integration
├── prisma/                # Database schema and migrations
└── assets/                # Static assets (images, etc.)
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend
```

## 📝 API Documentation

The API provides the following main endpoints:

- `GET /api/units` - Get all available units
- `GET /api/units/:slug` - Get specific unit details
- `POST /api/bookings` - Create a new booking
- `GET /api/availability` - Check availability for dates
- `GET /api/pricing` - Calculate pricing for a stay
- `POST /api/payment-intents` - Create Stripe payment intent

## 🔒 Security

- Environment variables for sensitive data
- Stripe webhook signature verification
- Input validation on all API endpoints
- CORS configuration for production
- Rate limiting on API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@palmairecourt.com or create an issue on GitHub.

## 🔄 Changelog

### v1.0.0 (Current)
- Initial release with full booking functionality
- Stripe payment integration
- GoHighLevel CRM integration
- Responsive design
- Real-time availability checking
