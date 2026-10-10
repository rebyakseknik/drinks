// @ts-nocheck
import type { MovementLineInputDto } from './movementLineInputDto';

export interface CreateMovementDto {
  idempotencyKey: string;
  documentDate: string;
  type: string;
  /** @maxLength 1000 */
  notes?: string;
  /**
     * @minItems 1
     * @maxItems 200
     */
  lines: MovementLineInputDto[];
}
