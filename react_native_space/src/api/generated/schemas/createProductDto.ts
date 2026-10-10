// @ts-nocheck

export interface CreateProductDto {
  name: string;
  category: string;
  baseUnit: string;
  /** @minimum 0 */
  minStockThreshold?: number;
}
