// @ts-nocheck
import type { MovementLineInputDto } from './movementLineInputDto';

export interface CreateMovementDto {
  idempotencyKey: string;
  documentDate: string;
  type: string;
  notes?: string;
  lines: MovementLineInputDto[];
}
