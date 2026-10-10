// @ts-nocheck
import type { ClosingCreatorDto } from './closingCreatorDto';

export interface ClosingResponseDto {
  id: string;
  businessDate: string;
  netCashKurus: number;
  netCardKurus: number;
  totalRevenueKurus: number;
  /** @nullable */
  notes: string | null;
  version: number;
  /** @nullable */
  createdBy: ClosingCreatorDto | null;
  /** @nullable */
  updatedBy: ClosingCreatorDto | null;
  createdAt: string;
  updatedAt: string;
}
