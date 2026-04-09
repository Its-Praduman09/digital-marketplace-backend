import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is missing in .env file");
}

export default defineConfig({
  // Pointing to a folder allows you to split Users, Products, and Orders into different files
  schema: "./src/db/schema/*.ts",
  out: "./drizzle", // Standard folder for migrations
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});