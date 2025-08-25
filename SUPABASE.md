Supabase setup (Postgres + Prisma)

1) Create a Supabase project
   - Note your Project Ref (e.g., xyzcompany) and the database password.

2) Set environment variables in `.env`
   - DATABASE_URL=postgresql://postgres:<PASSWORD>@<PROJECT-REF>.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
   - STRIPE_* keys as before
   - Optionally SUPABASE_URL / SUPABASE_ANON_KEY if you plan to use Supabase Client in the frontend

3) Apply the Prisma schema
   - npm run prisma:migrate  (first time, run `npx prisma migrate deploy` or `npx prisma db push`)

4) Seed data
   - npm run prisma:seed

5) Run the app
   - npm run dev

Notes
- Prisma connects to Supabase’s Postgres directly; no Supabase client is needed server-side.
- Use pgBouncer (as shown in the URL) to keep connections efficient.
- For local development without Supabase, you can use a local Postgres and set DATABASE_URL accordingly.
