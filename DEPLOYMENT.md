# 🚀 Palm Aire Court – Railway Production Playbook

Use this guide to provision, configure, deploy, and operate the Palm Aire Court application on Railway with Supabase.

---

## 1. Architecture at a Glance

| Concern | Resource | Notes |
| --- | --- | --- |
| **Web/API** | Railway Node 18 service | Runs Express API + serves Vite build from `dist/public` |
| **Database** | Supabase PostgreSQL | Fully managed with auto-scaling, backups, and APIs |
| **Assets** | Local `/assets` served statically | Consider CDN (Cloudflare R2, Supabase Storage) for high traffic |
| **Payments** | Stripe (external) | Live keys required for production |
| **CRM** | GoHighLevel (optional) | API key captured securely in Railway variables |

---

## 2. Environment Variables (copy from `.env.example`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | ✅ | Railway injects automatically; keep 5000 locally |
| `NODE_ENV` | ✅ | Set to `production` in Railway |
| `SUPABASE_URL` | ✅ | Supabase project URL from Project Settings -> API |
| `SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key for client-side access |
| `STRIPE_SECRET_KEY` | ✅ | Stripe live secret key |
| `STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe live publishable key |
| `SESSION_SECRET` | ✅ | 64+ char random string (used for JWT cookies + hashing helpers) |
| `GHL_API_KEY` | ⚠️ | Needed if CRM sync enabled |

> 💡 Use Railway variable groups to separate **staging** and **production** credentials.

---

## 3. Build & Release Pipeline

1. **Link project**
   ```bash
   railway login
   railway link
   ```
2. **Set up Supabase** (see SUPABASE-SETUP.md for detailed instructions)
   - Create a Supabase project at https://app.supabase.com
   - Set up database schema using SQL editor or migrations
   - Get your project URL and anon key
   
3. **Set environment variables** under Railway's `Variables` tab (see section 2 above).

4. **Deploy service** – Railway automatically runs the commands from `railway.toml`:
   ```toml
   [build]
   cmd = "npm ci && npm run build"

   [deploy]
   cmd = "npm start"
   ```
5. **Assign custom domain** (Railway dashboard → Settings → Domains) and configure DNS.

---

## 4. Operational Checklist

### Before Go-Live
- [ ] Stripe webhooks configured to point at `https://<domain>/api/payment-intents/webhook` (if/when implemented)
- [ ] Admin email inbox & phone number verified in copy and metadata
- [ ] Supabase backups verified (automatic on all paid plans)
- [ ] Error monitoring (Sentry, Logtail, etc.) connected to catch runtime issues
- [ ] Assets optimised (sizes under 1 MB) or moved to CDN for quicker loads
- [ ] Supabase Row Level Security (RLS) policies reviewed and enabled

### Smoke Tests After Deploy
- [ ] `GET /health` returns `200` inside Railway logs
- [ ] `GET /api/units` returns inventory list
- [ ] Walk through booking flow (quote → hold → payment intent → booking)
- [ ] Confirm Stripe payment shows in dashboard
- [ ] Verify GoHighLevel contact/task created (if enabled)
- [ ] Check Supabase dashboard for data writes

### Ongoing Maintenance
- Run `npm outdated` monthly and upgrade dependencies
- Monitor Railway metrics (CPU, memory, cold starts)
- Rotate `SESSION_SECRET`, Stripe keys, and GoHighLevel keys every 6–12 months
- Review Supabase usage and upgrade plan if needed (free tier: 500MB DB, 2GB bandwidth)

---

## 5. Helpful Commands

```bash
# Local development
npm install
npm run dev

# Production build preview
npm run build
NODE_ENV=production npm start
```

---

## 6. Incident Response Playbook

| Scenario | Action |
| --- | --- |
| Deployment fails | Inspect Railway build logs (`railway logs`) – confirm environment variables are set correctly |
| API returns 500 | Check Railway service logs; verify Supabase credentials are correct |
| Supabase connection errors | Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct; check Supabase project status |
| Stripe webhook errors | Re-deliver from Stripe dashboard after confirming endpoint healthy |

---

## 7. Future Enhancements
- Introduce CI with GitHub Actions → trigger Railway deploys on `main`
- Use Supabase Storage for user/marketing assets instead of local storage
- Enable Supabase Auth for admin panel authentication
- Configure structured logging + alerting (Railway logs → Logtail/Sentry)
- Expand automated test coverage before adding new booking logic
- Consider Supabase Edge Functions for serverless background jobs

---

Keep this file up to date as infrastructure evolves so new operators can deploy with confidence.
