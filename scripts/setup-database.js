#!/usr/bin/env node

/**
 * Database Setup Script for Palm Aire Court
 * This script helps set up the database for both development and production
 */

import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function runPrismaCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Running: npx prisma ${command}`);
    
    const process = spawn('npx', ['prisma', ...command.split(' ')], {
      stdio: 'inherit',
      shell: true
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Successfully ran: npx prisma ${command}`);
        resolve(code);
      } else {
        console.error(`❌ Failed to run: npx prisma ${command}`);
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}

async function setupDatabase() {
  console.log('🏗️  Setting up Palm Aire Court Database...\n');

  // Test connection first
  const isConnected = await testConnection();
  
  if (!isConnected) {
    console.log('\n📋 Database Connection Troubleshooting:');
    console.log('1. Check your DATABASE_URL in .env file');
    console.log('2. Make sure your Supabase project is active');
    console.log('3. Verify the database password is correct');
    console.log('4. Check if your IP is whitelisted (if applicable)');
    console.log('\nExample DATABASE_URL for Supabase:');
    console.log('postgresql://postgres:yourpassword@db.project-ref.supabase.co:5432/postgres?schema=public&sslmode=require');
    return;
  }

  try {
    // Generate Prisma client
    await runPrismaCommand('generate');
    
    // Push schema to database
    await runPrismaCommand('db push --force-reset');
    
    // Seed the database
    console.log('🌱 Seeding database...');
    await runPrismaCommand('db seed');
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('Your Palm Aire Court database is ready for production!');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the setup
setupDatabase().catch(console.error);
