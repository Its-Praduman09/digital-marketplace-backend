// src/schema/orders.ts
import { integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { products } from './products.js';
import { users } from './users.js';

export const orderStatusEnum = pgEnum('order_status', ['pending', 'completed', 'failed']);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  // USE THE ARROW FUNCTION CALLBACKS
  buyerId: uuid('buyer_id').references(() => users.id).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  amount: integer('amount').notNull(),
  status: orderStatusEnum('status').default('pending'),
  paymentId: text('payment_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});