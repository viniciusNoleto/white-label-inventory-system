import { decimal, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { units } from './units';

export const inventoryItems = pgTable('inventory_items', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  quantity: decimal('quantity', { precision: 15, scale: 4 }).notNull().default('0'),
  unit_id: integer('unit_id').notNull().references(() => units.id),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
});
