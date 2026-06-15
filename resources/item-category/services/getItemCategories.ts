import { appClient } from '@/src/utils/app-client';
import type { IItemCategory } from '../models/ItemCategory';
import type { QueryFnCtx } from '@/src/shared/types/tanstack';

export const GET_ITEM_CATEGORIES_KEY = ['get-item-categories'];

export function getItemCategoriesService({ signal }: QueryFnCtx) {
  return appClient.get<IItemCategory[]>('/api/item-categories', { signal });
}
