# 🚀 Palm Aire Court - Production Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Database Setup (CRITICAL)
Your current SQLite database is **NOT suitable for production**. Choose one:

#### Option A: Supabase (Recommended - Easiest)
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project or use existing: `jmablugqutnyyqbqdvub`
3. Get your PostgreSQL connection string from Settings > Database
4. Update `.env.production` with the connection string

#### Option B: Other PostgreSQL Providers
- **Neon**: https://neon.tech/
- **Railway**: https://railway.app/
- **PlanetScale**: https://planetscale.com/
- **AWS RDS**: https://aws.amazon.com/rds/

### 2. Environment Variables Setup
Create production environment variables:

```bash
# Copy the template
cp .env.example .env.production

# Edit with your production values
# DATABASE_URL - PostgreSQL connection string
# STRIPE_SECRET_KEY - Live Stripe keys (not test)
# STRIPE_PUBLISHABLE_KEY - Live Stripe publishable key
# SESSION_SECRET - Generate a secure random string
```

### 3. Stripe Configuration
1. **Switch to Live Mode** in Stripe Dashboard
2. Get Live API keys from https://dashboard.stripe.com/apikeys
3. Update webhook endpoints for production domain
4. Test payment flow in live mode

### 4. Database Migration & Seeding
```bash
# Deploy database schema
npm run prisma:migrate

# Seed with production data
npm run prisma:seed
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Option 2: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 3: Docker + DigitalOcean/AWS
```bash
# Build Docker image
npm run docker:build

# Deploy to your preferred cloud provider
```

### Option 4: Traditional VPS
```bash
# On your server
git clone [your-repo]
cd PalmAireCourt
npm install --production
npm run build
npm run deploy:db
npm start
```

## 🔒 Security Checklist

- [ ] Use HTTPS (SSL certificate)
- [ ] Set secure SESSION_SECRET
- [ ] Use production Stripe keys
- [ ] Configure proper CORS
- [ ] Set up rate limiting
- [ ] Enable database backups
- [ ] Configure monitoring/logging

## 📊 Monitoring Setup

### Health Check
Your app includes a health check endpoint:
```
GET /health
```

### Database Monitoring
- Monitor connection pool usage
- Set up backup schedules
- Monitor query performance

## 🔧 Post-Deployment Tasks

1. **Test All Features**
   - [ ] Unit booking flow
   - [ ] Payment processing
   - [ ] Email notifications
   - [ ] Admin dashboard
   - [ ] Photo galleries

2. **Performance Optimization**
   - [ ] Enable CDN for assets
   - [ ] Configure caching headers
   - [ ] Optimize images
   - [ ] Enable gzip compression

3. **SEO & Analytics**
   - [ ] Add Google Analytics
   - [ ] Configure meta tags
   - [ ] Submit sitemap to Google
   - [ ] Set up Google Business Profile

## 🚨 Critical Production Issues to Address

### Database Migration
**Current**: SQLite file (`dev.db`) 
**Required**: PostgreSQL for production

### Asset Handling
**Current**: Local assets in `/assets` folder
**Consider**: CDN for better performance (Cloudinary, AWS S3)

### Session Management
**Current**: In-memory sessions
**Required**: Redis/Database sessions for production

### Error Handling
**Required**: Proper error logging (Sentry, LogRocket)

### Backup Strategy
**Required**: Automated database backups

## 📱 Mobile Responsiveness
✅ Already implemented with Tailwind CSS

## 🔄 CI/CD Pipeline (Optional)
Consider setting up GitHub Actions for automated deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run deploy:db
      # Deploy to your platform
```

## 🎯 Immediate Next Steps

1. **Set up PostgreSQL database**
2. **Update environment variables**
3. **Switch Stripe to live mode**
4. **Choose deployment platform**
5. **Run database migrations**
6. **Test payment flow**
7. **Configure domain/SSL**

## 📞 Support & Maintenance

- Regular database backups
- Monitor error logs
- Update dependencies monthly
- Security patches
- Performance monitoring
