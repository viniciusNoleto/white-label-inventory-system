import { appClient } from '@/src/utils/app-client';
import type { IUnit } from '../models/Unit';
import type { QueryFnCtx } from '@/src/shared/types/tanstack';

export const GET_UNITS_KEY = ['get-units'];

export function getUnitsService({ signal }: QueryFnCtx) {
  return appClient.get<IUnit[]>('/api/units', { signal });
}
