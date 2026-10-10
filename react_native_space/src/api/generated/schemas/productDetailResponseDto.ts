// @ts-nocheck
import type { ConversionResponseDto } from './conversionResponseDto';
import type { InitialStockInfoDto } from './initialStockInfoDto';

export interface ProductDetailResponseDto {
  id: string;
  name: string;
  category: string;
  baseUnit: string;
  active: boolean;
  minStockThreshold: number;
  /** @nullable */
  initialStock: InitialStockInfoDto | null;
  conversions: ConversionResponseDto[];
  createdAt: string;
  updatedAt: string;
  /** @nullable */
  createdById: string | null;
}
