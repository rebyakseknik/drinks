// @ts-nocheck
import type { MovementLineCreatorDto } from './movementLineCreatorDto';
import type { MovementLineResponseDto } from './movementLineResponseDto';

export interface MovementDocumentResponseDto {
  id: string;
  documentDate: string;
  type: string;
  /** @nullable */
  notes: string | null;
  status: string;
  /** @nullable */
  reversalOfId: string | null;
  /** @nullable */
  createdBy: MovementLineCreatorDto | null;
  createdAt: string;
  lines: MovementLineResponseDto[];
}
