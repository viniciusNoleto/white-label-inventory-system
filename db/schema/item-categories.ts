import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const itemCategories = pgTable('item_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  colorHex: varchar('color_hex', { length: 7 }).notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});
