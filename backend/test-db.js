// Test script: run with node test-db.js
require('dotenv').config();

console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');

const { Pool, neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { PrismaClient } = require('@prisma/client');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    const result = await prisma.user.findMany({ take: 1 });
    console.log('Connection SUCCESS!');
    console.log('Users count:', result.length);
  } catch (error) {
    console.error('Connection FAILED:', error.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

test();
