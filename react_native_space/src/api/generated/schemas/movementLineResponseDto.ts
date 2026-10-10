// @ts-nocheck

export interface MovementLineResponseDto {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  packageName: string;
  packageQuantity: number;
  conversionFactorUsed: number;
  /** @nullable */
  notes: string | null;
  /** @nullable */
  reason: string | null;
}
