/**
 * Supabase Project Diagnostic Tool
 * This script helps diagnose connection issues with your Supabase project
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import https from 'https';

const execAsync = promisify(exec);

const PROJECT_REF = 'vnaqagapztpfsbbojqhp';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuYXFhZ2FwenRwZnNiYm9qcWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDYxNjMsImV4cCI6MjA3MzA4MjE2M30.m5-whQ5Jlu6A2DEhI9JJwoqr1152v_5fvOegkG20-nQ';

console.log('🔍 Supabase Project Diagnostic\n');
console.log(`Project Reference: ${PROJECT_REF}`);
console.log(`Project URL: ${SUPABASE_URL}\n`);

// Test 1: DNS Resolution
async function testDNS() {
  console.log('1️⃣ Testing DNS Resolution...');
  try {
    const { stdout } = await execAsync(`nslookup ${PROJECT_REF}.supabase.co`);
    if (stdout.includes('Non-existent domain')) {
      console.log('❌ DNS Resolution Failed - Project might not exist or URL is incorrect');
      return false;
    } else {
      console.log('✅ DNS Resolution Successful');
      return true;
    }
  } catch (error) {
    console.log('❌ DNS Resolution Failed:', error.message);
    return false;
  }
}

// Test 2: HTTPS Connection
async function testHTTPS() {
  console.log('\n2️⃣ Testing HTTPS Connection...');
  return new Promise((resolve) => {
    const req = https.get(SUPABASE_URL, (res) => {
      console.log(`✅ HTTPS Connection Successful (Status: ${res.statusCode})`);
      resolve(true);
    });
    
    req.on('error', (error) => {
      console.log('❌ HTTPS Connection Failed:', error.message);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ HTTPS Connection Timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// Test 3: Supabase API
async function testSupabaseAPI() {
  console.log('\n3️⃣ Testing Supabase REST API...');
  return new Promise((resolve) => {
    const options = {
      hostname: `${PROJECT_REF}.supabase.co`,
      path: '/rest/v1/',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`
      }
    };
    
    const req = https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Supabase REST API Accessible');
          resolve(true);
        } else {
          console.log(`❌ Supabase REST API Error (Status: ${res.statusCode})`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Supabase REST API Failed:', error.message);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Supabase REST API Timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// Test 4: Database Connection Formats
function suggestDatabaseURLs() {
  console.log('\n4️⃣ Possible Database Connection URLs to try:\n');
  
  const passwords = ['palmairecourt'];
  const hosts = [
    `db.${PROJECT_REF}.supabase.co:5432`,
    `aws-0-us-west-1.pooler.supabase.com:6543`,
    `aws-0-us-east-1.pooler.supabase.com:6543`,
    `aws-0-eu-west-1.pooler.supabase.com:6543`
  ];
  
  passwords.forEach(password => {
    hosts.forEach((host, index) => {
      const dbUrl = `postgresql://postgres:${password}@${host}/postgres?sslmode=require`;
      console.log(`${index + 1}. DATABASE_URL="${dbUrl}"`);
    });
  });
}

// Main diagnostic function
async function runDiagnostic() {
  const dnsResult = await testDNS();
  const httpsResult = await testHTTPS();
  const apiResult = await testSupabaseAPI();
  
  console.log('\n📊 Diagnostic Summary:');
  console.log(`DNS Resolution: ${dnsResult ? '✅' : '❌'}`);
  console.log(`HTTPS Connection: ${httpsResult ? '✅' : '❌'}`);
  console.log(`Supabase API: ${apiResult ? '✅' : '❌'}`);
  
  if (!dnsResult) {
    console.log('\n🚨 Critical Issue: Project URL cannot be resolved');
    console.log('Possible causes:');
    console.log('1. Project reference ID is incorrect');
    console.log('2. Project has been deleted or suspended');
    console.log('3. Project is still being provisioned');
    console.log('\n💡 Solution: Check your Supabase dashboard for the correct project URL');
  } else if (!httpsResult) {
    console.log('\n🚨 Network Issue: Cannot connect to Supabase');
    console.log('Possible causes:');
    console.log('1. Firewall blocking connection');
    console.log('2. Project is paused (free tier)');
    console.log('3. Network connectivity issues');
  } else if (!apiResult) {
    console.log('\n🚨 API Issue: Supabase project not accessible');
    console.log('Possible causes:');
    console.log('1. Project is paused');
    console.log('2. Invalid API key');
    console.log('3. Project configuration issue');
  }
  
  suggestDatabaseURLs();
  
  console.log('\n📋 Next Steps:');
  console.log('1. Verify project URL in Supabase dashboard');
  console.log('2. Check if project is active (not paused)');
  console.log('3. Try the suggested DATABASE_URL formats');
  console.log('4. Check Supabase project settings → Database');
}

runDiagnostic().catch(console.error);
