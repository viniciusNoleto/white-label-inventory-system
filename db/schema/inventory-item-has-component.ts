import { decimal, integer, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core';
import { inventoryItems } from './inventory-items';

export const inventoryItemHasComponent = pgTable(
  'inventory_item_has_component',
  {
    inventoryItemId: integer('inventory_item_id').notNull().references(() => inventoryItems.id),
    componentInventoryItemId: integer('component_inventory_item_id').notNull().references(() => inventoryItems.id),
    quantityRequired: decimal('quantity_required', { precision: 15, scale: 4 }).notNull(),
    createdAt: timestamp('created_at'),
  },
  (t) => [primaryKey({ columns: [t.inventoryItemId, t.componentInventoryItemId] })],
);
