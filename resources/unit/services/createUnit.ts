import { appClient } from '@/src/utils/app-client';
import type { IUnit } from '../models/Unit';
import type { PayloadBody } from '@/src/shared/types/api';

export type CreateUnitServicePayload = {
  name: string;
  abbreviation: string;
};

export function createUnitService({ body }: PayloadBody<CreateUnitServicePayload>) {
  return appClient.post<IUnit>('/api/units', { body });
}
