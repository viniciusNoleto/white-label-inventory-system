import { appClient } from '@/src/utils/app-client';
import type { IInventoryItem } from '../models/InventoryItem';
import type { PayloadBody } from '@/src/shared/types/api';

export type BuildInventoryItemServicePayload = {
  quantity: number;
};

export function buildInventoryItemService({
  itemId,
  body,
}: PayloadBody<BuildInventoryItemServicePayload> & { itemId: string }) {
  return appClient.post<IInventoryItem>(`/api/inventory-items/${itemId}/build`, { body });
}
