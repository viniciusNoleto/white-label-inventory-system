import { appClient } from '@/src/utils/app-client';
import type { IInventoryItem } from '../models/InventoryItem';
import type { PaginatedResponse, PayloadQuery } from '@/src/shared/types/api';
import type { QueryFnCtx } from '@/src/shared/types/tanstack';

export type GetInventoryItemsServiceQuery = {
  search?: string;
  page?: number;
  per_page?: number;
};

export const GET_INVENTORY_ITEMS_KEY = ['get-inventory-items'];

export function getInventoryItemsService({ signal, query }: QueryFnCtx & PayloadQuery<GetInventoryItemsServiceQuery>) {
  const params = new URLSearchParams();

  if (query?.search) params.set('search', query.search);
  if (query?.page) params.set('page', String(query.page));
  if (query?.per_page) params.set('per_page', String(query.per_page));

  const qs = params.toString();

  return appClient.get<PaginatedResponse<IInventoryItem>>(`/api/inventory-items${qs ? `?${qs}` : ''}`, { signal });
}
