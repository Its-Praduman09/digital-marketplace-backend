import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema/index.js';

// 1. Create a connection pool 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Recommended for a marketplace to handle multiple users
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 2. Initialize Drizzle with the modular schema
export const db = drizzle(pool, { schema });

// 3. Professional Connection Tester
export const testDbConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('🐘 PostgreSQL: Connected successfully to digital_market_db');
    client.release(); // Important: release the client back to the pool immediately
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
};