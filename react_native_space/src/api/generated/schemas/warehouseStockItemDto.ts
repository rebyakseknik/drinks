// @ts-nocheck

export interface WarehouseStockItemDto {
  productId: string;
  productName: string;
  category: string;
  baseUnit: string;
  currentStock: number;
  minStockThreshold: number;
  isBelowThreshold: boolean;
  hasInitialStock: boolean;
}
