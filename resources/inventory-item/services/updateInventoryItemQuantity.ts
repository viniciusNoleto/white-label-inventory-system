import { appClient } from '@/src/utils/app-client';
import type { IInventoryItem } from '../models/InventoryItem';
import type { PayloadBody } from '@/src/shared/types/api';

export type UpdateInventoryItemQuantityServicePayload = {
  quantity: number;
};

export function updateInventoryItemQuantityService({
  itemId,
  body,
}: PayloadBody<UpdateInventoryItemQuantityServicePayload> & { itemId: string }) {
  return appClient.patch<IInventoryItem>(`/api/inventory-items/${itemId}`, { body });
}
