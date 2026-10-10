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
  /**
     * Ürünün koli/paket birimi (en büyük katsayılı güncel dönüşüm). Tanımlı değilse null.
     * @nullable
     */
  packageName: string | null;
  /** @nullable */
  packageFactor: number | null;
}
