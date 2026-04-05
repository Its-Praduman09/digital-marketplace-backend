import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // "name" is the modern professional standard
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  isSeller: boolean('is_seller').default(false),
  
  // Professional Audit Columns
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()), // Auto-updates on every save
  deletedAt: timestamp('deleted_at', { withTimezone: true }), // For Soft Deletes
});