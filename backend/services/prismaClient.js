// Simple Prisma client for Prisma 5
// Database connection is handled by Prisma using DATABASE_URL from .env
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = { prisma };
