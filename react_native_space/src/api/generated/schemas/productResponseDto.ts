// @ts-nocheck

export interface ProductResponseDto {
  id: string;
  name: string;
  category: string;
  baseUnit: string;
  active: boolean;
  minStockThreshold: number;
  createdAt: string;
  updatedAt: string;
  /** @nullable */
  createdById: string | null;
}
