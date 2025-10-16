# 🚀 Palm Aire Court – Railway Production Playbook

Use this guide to provision, configure, deploy, and operate the Palm Aire Court application on Railway.

---

## 1. Architecture at a Glance

| Concern | Railway Resource | Notes |
| --- | --- | --- |
| **Web/API** | Node 18 service | Runs Express API + serves Vite build from `dist/public` |
| **Database** | PostgreSQL add-on | Minimum 1 vCPU / 1 GB RAM recommended for Prisma |
| **Assets** | Local `/assets` served statically | Consider CDN (Railway storage, Cloudflare R2) for high traffic |
| **Payments** | Stripe (external) | Live keys required for production |
| **CRM** | GoHighLevel (optional) | API key captured securely in Railway variables |

---

## 2. Environment Variables (copy from `.env.example`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | ✅ | Railway injects automatically; keep 5000 locally |
| `NODE_ENV` | ✅ | Set to `production` in Railway |
| `DATABASE_URL` | ✅ | Railway Postgres connection string (`?sslmode=require`) |
| `STRIPE_SECRET_KEY` | ✅ | Stripe live secret key |
| `STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe live publishable key |
| `SESSION_SECRET` | ✅ | 64+ char random string (used for JWT cookies + hashing helpers) |
| `GHL_API_KEY` | ⚠️ | Needed if CRM sync enabled |
| `VITE_API_URL` | ⚠️ | Optional – set only if hosting frontend on separate origin |

> 💡 Use Railway variable groups to separate **staging** and **production** credentials.

---

## 3. Build & Release Pipeline

1. **Link project**
   ```bash
   railway login
   railway link
   ```
2. **Provision Postgres** in the Railway dashboard (Add → Database → Postgres).
3. **Set environment variables** under `Variables` tab.
4. **Run database migrations & seed (one-time per environment)**
   ```bash
   railway run npm run prisma:migrate
   railway run npm run prisma:seed
   ```
5. **Deploy service** – Railway automatically runs the commands from `railway.toml`:
   ```toml
   [build]
   cmd = "npm ci && npm run build"

   [deploy]
   cmd = "npm start"
   ```
6. **Assign custom domain** (Railway dashboard → Settings → Domains) and configure DNS.

---

## 4. Operational Checklist

### Before Go-Live
- [ ] Stripe webhooks configured to point at `https://<domain>/api/payment-intents/webhook` (if/when implemented)
- [ ] Admin email inbox & phone number verified in copy and metadata
- [ ] Database backups scheduled in Railway (or external service)
- [ ] Error monitoring (Sentry, Logtail, etc.) connected to catch runtime issues
- [ ] Assets optimised (sizes under 1 MB) or moved to CDN for quicker loads

### Smoke Tests After Deploy
- [ ] `GET /health` returns `200` inside Railway logs
- [ ] `GET /api/units` returns inventory list
- [ ] Walk through booking flow (quote → hold → payment intent → booking)
- [ ] Confirm Stripe payment shows in dashboard
- [ ] Verify GoHighLevel contact/task created (if enabled)

### Ongoing Maintenance
- Run `npm outdated` monthly and upgrade dependencies
- Monitor Railway metrics (CPU, memory, cold starts)
- Rotate `SESSION_SECRET`, Stripe keys, and GoHighLevel keys every 6–12 months
- Export Postgres backups at least weekly

---

## 5. Helpful Commands

```bash
# Local development
npm install
npm run dev

# Production build preview
npm run build
NODE_ENV=production npm start

# Database utilities
npm run prisma:migrate   # apply migrations
npm run prisma:seed      # seed reference data
```

---

## 6. Incident Response Playbook

| Scenario | Action |
| --- | --- |
| Deployment fails | Inspect Railway build logs (`railway logs`) – confirm Prisma migrations succeeded |
| API returns 500 | Check Railway service logs; enable stack traces with temporary `NODE_ENV=development` override if needed |
| Postgres outage | Failover using Railway backup or restore from latest snapshot; update `DATABASE_URL` accordingly |
| Stripe webhook errors | Re-deliver from Stripe dashboard after confirming endpoint healthy |

---

## 7. Future Enhancements
- Introduce CI with GitHub Actions → trigger Railway deploys on `main`
- Add CDN-backed object storage for user/marketing assets
- Configure structured logging + alerting (Railway logs → Logtail/Sentry)
- Expand automated test coverage before adding new booking logic

---

Keep this file up to date as infrastructure evolves so new operators can deploy with confidence.
