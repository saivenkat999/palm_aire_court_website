# 🔧 Supabase Database Connection Setup

## Current Issue
We're getting "Tenant or user not found" error, which means the connection string format needs to be obtained directly from your Supabase dashboard.

## ✅ Step-by-Step Solution

### 1. Get the Exact Connection String
1. **Go to Supabase Dashboard**: https://app.supabase.com/
2. **Select your project**: fpnwnhwga1izxcnjazhd
3. **Navigate to**: Settings → Database
4. **Find "Connection string" section**
5. **Copy the "URI" string** (not individual parameters)

### 2. What to Look For
In the Database settings, you should see something like:
```
Connection string
URI: postgresql://postgres.fpnwnhwga1izxcnjazhd:[YOUR-PASSWORD]@[REGION].pooler.supabase.com:6543/postgres
```

### 3. Replace the Password
Replace `[YOUR-PASSWORD]` with: `palmairecourt`

### 4. Common Formats by Region
- **US West**: `aws-0-us-west-1.pooler.supabase.com:6543`
- **US East**: `aws-0-us-east-1.pooler.supabase.com:6543`
- **EU West**: `aws-0-eu-west-1.pooler.supabase.com:6543`
- **AP Southeast**: `aws-0-ap-southeast-1.pooler.supabase.com:6543`

### 5. Alternative: Direct Connection (Non-Pooled)
If pooled connection fails, try the direct connection:
```
postgresql://postgres:[PASSWORD]@db.fpnwnhwga1izxcnjazhd.supabase.co:5432/postgres?sslmode=require
```

### 6. Update Your .env File
Once you get the correct string, update your `.env` file:
```bash
DATABASE_URL="your-exact-connection-string-from-supabase"
```

### 7. Test the Connection
```bash
npm run setup:db
```

## 🚨 Troubleshooting

### If Still Getting "Tenant or user not found":
1. **Check password**: Ensure it's exactly `palmairecourt`
2. **Check project status**: Project might be paused (free tier)
3. **Check region**: Use the exact host from your dashboard
4. **Wait for provisioning**: New projects can take a few minutes

### If Getting "Can't reach database server":
1. **Check internet connection**
2. **Try direct connection instead of pooled**
3. **Check firewall settings**

### If Getting SSL errors:
1. **Add**: `?sslmode=require` to the end
2. **Or try**: `?ssl=true`

## 📞 Next Steps
1. Get the exact connection string from your Supabase dashboard
2. Update the DATABASE_URL in `.env`
3. Run `npm run setup:db`
4. If issues persist, we can try the direct connection method

## 🔄 Alternative: Use Supabase Client
If database connection continues to fail, we can temporarily use Supabase's REST API instead of direct PostgreSQL connection for the initial setup.
