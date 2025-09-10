/**
 * Supabase Database Connection Guide
 * 
 * This guide helps you get the correct DATABASE_URL for your Supabase project
 */

import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Supabase Database Configuration Checker\n');

console.log('Current Configuration:');
console.log('PROJECT_URL:', process.env.SUPABASE_URL);
console.log('ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Set ✅' : 'Missing ❌');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

console.log('\n📋 To get your correct DATABASE_URL:');
console.log('1. Go to your Supabase Dashboard: https://app.supabase.com/');
console.log('2. Select your project: fpnwnhwga1izxcnjazhd');
console.log('3. Go to Settings → Database');
console.log('4. Look for "Connection string" section');
console.log('5. Copy the "URI" format (not the individual parameters)');

console.log('\n🔗 Your DATABASE_URL should look like:');
console.log('postgresql://postgres.fpnwnhwga1izxcnjazhd:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres');

console.log('\n⚠️  Common Issues:');
console.log('1. Wrong host: Use the pooler URL (ends with .pooler.supabase.com:6543)');
console.log('2. Missing password: Replace [YOUR-PASSWORD] with: palmairecourt');
console.log('3. Missing SSL: Add ?sslmode=require at the end');

console.log('\n🛠️  Try this DATABASE_URL format:');
console.log('DATABASE_URL="postgresql://postgres.fpnwnhwga1izxcnjazhd:palmairecourt@aws-0-us-west-1.pooler.supabase.com:6543/postgres?sslmode=require"');

console.log('\n📝 Next Steps:');
console.log('1. Update your .env file with the correct DATABASE_URL');
console.log('2. Run: npm run setup:db');
console.log('3. If issues persist, check Supabase project is not paused');
