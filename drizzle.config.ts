import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
dotenv.config()
export default defineConfig({
  // Pointing to the index file that exports all your modular schemas
  schema: './src/schema/index.ts', 
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Adding this ensures your migrations are clean and professional
  verbose: true,
  strict: true,
});