// @ts-nocheck

export interface UpdateProductDto {
  name?: string;
  category?: string;
  /** @minimum 0 */
  minStockThreshold?: number;
  active?: boolean;
}
