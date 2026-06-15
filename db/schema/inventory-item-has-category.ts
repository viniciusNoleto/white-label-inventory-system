import { integer, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core';
import { inventoryItems } from './inventory-items';
import { itemCategories } from './item-categories';

export const inventoryItemHasCategory = pgTable(
  'inventory_item_has_category',
  {
    inventoryItemId: integer('inventory_item_id').notNull().references(() => inventoryItems.id),
    itemCategoryId: integer('item_category_id').notNull().references(() => itemCategories.id),
    createdAt: timestamp('created_at'),
  },
  (t) => [primaryKey({ columns: [t.inventoryItemId, t.itemCategoryId] })],
);
