import { appClient } from '@/src/utils/app-client';
import type { IItemCategory } from '../models/ItemCategory';
import type { PayloadBody } from '@/src/shared/types/api';

export type CreateItemCategoryServicePayload = {
  name: string;
  color_hex: string;
};

export function createItemCategoryService({ body }: PayloadBody<CreateItemCategoryServicePayload>) {
  return appClient.post<IItemCategory>('/api/item-categories', { body });
}
