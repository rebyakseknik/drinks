// @ts-nocheck
import type { MovementDocumentResponseDto } from './movementDocumentResponseDto';

export interface MovementListResponseDto {
  items: MovementDocumentResponseDto[];
  total: number;
  page: number;
  totalPages: number;
}
